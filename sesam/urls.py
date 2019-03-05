from django.urls import path

from . import views


urlpatterns = [
    path(route='', view=views.home, name='home'),
    path(route='quiz/', view=views.stats, name='quiz-home'),
    path(route='quiz/create/', view=views.QuestionCreate.as_view(), name='quiz-create'),
    path(route='quiz/accept/', view=views.accept, name='quiz-accept')
]
