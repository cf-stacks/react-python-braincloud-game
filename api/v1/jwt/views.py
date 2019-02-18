from rest_framework_simplejwt import views as views_sjwt

from . import serializers
from .. import mixins


class UserTokenObtainPairView(mixins.LoggingMixin, views_sjwt.TokenObtainPairView):
    serializer_class = serializers.UserTokenObtainPairSerializer


class AnonymousTokenObtainPairView(mixins.LoggingMixin, views_sjwt.TokenObtainPairView):
    serializer_class = serializers.AnonymousTokenObtainPairSerializer


class CustomTokenRefreshView(mixins.LoggingMixin, views_sjwt.TokenRefreshView):
    serializer_class = serializers.CustomTokenRefreshSerializer


class CustomTokenVerifyView(mixins.LoggingMixin, views_sjwt.TokenVerifyView):
    serializer_class = serializers.CustomTokenVerifySerializer
