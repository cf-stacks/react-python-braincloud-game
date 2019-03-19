from calendar import monthrange
from collections import defaultdict
from datetime import timedelta

from django.db.models import Count
from django.db.models import Q
from django.db.models.functions import TruncDate
from django.shortcuts import render
from django.utils import timezone

from .. import models
from ..forms import chief as forms


def home(request):
    context = {}
    return render(request=request, template_name='sesam/chief/home.html', context=context)


def quiz_pending(request):
    if request.method == 'POST':
        formset = forms.QuestionPendingFormSet(data=request.POST)
        if formset.is_valid():
            formset.save()
    else:
        formset = forms.QuestionPendingFormSet(queryset=models.Question.objects.filter(status=models.Question.STATUS_NEW))
    return render(request=request, template_name='sesam/chief/quiz-pending.html', context={'formset': formset})


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days + 1)):
        yield start_date + timedelta(n)


def get_day_range(date, view='week'):
    if view == 'month':
        first_day = date.replace(day=1)
        last_day = date.replace(day=monthrange(date.year, date.month)[1])
    else:
        first_day = date - timedelta(date.weekday())
        last_day = first_day + timedelta(days=6)
    return first_day, last_day


def quiz_statistics(request):
    shift = int(request.POST.get('shift', 0))
    if 'new_view' in request.POST:
        shift = 0
        view_type = request.POST.get('new_view')
    else:
        view_type = request.POST.get('view', 'week')
    if view_type == 'week':
        step = 1
        delta_arg = 'weeks'
    elif view_type == 'month':
        step = 30
        delta_arg = 'days'
    if 'forward' in request.POST:
        shift += step
    elif 'backward' in request.POST:
        shift -= step
    date = timezone.now().today().date() + timedelta(**{delta_arg: shift})

    data = {
        'view': view_type,
        'shift': shift,
        'range': list(daterange(*get_day_range(date, view_type))),
        'editors': {},
    }

    statistics_all = defaultdict(dict)
    statistics_author = models.Question.objects.all().values('author').annotate(
        created_at=TruncDate('created_at'),
    ).annotate(
        rejected=Count('id', filter=Q(status=models.Question.STATUS_REJECTED)),
        accepted=Count('id', filter=Q(status=models.Question.STATUS_ACCEPTED)),
        new=Count('id', filter=Q(status=models.Question.STATUS_NEW)),
    )
    statistics_editor = models.Question.objects.exclude(status=models.Question.STATUS_NEW).values('editor').annotate(
        updated_at=TruncDate('updated_at'),
    ).annotate(
        rejected=Count('id', filter=Q(status=models.Question.STATUS_REJECTED)),
        accepted=Count('id', filter=Q(status=models.Question.STATUS_ACCEPTED)),
    )
    for s in statistics_author:
        statistics_all[s['author']][s['created_at']] = (s['new'], s['accepted'], s['rejected'])
    for s in statistics_editor:
        statistics_all[s['editor']][s['updated_at']] = (s['accepted'], s['rejected'])

    for editor in models.User.objects.filter(groups__name__exact='Editor'):
        data['editors'][editor.id] = {
            'data': statistics_all.get(editor.id, {}),
            'name': editor.name,
            'authors': {
                author.id: {
                    'data': statistics_all.get(author.id, {}),
                    'name': author.name,
                } for author in models.User.objects.filter(groups__name__exact='Author', boss=editor)
            }
        }
    return render(request=request, template_name='sesam/chief/quiz-statistics.html', context=data)
