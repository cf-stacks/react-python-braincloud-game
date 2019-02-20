import logging

from rest_framework import decorators
from rest_framework import response
from rest_framework import viewsets
from rest_framework import serializers as drf_serializers

from sesam import models

from . import mixins
from . import serializers
from .utils import logout
from .. import permissions

logger = logging.getLogger(__name__)


class UserViewSet(mixins.LoggingMixin, viewsets.GenericViewSet):
    queryset = models.User.objects.filter(email__isnull=False).order_by('-date_joined')
    permission_classes = (permissions.IsUserPermission,)
    serializer_classes = {
        'info': serializers.UserSerializer,
        'register': serializers.RegisterUserSerializer,
        'logout': drf_serializers.Serializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)

    @decorators.action(methods=['get'], detail=False)
    def info(self, request):
        return response.Response(data=self.serializer_class(instance=request.user).data)

    @decorators.action(methods=['post'], detail=False, permission_classes=[])
    def register(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return response.Response(data={'message': 'User registered successfully'}, status=201)

    @decorators.action(methods=['post'], detail=False)
    def logout(self, request):
        logout(user=request.user)
        return response.Response(data={'message': 'Logged out successfully'})


class AnonymousViewSet(mixins.LoggingMixin, viewsets.GenericViewSet):
    queryset = models.User.objects.filter(device_id__isnull=False).order_by('-date_joined')
    serializer_class = serializers.AnonymousSerializer
    permission_classes = (permissions.IsAnonymousPermission,)
    serializer_classes = {
        'info': serializers.AnonymousSerializer,
        'register': serializers.RegisterAnonymousSerializer,
        'logout': drf_serializers.Serializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)

    @decorators.action(methods=['get'], detail=False)
    def info(self, request):
        return response.Response(data=self.serializer_class(instance=request.user).data)

    @decorators.action(methods=['post'], detail=False, permission_classes=[])
    def register(self, request):
        serializer = serializers.RegisterAnonymousSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return response.Response(data={'message': 'Anonymous user registered successfully'}, status=201)

    @decorators.action(methods=['post'], detail=False)
    def logout(self, request):
        logout(user=request.user)
        return response.Response(data={'message': 'Logged out successfully'})
