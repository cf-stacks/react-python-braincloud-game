import os

os.environ['S_DEBUG'] = os.environ.get('S_DEBUG', '0')

ALLOWED_HOSTS = ['52.193.213.171', 'localhost']

from .base import *  # noqa: F403  # pylint:disable=wildcard-import,wrong-import-position
