import os

os.environ['S_DEBUG'] = os.environ.get('S_DEBUG', '1')

ALLOWED_HOSTS = []

from .base import *  # noqa: F403  # pylint:disable=wildcard-import,wrong-import-position

MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware'] + MIDDLEWARE
INSTALLED_APPS = INSTALLED_APPS + ['debug_toolbar',]
