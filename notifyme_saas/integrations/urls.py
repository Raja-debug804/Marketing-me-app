# integrations/urls.py
from django.urls import path
from .webhooks import ShopifyInventoryWebhook

urlpatterns = [
    path('shopify/inventory/', ShopifyInventoryWebhook.as_view(), name='shopify-inventory-webhook'),
]
