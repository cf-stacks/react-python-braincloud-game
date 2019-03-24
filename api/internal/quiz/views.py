from collections import defaultdict
from logging import getLogger

from django.db.models import Count
from django.db.models import Q
from django.db.models.functions import TruncDate
from django.utils import timezone

from rest_framework import decorators
from rest_framework import permissions
from rest_framework import response
from rest_framework import viewsets

from sesam import models

from . import serializers
from ...v1 import mixins

logger = getLogger(__name__)


class QuestionViewSet(mixins.LoggingMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = models.Question.objects.all()
    serializer_class = serializers.QuestionSerializer
    serializer_classes = {
        'today': serializers.QuestionSerializer,
        'pending': serializers.PendingQuestionSerializer,
        'create': serializers.CreateQuestionSerializer,
        'statistics': serializers.StatisticsSerializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)

    @decorators.action(detail=False)
    def today(self, request):
        queryset = models.Question.objects.filter(author=request.user, created_at__date=timezone.localdate(timezone.now()))
        serializer = self.get_serializer(queryset, many=True)
        return response.Response(data=serializer.data)

    @decorators.action(detail=False)
    def pending(self, request):
        queryset = models.Question.objects.filter(
            status=models.Question.STATUS_NEW,
            created_at__date__lt=timezone.localtime(timezone.now()).date(),
            author__in=request.user.subordinates.all(),
        )
        serializer = self.get_serializer(queryset, many=True)
        return response.Response(data=serializer.data)

    @decorators.action(detail=True)
    def pending_user(self, request, pk):
        queryset = models.Question.objects.filter(
            status=models.Question.STATUS_NEW,
            created_at__date__lt=timezone.localtime(timezone.now()).date(),
            author_id=pk,
        )
        serializer = self.get_serializer(queryset, many=True)
        return response.Response(data=serializer.data)

    @decorators.action(detail=False)
    def statistics(self, request):
        serializer = self.get_serializer(data=request.query_params)
        if serializer.is_valid(raise_exception=True):
            statistics = defaultdict(dict)
            statistic = models.Question.objects.all().values('author_id').filter(
                created_at__date__range=(serializer.data['start_date'], serializer.data['end_date']),
            ).annotate(
                created_at=TruncDate('created_at'),
            ).annotate(
                rejected=Count('id', filter=Q(status=models.Question.STATUS_REJECTED)),
                accepted=Count('id', filter=Q(status=models.Question.STATUS_ACCEPTED)),
                new=Count('id', filter=Q(status=models.Question.STATUS_NEW)),
            )
            for stat in statistic:
                statistics[str(stat['author_id'])][str(stat['created_at'])] = {
                  'new': stat['new'], 'accepted': stat['accepted'], 'rejected': stat['rejected'],
                }

            if request.user.groups.filter(name__iexact=models.USER_GROUP_CHIEF).exists():
                statistic = models.Question.objects.exclude(status=models.Question.STATUS_NEW).values('editor_id').filter(
                    reviewed_at__date__range=(serializer.data['start_date'], serializer.data['end_date']),
                ).annotate(
                    reviewed_at=TruncDate('reviewed_at'),
                ).annotate(
                    rejected=Count('id', filter=Q(status=models.Question.STATUS_REJECTED)),
                    accepted=Count('id', filter=Q(status=models.Question.STATUS_ACCEPTED)),
                )
                for stat in statistic:
                    statistics[str(stat['editor_id'])][str(stat['reviewed_at'])] = {
                      'accepted': stat['accepted'], 'rejected': stat['rejected'],
                    }
            return response.Response(data=statistics)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class QuestionCategoryViewSet(mixins.LoggingMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = models.QuestionCategory.objects.all()
    serializer_class = serializers.QuestionCategorySerializer
    serializer_classes = {
        'list': serializers.QuestionCategorySerializer,
        'assigned': serializers.StatisticsSerializer,
        'today': serializers.QuestionCategorySerializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.serializer_class)

    @decorators.action(detail=False)
    def today(self, request):
        queryset = request.user.assigned_categories.filter(
            assignedquestioncategory__date=timezone.localdate(timezone.now()),
        )
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)

    @decorators.action(detail=False, methods=('POST', 'GET', 'DELETE'))
    def assigned(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(data=request.query_params)
            if serializer.is_valid(raise_exception=True):
                queryset = models.AssignedQuestionCategory.objects.filter(
                    date__range=(serializer.data['start_date'], serializer.data['end_date']),
                )
                data = defaultdict(lambda: defaultdict(list))
                for item in queryset:
                    data[str(item.user_id)][str(item.date)].append(str(item.category_id))
                return response.Response(data=data)
        else:
            serializer = serializers.AssignedQuestionSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                if request.method == 'POST':
                    for category in serializer.data['categories']:
                        models.AssignedQuestionCategory.objects.get_or_create(
                            user_id=serializer.data['user'],
                            date=serializer.data['date'],
                            category_id=category,
                        )
                    return response.Response(data={}, status=201)
                else:
                    models.AssignedQuestionCategory.objects.filter(
                        user_id=serializer.data['user'],
                        date=serializer.data['date'],
                        category_id__in=serializer.data['categories'],
                    ).delete()
                    return response.Response(data={}, status=200)

