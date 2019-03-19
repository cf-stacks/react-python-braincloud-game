from django.shortcuts import render
from django.utils import timezone

from .. import models
from ..forms import editor as forms


def home(request):
    context = {
        'authors': request.user.subordinates.all()
    }
    return render(request=request, template_name='sesam/editor/home.html', context=context)


def accept(request, user_id=None):
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
            author__in=request.user.subordinates.all() if user_id is None else models.User.objects.filter(pk=user_id),
        ))
    return render(request=request, template_name='sesam/editor/quiz-accept.html', context={'formset': formset})
