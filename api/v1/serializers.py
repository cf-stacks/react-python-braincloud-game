from django.contrib import auth
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.get_user_model()
        fields = ('id', 'email', 'name', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login')


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.get_user_model()
        fields = ('email', 'password', 'name')
        write_only_fields = ('password',)

    def create(self, validated_data):
        user = self.Meta.model.objects.create_user(**validated_data)
        return user

    def to_representation(self, instance):
        return UserSerializer(instance=instance).data



