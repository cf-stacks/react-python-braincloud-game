from django.conf.urls import include
from django.urls import path

from rest_framework.routers import DefaultRouter

from . import views
from .jwt import views as jwt_views


router = DefaultRouter()
router.register(prefix=r'user', viewset=views.UserViewSet, base_name='user')


urlpatterns = [
    path('user/login/', jwt_views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/refresh/', jwt_views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('', view=include(router.urls)),
]