import os

os.environ['S_DEBUG'] = os.environ.get('S_DEBUG', '0')

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

from .base import *  # noqa: F403  # pylint:disable=wildcard-import,wrong-import-position
