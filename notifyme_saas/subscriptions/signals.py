# subscriptions/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import InventoryEvent
from .services import notify_subscribers_for_event


@receiver(post_save, sender=InventoryEvent)
def handle_inventory_event(sender, instance: InventoryEvent, created: bool, **kwargs):
    if created:
        notify_subscribers_for_event(instance)
