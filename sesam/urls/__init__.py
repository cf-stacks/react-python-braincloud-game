from decorator_include import decorator_include
from django.urls import path

from .. import models
from .. import views
from .. decorators import require_group


urlpatterns = [
    path(route='', view=views.home, name='home'),

    path(
        route=f'{models.USER_GROUP_CHIEF}/',
        view=decorator_include(require_group(models.USER_GROUP_CHIEF), ('sesam.urls.chief', models.USER_GROUP_CHIEF))
    ),
    path(
        route=f'{models.USER_GROUP_AUTHOR}/',
        view=decorator_include(require_group(models.USER_GROUP_AUTHOR), ('sesam.urls.author', models.USER_GROUP_AUTHOR))
    ),
    path(
        route=f'{models.USER_GROUP_EDITOR}/',
        view=decorator_include(require_group(models.USER_GROUP_EDITOR), ('sesam.urls.editor', models.USER_GROUP_EDITOR))
    ),
]
