import logging

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from sesame import models

from . import mixins
from . import serializers
from .utils import logout

logger = logging.getLogger(__name__)


class UserViewSet(mixins.LoggingMixin, viewsets.ModelViewSet):
    queryset = models.User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer

    @action(methods=['post'], detail=False)
    def info(self, request):
        return Response(data=self.serializer_class(instance=request.user).data)

    @action(methods=['post'], detail=False, permission_classes=[])
    def register(self, request):
        serializer = serializers.RegisterUserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(data={'message': 'Registered successfully'}, status=201)

    @action(methods=['post'], detail=False)
    def logout(self, request):
        logout(user=request.user)
        return Response(data={'message': 'Logged out successfully'})


class GameSparksViewSet(mixins.LoggingMixin, viewsets.ViewSet):

    @action(methods=['post'], detail=False)
    def delay(self, request):
        from sesame.celery_stub import DummyThread
        t = DummyThread(request=request)
        t.start()
        return Response(data={'message': 'Event is logged'})
