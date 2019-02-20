from rest_framework import serializers


class GSDelaySerializer(serializers.Serializer):

    event_key = serializers.CharField()
    timeout = serializers.DecimalField(max_digits=3, decimal_places=2)
    data = serializers.JSONField()
