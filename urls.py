"""sesam URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include
from django.urls import path
from django.http.response import HttpResponseRedirect

from sesam import forms

urlpatterns = [
    path('', lambda x: HttpResponseRedirect('/app/')),
    # Administration
    path('admin/', admin.site.urls),
    # API endpoints
    path('api/', view=include('api.urls')),
    # Content
    # path('content/', view=include('sesam.urls')),
    # Accounts
    # path('accounts/login/', auth_views.LoginView.as_view(authentication_form=forms.SesamAuthenticationForm), name='login'),
    # path('accounts/', include('django.contrib.auth.urls')),
    # Frontend
    path('app/', include('frontend.urls')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),

        # For django versions before 2.0:
        # url(r'^__debug__/', include(debug_toolbar.urls)),

    ] + urlpatterns
