from rest_framework_simplejwt import views as views_sjwt

from . import serializers
from .. import base_views


class CustomTokenObtainPairView(base_views.LoggingApiView, views_sjwt.TokenObtainPairView):
    serializer_class = serializers.CustomTokenObtainPairSerializer


class CustomTokenRefreshView(base_views.LoggingApiView, views_sjwt.TokenRefreshView):
    serializer_class = serializers.CustomTokenRefreshSerializer