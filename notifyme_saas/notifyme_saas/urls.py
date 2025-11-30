from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('subscriptions.urls')),
    path('webhooks/', include('integrations.urls')),
    path('dashboards/', include('dashboards.urls')),
]
