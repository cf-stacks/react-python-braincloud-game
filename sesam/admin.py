from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import ugettext_lazy as _

from . import models
from .forms import admin as forms


class UserAdmin(DjangoUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('name',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions', 'boss')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Money and Points'), {'fields': ('money', 'points')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    form = forms.UserChangeForm
    add_form = forms.UserCreationForm
    list_display = ('email', 'name', 'is_staff', 'boss')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'boss')
    search_fields = ('name', 'email')
    ordering = ('name',)
    filter_horizontal = ('groups', 'user_permissions',)


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'status', 'description', 'answer_correct', 'author', 'created_at')
    list_filter = ('status', 'category', 'author')


admin.site.register(models.User, UserAdmin)
admin.site.register(models.Question, QuestionAdmin)
admin.site.register(models.QuestionCategory)
