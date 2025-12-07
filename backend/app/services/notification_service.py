from datetime import datetime
from typing import Optional
from urllib.parse import urlencode

from sqlalchemy.orm import Session

from app.models.notify import (
    NotificationRule,
    NotificationTemplate,
    NotificationTrigger,
    NotifyStatus,
    NotifySubscription,
)
from app.services.whatsapp_sender import send_whatsapp_message


PLACEHOLDERS = {
    "customer_name",
    "product_name",
    "product_url",
    "discount_code",
}


def render_template(template: str, context: dict) -> str:
    rendered = template
    for key, value in context.items():
        rendered = rendered.replace(f"{{{{{key}}}}}", str(value))
    return rendered


def build_product_url(base_url: str, utm_source: str, utm_medium: str, utm_campaign: str) -> str:
    params = urlencode({"utm_source": utm_source, "utm_medium": utm_medium, "utm_campaign": utm_campaign})
    separator = "&" if "?" in base_url else "?"
    return f"{base_url}{separator}{params}"


def send_notification_for_subscription(
    db: Session,
    tenant_id: str,
    trigger: NotificationTrigger,
    subscription: NotifySubscription,
    product_url: str,
) -> Optional[str]:
    rule = (
        db.query(NotificationRule)
        .filter_by(tenant_id=tenant_id, trigger_type=trigger.value, active=True)
        .first()
    )
    if not rule:
        return None

    template: Optional[NotificationTemplate] = db.query(NotificationTemplate).filter_by(
        id=rule.template_id, tenant_id=tenant_id
    ).first()
    if not template:
        return None

    if rule.send_window_start and rule.send_window_end:
        now_str = datetime.utcnow().strftime("%H:%M")
        if not (rule.send_window_start <= now_str <= rule.send_window_end):
            return None

    url_with_params = build_product_url(
        product_url,
        rule.utm_source or "notify",
        rule.utm_medium or "whatsapp",
        rule.utm_campaign or "campaign",
    )

    message = render_template(
        template.body,
        {
            "customer_name": subscription.customer_name,
            "product_name": subscription.product_name,
            "product_url": url_with_params,
            "discount_code": "",
        },
    )

    success = send_whatsapp_message(subscription.whatsapp_number, message)
    if success:
        subscription.status = NotifyStatus.NOTIFIED.value
        subscription.notified_at = datetime.utcnow()
        db.add(subscription)
        db.commit()
        return message
    return None
