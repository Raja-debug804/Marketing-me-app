# dashboards/urls.py
from django.urls import path
from .views import ClientDashboardView, PlatformAdminDashboardView

urlpatterns = [
    path('client/', ClientDashboardView.as_view(), name='client-dashboard'),
    path('admin/', PlatformAdminDashboardView.as_view(), name='platform-dashboard'),
]
