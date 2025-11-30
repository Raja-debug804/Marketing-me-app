# subscriptions/urls.py
from django.urls import path
from .views import NotifySubscribeView

urlpatterns = [
    path('notify-subscribe/', NotifySubscribeView.as_view(), name='notify-subscribe'),
]
