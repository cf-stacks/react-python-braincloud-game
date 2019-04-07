from django import forms

from . import FormControlMixin
from .. import models


class QuestionPendingForm(FormControlMixin, forms.ModelForm):
    class Meta:
        model = models.Question
        fields = ('category', 'author', 'editor', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')


QuestionPendingFormSet = forms.modelformset_factory(
    model=models.Question,
    form=QuestionPendingForm,
    extra=0,
)
