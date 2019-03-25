from datetime import datetime
from datetime import timedelta

from django.db.models import Count
from django.db.models import Q
from django.utils import timezone
from rest_framework import decorators
from rest_framework import permissions
from rest_framework import response
from rest_framework import viewsets

from sesam import models

from ..v1 import mixins


class AuthorViewSet(mixins.LoggingMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAdminUser]

    @decorators.action(detail=False)
    def statistics(self, request):
        statistics = models.User.objects.filter(pk=request.user.pk).annotate(
        total_month=Count(
            'authored_questions',
            filter=Q(
                authored_questions__created_at__gte=timezone.now().replace(
                    day=1, hour=0, minute=0, second=0, microsecond=0,
                )
            ) & (
                Q(authored_questions__status=models.Question.STATUS_ACCEPTED) |
                Q(authored_questions__status=models.Question.STATUS_NEW)
            ),
        ),
        total_today=Count('authored_questions', filter=Q(authored_questions__created_at__date=datetime.today())),
        accepted_last_shift=Count(
            'authored_questions',
            filter=Q(
                authored_questions__created_at__date=datetime.today() - timedelta(days=1),
                authored_questions__status=models.Question.STATUS_ACCEPTED
            ),
        ),
        rejected_last_shift=Count(
            'authored_questions',
            filter=Q(
                authored_questions__created_at__date=datetime.today() - timedelta(days=1),
                authored_questions__status=models.Question.STATUS_REJECTED
            ),
        )
    )
        return response.Response(
            data={
                'total_month': statistics[0].total_month,
                'total_today': statistics[0].total_today,
                'accepted_last_shift': statistics[0].accepted_last_shift,
                'rejected_last_shift': statistics[0].rejected_last_shift,
            }
        )
