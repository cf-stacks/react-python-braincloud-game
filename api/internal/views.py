from datetime import datetime
from datetime import timedelta

from django.db.models import Count
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import ugettext
from rest_framework import authentication
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
        request.user = models.User.objects.get(name='Автор 1')
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
        accepted_yesterday=Count(
            'authored_questions',
            filter=Q(
                authored_questions__created_at__date=datetime.today() - timedelta(days=1),
                authored_questions__status=models.Question.STATUS_ACCEPTED
            ),
        ),
        rejected_yesterday=Count(
            'authored_questions',
            filter=Q(
                authored_questions__created_at__date=datetime.today() - timedelta(days=1),
                authored_questions__status=models.Question.STATUS_REJECTED
            ),
        )
    )
        return response.Response(
            data=[
                {
                    'title': ugettext('Month total'),
                    'value': statistics[0].total_month,
                },
                {
                    'title': ugettext('Added today'),
                    'value': statistics[0].total_today,
                },
                {
                    'title': ugettext('Accepted last shift'),
                    'value': statistics[0].accepted_yesterday,
                },
                {
                    'title': ugettext('Rejected last shift'),
                    'value': statistics[0].rejected_yesterday,
                },
            ]
        )
