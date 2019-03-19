from django import forms

from . import FormControlMixin
from .. import models


class QuestionCreateForm(FormControlMixin, forms.ModelForm):
    class Meta:
        model = models.Question
        fields = ('category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')
