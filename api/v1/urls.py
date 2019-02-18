from django.conf.urls import include
from django.urls import path

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView

from . import views
from .jwt import views as jwt_views


router = DefaultRouter()
router.register(prefix=r'user', viewset=views.UserViewSet, base_name='user')
router.register(prefix=r'anonymous', viewset=views.AnonymousViewSet, base_name='anonymous')
router.register(prefix=r'gamesparks', viewset=views.GameSparksViewSet, base_name='gs')


urlpatterns = [
    path('user/login/', jwt_views.UserTokenObtainPairView.as_view(), name='user_token_obtain_pair'),
    path('anonymous/login/', jwt_views.AnonymousTokenObtainPairView.as_view(), name='anonymous_token_obtain_pair'),
    path('token/refresh/', jwt_views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    # path('token/info/', jwt_views.)
    path('token/verify/', jwt_views.CustomTokenVerifyView.as_view(), name='token_verify'),
    path('', view=include(router.urls)),
]