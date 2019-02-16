from rest_framework_simplejwt import views as views_sjwt

from . import serializers
from .. import mixins


class CustomTokenObtainPairView(mixins.LoggingMixin, views_sjwt.TokenObtainPairView):
    serializer_class = serializers.CustomTokenObtainPairSerializer


class CustomTokenRefreshView(mixins.LoggingMixin, views_sjwt.TokenRefreshView):
    serializer_class = serializers.CustomTokenRefreshSerializer
