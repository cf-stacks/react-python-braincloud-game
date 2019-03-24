from django.contrib import auth
from django.contrib.auth import models as auth_models
from rest_framework import serializers


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth_models.Group
        fields = ('id', 'name')


class SubordinateSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.get_user_model()
        fields = ('id', 'name')


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)
    # subordinates = SubordinateSerializer(many=True)
    subordinates = serializers.SerializerMethodField()

    class Meta:
        model = auth.get_user_model()
        fields = ('id', 'email', 'name', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login', 'groups', 'subordinates')
        staff_fields = ('groups', 'subordinates')
        extra_kwargs = {'groups': {'read_only': True}, 'subordinates': {'read_only': True}}

    def __init__(self, *args, **kwargs):
        super(UserSerializer, self).__init__(*args, **kwargs)
        if not self.context['request'].user.is_staff:
            for field in self.Meta.staff_fields:
                self.fields.pop(field)

    def get_subordinates(self, instance):
        return SubordinateSerializer(instance.subordinates.order_by('name'), many=True).data


class AnonymousSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.get_user_model()
        fields = ('id', 'device_id', 'date_joined', 'last_login')


class RegisterUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = auth.get_user_model()
        fields = ('email', 'password', 'name')
        write_only_fields = ('password',)
        extra_kwargs = {'email': {'required': True}}

    def create(self, validated_data):
        user = self.Meta.model.objects.create_user(**validated_data)
        return user

    def to_representation(self, instance):
        return UserSerializer(instance=instance).data


class RegisterAnonymousSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.get_user_model()
        fields = ('device_id',)
        extra_kwargs = {'device_id': {'required': True}}

    def create(self, validated_data):
        validated_data['email'] = None
        user = self.Meta.model.objects.create_user(**validated_data)
        return user

    def to_representation(self, instance):
        return AnonymousSerializer(instance=instance).data



