import logging

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from sesam import models

from . import mixins
from . import serializers
from .utils import logout
from ..permissions import IsAnonymousPermission
from ..permissions import IsUserPermission

logger = logging.getLogger(__name__)


class UserViewSet(mixins.LoggingMixin, viewsets.GenericViewSet):
    queryset = models.User.objects.filter(email__isnull=False).order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = (IsUserPermission,)

    @action(methods=['get'], detail=False)
    def info(self, request):
        return Response(data=self.serializer_class(instance=request.user).data)

    @action(methods=['post'], detail=False, permission_classes=[])
    def register(self, request):
        serializer = serializers.RegisterUserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(data={'message': 'User registered successfully'}, status=201)

    @action(methods=['post'], detail=False)
    def logout(self, request):
        logout(user=request.user)
        return Response(data={'message': 'Logged out successfully'})


class AnonymousViewSet(mixins.LoggingMixin, viewsets.GenericViewSet):
    queryset = models.User.objects.filter(device_id__isnull=False).order_by('-date_joined')
    serializer_class = serializers.AnonymousSerializer
    permission_classes = (IsAnonymousPermission,)

    @action(methods=['get'], detail=False)
    def info(self, request):
        return Response(data=self.serializer_class(instance=request.user).data)

    @action(methods=['post'], detail=False, permission_classes=[])
    def register(self, request):
        serializer = serializers.RegisterDeviceSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(data={'message': 'Anonymous user registered successfully'}, status=201)

    @action(methods=['post'], detail=False)
    def logout(self, request):
        logout(user=request.user)
        return Response(data={'message': 'Logged out successfully'})


class GameSparksViewSet(mixins.LoggingMixin, viewsets.ViewSet):

    @action(methods=['post'], detail=False)
    def delay(self, request):
        from sesam.celery_stub import DummyThread
        t = DummyThread(request=request)
        t.start()
        return Response(data={'message': 'Event is logged'})
