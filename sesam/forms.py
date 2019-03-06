from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import ugettext

from . import models


class FormControlMixin(object):

    def __init__(self, *args, **kwargs):
        super(FormControlMixin, self).__init__(*args, **kwargs)
        for field in self.fields.keys():
            value = self.fields[field].widget.attrs.get('class')
            if value is None:
                value = 'form-control'
            else:
                value += ' form-control'
            self.fields[field].widget.attrs['class'] = value


class SesamAuthenticationForm(FormControlMixin, AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(SesamAuthenticationForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['placeholder'] = ugettext('Email')
        self.fields['password'].widget.attrs['placeholder'] = ugettext('Password')


class QuestionCreateForm(FormControlMixin, forms.ModelForm):
    class Meta:
        model = models.Question
        fields = ('category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')


class QuestionApproveForm(FormControlMixin, forms.ModelForm):
    class Meta:
        model = models.Question
        fields = ('category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')

    def __init__(self, *args, **kwargs):
        super(QuestionApproveForm, self).__init__(*args, **kwargs)
        for field in self.fields.keys():
            self.fields[field].widget.attrs['readonly'] = True


QuestionApproveFormSet = forms.modelformset_factory(
    model=models.Question,
    form=QuestionApproveForm,
    extra=0,
)
