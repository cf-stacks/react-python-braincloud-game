from django.urls import path

from ..views import editor as views


app_name = 'editor'


urlpatterns = [
    path(route='', view=views.home, name='home'),
    path(route='accept/', view=views.accept, name='quiz-accept'),
    path(route='accept/<uuid:user_id>/', view=views.accept, name='quiz-accept'),
]
