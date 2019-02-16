from django.contrib.auth import signals
from rest_framework_simplejwt import serializers as simplejwt_serializers
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.utils import datetime_from_epoch

from ..utils import logout


# Overrode the implementation for:
#  - to blacklist token on consequent login
#  - to send `user_logged_in` signal on login
class CustomTokenObtainPairSerializer(simplejwt_serializers.TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        logout(user=user)
        return super(CustomTokenObtainPairSerializer, cls).get_token(user)

    def validate(self, attrs):
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        signals.user_logged_in.send(sender=self.user.__class__, request=self.context['request'], user=self.user)
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