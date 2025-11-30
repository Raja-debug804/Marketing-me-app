# subscriptions/services.py
from django.utils import timezone
from integrations.whatsapp_client import WhatsAppClient
from .models import NotifySubscription, WhatsAppMessageLog, InventoryEvent


def build_whatsapp_message(subscription: NotifySubscription) -> str:
    name = subscription.customer_name or 'there'
    product_name = subscription.product.name
    product_url = subscription.product.product_url
    client_name = subscription.client.name
    return (
        f"Salam {name}, your requested product {product_name} is back in stock. "
        f"Tap here to order now: {product_url} – This is an automated notification from {client_name}."
    )


def notify_subscribers_for_event(event: InventoryEvent):
    if event.previous_qty == 0 and event.new_qty > 0:
        qs = NotifySubscription.objects.filter(
            product=event.product,
            variant=event.variant,
            status=NotifySubscription.STATUS_PENDING,
        )
        client = WhatsAppClient()
        for sub in qs:
            message_body = build_whatsapp_message(sub)
            try:
                response = client.send_message(
                    to=sub.customer_whatsapp_number,
                    message=message_body,
                )
                whatsapp_id = response.get('messages', [{}])[0].get('id', '')
                log_status = WhatsAppMessageLog.STATUS_SENT
            except Exception as exc:  # noqa: BLE001 - log failures for MVP
                whatsapp_id = ''
                log_status = WhatsAppMessageLog.STATUS_FAILED
                response = {'error': str(exc)}

            WhatsAppMessageLog.objects.create(
                client=sub.client,
                subscription=sub,
                message_body=message_body,
                whatsapp_message_id=whatsapp_id,
                status=log_status,
                provider='meta_cloud_api',
                error_message=response if log_status == WhatsAppMessageLog.STATUS_FAILED else '',
                sent_at=timezone.now() if log_status == WhatsAppMessageLog.STATUS_SENT else None,
            )
            if log_status == WhatsAppMessageLog.STATUS_SENT:
                sub.status = NotifySubscription.STATUS_NOTIFIED
                sub.notified_at = timezone.now()
                sub.save(update_fields=['status', 'notified_at'])
