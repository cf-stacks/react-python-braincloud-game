from functools import wraps

from django.contrib.auth.decorators import user_passes_test
from django.core.exceptions import PermissionDenied


def test_group(group_name):
    @wraps(group_name)
    def wrapper(user):
        if not user.is_superuser and not user.groups.filter(name__iexact=group_name).exists():
            raise PermissionDenied
        return True
    return wrapper


def require_group(group_name):
    @wraps(group_name)
    def wrapper(func):
        return user_passes_test(test_group(group_name))(func)
    return wrapper
