from django.utils import timezone
from rest_framework import decorators
from rest_framework import permissions
from rest_framework import response
from rest_framework import viewsets

from sesam import models

from . import serializers
from ...v1 import mixins


class QuestionViewSet(mixins.LoggingMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = models.Question.objects.all()
    serializer_class = serializers.QuestionSerializer

    @decorators.action(detail=False)
    def today(self, request):
        queryset = models.Question.objects.filter(author=request.user, created_at__date=timezone.localdate(timezone.now()))
        serializer = self.get_serializer(queryset, many=True)
        return response.Response(data=serializer.data)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class QuestionCategoryViewSet(mixins.LoggingMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = models.QuestionCategory.objects.all()
    serializer_class = serializers.QuestionCategorySerializer
