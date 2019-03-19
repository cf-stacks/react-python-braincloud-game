from django.contrib.auth import models as auth_models
from django.shortcuts import redirect
from django.shortcuts import render
from django.urls import reverse

from . import author
from . import chief
from . import editor


def home(request):
    all_groups = set(x.lower() for x in auth_models.Group.objects.all().values_list('name', flat=True))
    user_groups = set(x.lower() for x in request.user.groups.all().values_list('name', flat=True))
    if request.user.is_superuser:
        user_groups = all_groups
    intersection = user_groups & all_groups
    if len(intersection) > 1:
        return render(request=request, template_name='sesam/home.html', context={'groups': intersection})
    return redirect(to=reverse(f'{intersection.pop()}:home'))
