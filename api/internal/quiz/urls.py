from django.conf.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(prefix=r'question', viewset=views.QuestionViewSet, base_name='question')
router.register(prefix=r'category', viewset=views.QuestionCategoryViewSet, base_name='category')


urlpatterns = [
    # API endpoints
    path('', view=include(router.urls)),
]