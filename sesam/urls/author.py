from django.urls import path

from ..views import author as views


app_name = 'author'


urlpatterns = [
    path(route='', view=views.home, name='home'),
    path(route='create/', view=views.QuestionCreate.as_view(), name='quiz-create'),
]
