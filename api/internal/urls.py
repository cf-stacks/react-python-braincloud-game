from django.conf.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(prefix=r'author', viewset=views.AuthorViewSet, base_name='author')


urlpatterns = [
    # API endpoints
    path(route='', view=include(router.urls)),
    path(route='quiz/', view=include('api.internal.quiz.urls')),
]