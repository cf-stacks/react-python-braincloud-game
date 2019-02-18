import uuid

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.mail import send_mail
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
