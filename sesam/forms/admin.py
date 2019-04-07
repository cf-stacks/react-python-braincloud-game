from django.contrib.auth.forms import UserChangeForm as DjangoUserChangeForm
from django.contrib.auth.forms import UserCreationForm as DjangoUserCreationForm
from django.db.models.functions import Lower

from .. import models


class UserCreationForm(DjangoUserCreationForm):
    """
    A form that creates a user, with no privileges, from the given email and
    password.
    """

    class Meta(DjangoUserCreationForm.Meta):
        model = models.User
        fields = ('email',)
        field_classes = {}


class UserChangeForm(DjangoUserChangeForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """

    class Meta(DjangoUserChangeForm.Meta):
        model = models.User
        field_classes = {}

    def __init__(self, *args, **kwargs):
        super(UserChangeForm, self).__init__(*args, **kwargs)
        if hasattr(self, 'instance') and hasattr(self.instance, 'id'):
            groups = self.instance.groups.all().only('name')
            boss_groups = set()
            if models.USER_GROUP_AUTHOR in [group.name.lower() for group in groups]:
                boss_groups.add(models.USER_GROUP_EDITOR)
            if models.USER_GROUP_EDITOR in [group.name.lower() for group in groups]:
                boss_groups.add(models.USER_GROUP_CHIEF)
            self.fields['boss'].queryset = models.User.objects.annotate(
                groups_name_lower=Lower('groups__name'),
            ).filter(
                groups_name_lower__in=boss_groups,
            ).exclude(
                id=self.instance.id,
            ).only('id', 'name', 'email')
