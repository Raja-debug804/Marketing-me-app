# subscriptions/models.py
from django.db import models

class NotifySubscription(models.Model):
    STATUS_PENDING = 'PENDING'
    STATUS_NOTIFIED = 'NOTIFIED'
    STATUS_CANCELLED = 'CANCELLED'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_NOTIFIED, 'Notified'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    client = models.ForeignKey('clients.Client', on_delete=models.CASCADE, related_name='subscriptions')
    integration = models.ForeignKey('clients.StoreIntegration', on_delete=models.CASCADE, related_name='subscriptions')
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE, related_name='subscriptions')
    variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.CASCADE, related_name='subscriptions', null=True, blank=True)
    customer_whatsapp_number = models.CharField(max_length=50)
    customer_name = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    notified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['client', 'status']),
            models.Index(fields=['product', 'status']),
        ]

    def __str__(self) -> str:
        return f"{self.product.name} -> {self.customer_whatsapp_number} ({self.status})"

class InventoryEvent(models.Model):
    client = models.ForeignKey('clients.Client', on_delete=models.CASCADE, related_name='inventory_events')
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE, related_name='inventory_events')
    variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.CASCADE, related_name='inventory_events', null=True, blank=True)
    previous_qty = models.IntegerField(default=0)
    new_qty = models.IntegerField(default=0)
    event_source = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"InventoryEvent {self.product} {self.previous_qty}->{self.new_qty}"

class WhatsAppMessageLog(models.Model):
    STATUS_QUEUED = 'QUEUED'
    STATUS_SENT = 'SENT'
    STATUS_FAILED = 'FAILED'
    STATUS_CHOICES = [
        (STATUS_QUEUED, 'Queued'),
        (STATUS_SENT, 'Sent'),
        (STATUS_FAILED, 'Failed'),
    ]

    client = models.ForeignKey('clients.Client', on_delete=models.CASCADE, related_name='whatsapp_logs')
    subscription = models.ForeignKey(NotifySubscription, on_delete=models.CASCADE, related_name='messages')
    message_body = models.TextField()
    whatsapp_message_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_QUEUED)
    provider = models.CharField(max_length=50, default='meta_cloud_api')
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.subscription} [{self.status}]"
