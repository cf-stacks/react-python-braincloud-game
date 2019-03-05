from django import forms

from . import models


class BaseModelForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(BaseModelForm, self).__init__(*args, **kwargs)
        for field in self.fields.keys():
            value = self.fields[field].widget.attrs.get('class')
            if value is None:
                value = 'form-control'
            else:
                value += ' form-control'
            self.fields[field].widget.attrs['class'] = value


class QuestionCreateForm(BaseModelForm):
    class Meta:
        model = models.Question
        fields = ('category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')


class QuestionApproveForm(forms.ModelForm):
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
