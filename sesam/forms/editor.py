from django import forms

from . import FormControlMixin
from .. import models


class QuestionAcceptForm(FormControlMixin, forms.ModelForm):
    class Meta:
        model = models.Question
        fields = ('category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')

    def __init__(self, *args, **kwargs):
        super(QuestionAcceptForm, self).__init__(*args, **kwargs)
        for field in self.fields.keys():
            self.fields[field].widget.attrs['readonly'] = True


QuestionApproveFormSet = forms.modelformset_factory(
    model=models.Question,
    form=QuestionAcceptForm,
    extra=0,
)
