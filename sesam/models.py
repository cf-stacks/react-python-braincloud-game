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

USER_GROUP_AUTHOR = 'author'
USER_GROUP_EDITOR = 'editor'
USER_GROUP_CHIEF = 'chief'
USER_GROUPS = (
    USER_GROUP_AUTHOR, USER_GROUP_EDITOR, USER_GROUP_CHIEF,
)


class User(AbstractBaseUser, PermissionsMixin):

    id = models.UUIDField(verbose_name=_('id'), primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(verbose_name=_('email address'), unique=True, db_index=True, null=True)
    name = models.CharField(verbose_name=_('name'), max_length=30)
    is_staff = models.BooleanField(verbose_name=_('staff status'), default=False)
    is_active = models.BooleanField(verbose_name=_('active'), default=True)
    date_joined = models.DateTimeField(verbose_name=_('date joined'), default=timezone.now)
    device_id = models.UUIDField(verbose_name=_('device id'), unique=True, db_index=True, null=True)
    money = models.DecimalField(verbose_name=_('money'), max_digits=10, decimal_places=2, default=0)
    points = models.DecimalField(verbose_name=_('points'), max_digits=10, decimal_places=2, default=0)
    boss = models.ForeignKey(
        verbose_name=_('boss'),
        to='sesam.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='subordinates',
    )

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return f'{self.name} ({self.email})'

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
    id = models.UUIDField(verbose_name='id', primary_key=True, default=uuid.uuid4, editable=False)
    is_active = models.BooleanField(verbose_name=_('active'), default=True)
    created_at = models.DateTimeField(verbose_name=_('created at'), default=timezone.now, editable=False, blank=True)
    updated_at = models.DateTimeField(verbose_name=_('updated at'), default=timezone.now, editable=False, blank=True)
    created_at.editable = True

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not kwargs.pop('skip_update', False):
            self.updated_at = timezone.now()
        super(BaseModel, self).save(*args, **kwargs)


class UserMoneyLogModel(BaseModel):
    DIRECTION_IN = 0
    DIRECTION_OUT = 1
    DIRECTIONS = (
        (DIRECTION_IN, _('direction in')),
        (DIRECTION_OUT, _('direction out')),
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    direction = models.SmallIntegerField(choices=DIRECTIONS, default=DIRECTION_IN)
    comment = models.CharField(max_length=150)
    points = models.BooleanField(default=False)


class QuestionCategory(BaseModel):
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name = _('question category')
        verbose_name_plural = _('question categories')

    def __str__(self):
        return self.name

    def __repr__(self):
        return f'<QuestionCategory {self.id}: {self.__str__()}>'


class Question(BaseModel):
    STATUS_NEW = 0
    STATUS_ACCEPTED = 1
    STATUS_REJECTED = 2
    STATUSES = (
        (STATUS_NEW, _('new')),
        (STATUS_ACCEPTED, _('accepted')),
        (STATUS_REJECTED, _('rejected')),
    )
    category = models.ForeignKey(
        verbose_name=_('question category'),
        to='sesam.QuestionCategory',
        on_delete=models.CASCADE,
    )
    description = models.TextField(verbose_name=_('description'))
    author = models.ForeignKey(
        verbose_name=_('author'),
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='authored_questions',
    )
    editor = models.ForeignKey(
        verbose_name=_('editor'),
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='edited_questions',
        null=True,
        blank=True,
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    status = models.PositiveSmallIntegerField(verbose_name=_('status'), choices=STATUSES, default=STATUS_NEW)
    answer_correct = models.CharField(verbose_name=_('correct answer'), max_length=100)
    answer_incorrect_1 = models.CharField(verbose_name=_('incorrect answer 1'), max_length=100)
    answer_incorrect_2 = models.CharField(verbose_name=_('incorrect answer 2'), max_length=100)

    class Meta:
        verbose_name = _('question')
        verbose_name_plural = _('questions')


class Game(BaseModel):
    GAME_QUIZ = 'quiz'
    GAME_DURAK = 'durak'
    GAME_ARKANOID = 'arkanoid'
    GAMES = (
        (GAME_QUIZ, _('quiz')),
        (GAME_DURAK, _('durak')),
        (GAME_ARKANOID, _('arkanoid')),
    )

    name = models.CharField(verbose_name=_('name'), max_length=100)
    game_type = models.CharField(
        verbose_name=_('game type'), choices=GAMES, default=GAME_QUIZ, max_length=20, unique=True,
    )
    setting = models.OneToOneField(verbose_name=_('setting'), to='sesam.GameSetting', on_delete=models.CASCADE)


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
