from django.core.exceptions import ValidationError

from rest_framework import decorators
from rest_framework import permissions
from rest_framework import response
from rest_framework import viewsets

from sesam import models

from . import serializers
from .. import mixins


class GameViewSet(mixins.LoggingMixin, viewsets.ReadOnlyModelViewSet):
    queryset = models.Game.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'game_type'
    serializer_classes = {
        'list': serializers.GameSerializer,
        'retrieve': serializers.GameSerializer,
        'join': serializers.JoinRoomSerializer,
        'leave': serializers.LeaveRoomSerializer,
        'stats': serializers.StatisticGameSerializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action)

    @decorators.action(methods=['get'], detail=True)
    def stats(self, request, *args, **kwargs):
        return response.Response(data=self.get_serializer(instance=self.get_object()).data)

    @decorators.action(methods=['post'], detail=True)
    def join(self, request,  *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            game = self.get_object()
            room = models.Room.objects.get_or_create(
                external_id=serializer.data['external_id'],
                defaults={'game': game, 'bet': serializer.data['bet']}
            )[0]
            try:
                room.enter(request.user)
            except ValidationError as e:
                return response.Response(data={'detail': e.message}, status=400)
            return response.Response(data=serializers.RoomSerializer(instance=room).data)

    @decorators.action(methods=['post'], detail=True)
    def leave(self, request,  *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            room = models.Room.objects.get(external_id=serializer.data['external_id'])
            try:
                room.leave(request.user)
            except ValidationError as e:
                return response.Response(data={'detail': e.message}, status=400)
            return response.Response(data=serializers.RoomSerializer(instance=room).data)
