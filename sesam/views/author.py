from datetime import datetime
from datetime import timedelta

from django.db.models import Count
from django.db.models import Q
from django.shortcuts import render
from django.views import generic
from django.urls import reverse_lazy
from django.utils import timezone

from .. import models
from ..forms import author as forms


def home(request):
    statistics = models.User.objects.filter(pk=request.user.pk).annotate(
        total_month=Count(
            'authored_questions',
            filter=Q(
                authored_questions__created_at__gte=timezone.now().replace(
                    day=1, hour=0, minute=0, second=0, microsecond=0,
                )
            ) & (
                Q(authored_questions__status=models.Question.STATUS_ACCEPTED) |
                Q(authored_questions__status=models.Question.STATUS_DRAFT)
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
    return render(
        request=request,
        template_name='sesam/author/home.html',
        context={
            'total_month': statistics[0].total_month,
            'total_today': statistics[0].total_today,
            'accepted_yesterday': statistics[0].accepted_yesterday,
            'rejected_yesterday': statistics[0].rejected_yesterday,
        },
    )


class QuestionCreate(generic.CreateView):
    template_name = 'sesam/author/quiz-form.html'
    form_class = forms.QuestionCreateForm
    success_url = reverse_lazy('author:home')

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.author = self.request.user
        return super(QuestionCreate, self).form_valid(form)
