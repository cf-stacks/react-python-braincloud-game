from django.contrib import auth
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.get_user_model()
        fields = ('id', 'email', 'name', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login')


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


class RegisterDeviceSerializer(serializers.ModelSerializer):
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



