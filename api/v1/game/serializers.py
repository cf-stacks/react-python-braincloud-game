from django.contrib import auth
from rest_framework import serializers

from sesam import models


class GameSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GameSetting
        fields = ('min_players', 'max_players', 'wait_time')


class GameSerializer(serializers.ModelSerializer):
    setting = GameSettingSerializer()

    class Meta:
        model = models.Game
        fields = ('id', 'name', 'game_type', 'setting')


class StatisticGameSerializer(serializers.Serializer):
    rooms = serializers.SerializerMethodField()
    users = serializers.SerializerMethodField()
    money = serializers.SerializerMethodField()

    class Meta:
        model = models.Game
        fields = ('rooms', 'users')

    def to_representation(self, instance):
        instance.all_rooms = instance.rooms.all()
        instance.open_rooms = instance.rooms.filter(started_at__isnull=True)
        return super(StatisticGameSerializer, self).to_representation(instance)

    def get_rooms(self, instance):
        return {
            'total': instance.all_rooms.count(),
            'open': instance.open_rooms.count(),
        }

    def get_users(self, instance):
        return auth.get_user_model().objects.filter(room__in=instance.all_rooms).count()

    def get_money(self, instance):
        return {
            'total': sum([room.bet * room.users.count() for room in instance.all_rooms]),
            'open': sum([room.bet * room.users.count() for room in instance.open_rooms])
        }


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Room
        fields = ('users', 'game', 'external_id', 'bet')


class JoinRoomSerializer(serializers.Serializer):
    external_id = serializers.UUIDField()
    bet = serializers.DecimalField(max_digits=10, decimal_places=2)


class LeaveRoomSerializer(serializers.Serializer):
    external_id = serializers.UUIDField()
