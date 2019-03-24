import os

os.environ['S_DEBUG'] = os.environ.get('S_DEBUG', 'True')

from .base import *  # noqa: F403  # pylint:disable=wildcard-import,wrong-import-position

INSTALLED_APPS = INSTALLED_APPS + ('debug_toolbar',)
