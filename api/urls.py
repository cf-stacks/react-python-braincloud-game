from django.conf.urls import include
from django.urls import path
from rest_framework.documentation import include_docs_urls


urlpatterns = [
    # Documentation
    path('docs/', include_docs_urls(title='Sesam API', authentication_classes=[], permission_classes=[])),
    # Version 1
    path('v1/', view=include(('api.v1.urls', 'api-v1'), namespace='v1')),
    # Internal
    path('internal/', view=include(('api.internal.urls', 'api-internal'), namespace='internal')),
]
