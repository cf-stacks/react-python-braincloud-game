from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import ugettext


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
        self.fields['username'].widget.attrs['placeholder'] = ugettext('email address')
        self.fields['password'].widget.attrs['placeholder'] = ugettext('password')
