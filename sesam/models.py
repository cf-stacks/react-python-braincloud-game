import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from sesam.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    id = models.UUIDField(verbose_name='ID', primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(verbose_name=_('Email'), unique=True, db_index=True, null=True)
    name = models.CharField(verbose_name=_('Name'), max_length=30)
    is_staff = models.BooleanField(verbose_name=_('Staff status'), default=False)
    is_active = models.BooleanField(verbose_name=_('Active'), default=True)
    date_joined = models.DateTimeField(verbose_name=_('Date joined'), default=timezone.now)
    device_id = models.UUIDField(verbose_name=_('Device ID'), unique=True, db_index=True, null=True)
    money = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    points = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'

    class Meta:
        verbose_name = 'User'

    def __str__(self):
        return str(self.get_username())

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def pay(self, amount, comment, points=False):
        if self.money < amount:
            raise ValidationError('User does not have enough money')
        UserMoneyLogModel.objects.create(
            amount=amount,
            direction=UserMoneyLogModel.DIRECTION_OUT,
            comment=comment,
            points=points,
        )
        if points:
            self.points = self.points - amount
        else:
            self.money = self.money - amount
        self.save()

    def receive(self, amount, comment, points=False):
        UserMoneyLogModel.objects.create(
            amount=amount,
            direction=UserMoneyLogModel.DIRECTION_IN,
            comment=comment,
            points=points,
        )
        if points:
            self.points = self.points + amount
        else:
            self.money = self.money + amount
        self.save()


class BaseModel(models.Model):
    id = models.UUIDField(verbose_name='ID', primary_key=True, default=uuid.uuid4, editable=False)
    is_active = models.BooleanField(default=True)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UserMoneyLogModel(BaseModel):
    DIRECTION_IN = 0
    DIRECTION_OUT = 1
    DIRECTIONS = (
        (DIRECTION_IN, _('In')),
        (DIRECTION_OUT, _('Out')),
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    direction = models.SmallIntegerField(choices=DIRECTIONS, default=DIRECTION_IN)
    comment = models.CharField(max_length=150)
    points = models.BooleanField(default=False)


class QuestionCategory(BaseModel):
    name = models.CharField(max_length=50)


class Question(BaseModel):
    STATUS_NEW = 0
    STATUS_APPROVED = 1
    STATUS_DECLINED = 2
    STATUSES = (
        (STATUS_NEW, _('New')),
        (STATUS_APPROVED, _('Approved')),
        (STATUS_DECLINED, _('Declined')),
    )
    category = models.ForeignKey(to='sesam.QuestionCategory', on_delete=models.CASCADE)
    description = models.TextField()
    author = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='authored_questions')
    editor = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='edited_questions')
    status = models.PositiveSmallIntegerField(choices=STATUSES, default=STATUS_NEW)
    answer_correct = models.CharField(max_length=100)
    answer_incorrect_1 = models.CharField(max_length=100)
    answer_incorrect_2 = models.CharField(max_length=100)


class Game(BaseModel):
    GAME_QUIZ = 'quiz'
    GAME_DURAK = 'durak'
    GAME_ARKANOID = 'arkanoid'
    GAMES = (
        (GAME_QUIZ, _('Quiz')),
        (GAME_DURAK, _('Durak')),
        (GAME_ARKANOID, _('Arkanoid')),
    )

    name = models.CharField(max_length=100)
    game_type = models.CharField(choices=GAMES, default=GAME_QUIZ, max_length=20, unique=True)
    setting = models.OneToOneField(to='sesam.GameSetting', on_delete=models.CASCADE)


class GameSetting(BaseModel):
    min_players = models.PositiveSmallIntegerField(default=2)
    max_players = models.PositiveSmallIntegerField(default=4)
    wait_time = models.PositiveSmallIntegerField(default=30)


class Room(BaseModel):
    users = models.ManyToManyField(to=settings.AUTH_USER_MODEL)
    external_id = models.UUIDField()
    game = models.ForeignKey(to='sesam.Game', on_delete=models.CASCADE, related_name='rooms')
    bet = models.DecimalField(max_digits=10, decimal_places=2)
    started_at = models.DateTimeField(null=True)

    def enter(self, user):
        if user in self.users.all():
            raise ValidationError('User already joined')
        elif self.users.count() >= self.game.setting.max_players:
            raise ValidationError('Room is full')
        user.pay(amount=self.bet, comment=f'To enter {self.game.name}')
        self.users.add(user)

    def leave(self, user):
        if user not in self.users.all():
            raise ValidationError('User is not joined')
        elif self.started_at:
            raise ValidationError(f'Cannot leave as the game started at {self.started_at}')
        user.receive(amount=self.bet, comment=f'Left from {self.game.name}')
        self.users.remove(user)
