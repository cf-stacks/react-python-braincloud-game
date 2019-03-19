from decorator_include import decorator_include
from django.urls import path

from .. import views
from .. decorators import require_group


urlpatterns = [
    path(route='', view=views.home, name='home'),

    path(route='chief/', view=decorator_include(require_group('chief'), ('sesam.urls.chief', 'chief'))),
    path(route='author/', view=decorator_include(require_group('author'), ('sesam.urls.author', 'author'))),
    path(route='editor/', view=decorator_include(require_group('editor'), ('sesam.urls.editor', 'editor'))),
]
