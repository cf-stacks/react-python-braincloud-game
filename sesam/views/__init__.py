from django.shortcuts import redirect
from django.urls import reverse
from . import author
from . import chief
from . import editor


def home(request):
    if request.user.email.startswith('editor'):
        return redirect(to=reverse('editor:home'))
    elif request.user.email.startswith('author'):
        return redirect(to=reverse('author:home'))
    return redirect(to=reverse('chief:home'))
