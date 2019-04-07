from rest_framework import decorators
from rest_framework import permissions
from rest_framework import response
from rest_framework import viewsets

from . import serializers
from .. import mixins


class GameSparksViewSet(mixins.LoggingMixin, viewsets.GenericViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_classes = {
        'delay': serializers.GSDelaySerializer
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action)

    @decorators.action(methods=['post'], detail=False)
    def delay(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            from sesam.celery_stub import DummyThread
            t = DummyThread(request=request)
            t.start()
            return response.Response(data={'message': 'Event is logged'})
