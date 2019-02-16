from django.conf.urls import include
from django.urls import path

urlpatterns = [
    path('v1/', view=include(('api.v1.urls', 'api-v1'), namespace='v1')),
]
