from django.contrib import auth
from django.utils.six import text_type
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt import serializers as simplejwt_serializers
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.utils import datetime_from_epoch

from ..utils import logout


# Overrode the implementation for:
#  - to blacklist token on consequent login
#  - to send `user_logged_in` signal on login
class BaseTokenObtainPairSerializer(simplejwt_serializers.TokenObtainPairSerializer):

    user_type = None

    @classmethod
    def get_token(cls, user):
        logout(user=user)
        token = super(BaseTokenObtainPairSerializer, cls).get_token(user)
        token['user_type'] = cls.user_type
        return token

    def validate(self, attrs):
        data = super(BaseTokenObtainPairSerializer, self).validate(attrs)
        auth.signals.user_logged_in.send(sender=self.user.__class__, request=self.context['request'], user=self.user)
        return data


class UserTokenObtainPairSerializer(BaseTokenObtainPairSerializer):
    user_type = 'user'


# Overrode validate to being able to get user by device_id
class AnonymousTokenObtainPairSerializer(BaseTokenObtainPairSerializer):
    user_type = 'anonymous'
    device_id = serializers.UUIDField()

    def __init__(self, *args, **kwargs):
        serializers.Serializer.__init__(self, *args, **kwargs)

    def validate(self, attrs):
        try:
            self.user = auth.get_user_model().objects.get(device_id=attrs['device_id'])
        except auth.get_user_model().DoesNotExist:
            self.user = None

        if self.user is None or not self.user.is_active:
            raise serializers.ValidationError(
                _('No active account found with the given credentials'),
            )

        data = {}
        refresh = self.get_token(self.user)
        data['refresh'] = text_type(refresh)
        data['access'] = text_type(refresh.access_token)
        auth.signals.user_logged_in.send(sender=self.user.__class__, request=self.context['request'], user=self.user)
        return data


# Overrode the implementation for:
#  - to create `OutstandingToken` on refresh
class CustomTokenRefreshSerializer(simplejwt_serializers.TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                token = RefreshToken(data['refresh'])
                OutstandingToken.objects.create(
                    user_id=token['user_id'],
                    jti=token['jti'],
                    token=str(token),
                    created_at=token.current_time,
                    expires_at=datetime_from_epoch(token['exp']),
                )
        return data


# Overrode the implementation for:
# - to return token's payload
class CustomTokenVerifySerializer(simplejwt_serializers.TokenVerifySerializer):
    def validate(self, attrs):
        return UntypedToken(attrs['token']).payload
