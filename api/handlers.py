from django.core.exceptions import ValidationError

from rest_framework import exceptions
from rest_framework.serializers import as_serializer_error

from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    if isinstance(exc, ValidationError):
        exc = exceptions.ValidationError(detail=as_serializer_error(exc))
    return exception_handler(exc, context)
