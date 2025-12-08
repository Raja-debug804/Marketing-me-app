from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from uuid import UUID


class NotifySubscriptionCreate(BaseModel):
    tenant_slug: str
    product_id: str
    variant_id: Optional[str] = None
    product_name: str
    customer_name: str
    whatsapp_number: str


class NotifySubscriptionRead(BaseModel):
    id: UUID
    tenant_id: UUID
    customer_name: str
    whatsapp_number: str
    product_id: str
    variant_id: Optional[str]
    product_name: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationTemplateBase(BaseModel):
    name: str
    channel: str = "whatsapp"
    body_template: str
    is_default: bool = False


class NotificationTemplateCreate(NotificationTemplateBase):
    pass


class NotificationTemplateRead(NotificationTemplateBase):
    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NotificationRuleBase(BaseModel):
    trigger_type: str
    template_id: UUID
    active: bool = True
    send_window_start: Optional[str] = None
    send_window_end: Optional[str] = None
    utm_source: Optional[str] = "notifyinsights"
    utm_medium: Optional[str] = "whatsapp"
    utm_campaign: Optional[str] = "back_in_stock"


class NotificationRuleCreate(NotificationRuleBase):
    pass


class NotificationRuleRead(NotificationRuleBase):
    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
