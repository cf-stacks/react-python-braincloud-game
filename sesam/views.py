from datetime import datetime
from datetime import timedelta

from django.contrib.auth import decorators
from django.db.models import Count
from django.db.models import Q
from django.shortcuts import render
from django.views import generic
from django.urls import reverse_lazy
from django.utils import timezone

from . import forms
from . import models


def home(request):
    return render(request, 'sesam/home.html')


def stats(request):
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
    return render(
        request=request,
        template_name='sesam/quiz-statistics.html',
        context={
            'total_month': statistics[0].total_month,
            'total_today': statistics[0].total_today,
            'accepted_yesterday': statistics[0].accepted_yesterday,
            'rejected_yesterday': statistics[0].rejected_yesterday,
        },
    )


class QuestionCreate(generic.CreateView):
    template_name = 'sesam/question_form.html'
    form_class = forms.QuestionCreateForm
    success_url = reverse_lazy('quiz-home')

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.author = self.request.user
        return super(QuestionCreate, self).form_valid(form)


def accept(request):
    if request.method == 'POST':
        accepted = request.POST.get('accept')
        rejected = request.POST.get('reject')
        if accepted:
            question = models.Question.objects.get(pk=accepted)
            question.status = models.Question.STATUS_ACCEPTED
            question.editor = request.user
            question.save(update_fields=['status', 'editor'])
        elif rejected:
            question = models.Question.objects.get(pk=rejected)
            question.status = models.Question.STATUS_REJECTED
            question.editor = request.user
            question.save(update_fields=['status', 'editor'])
        else:
            pass

    formset = forms.QuestionApproveFormSet(
        queryset=models.Question.objects.filter(
            status=models.Question.STATUS_NEW,
            created_at__date__lt=timezone.now().date(),
        ))
    return render(request=request, template_name='sesam/quiz-accept.html', context={'formset': formset})
