import os

os.environ['S_DEBUG'] = os.environ.get('S_DEBUG', '0')

from .base import *  # noqa: F403  # pylint:disable=wildcard-import,wrong-import-position
