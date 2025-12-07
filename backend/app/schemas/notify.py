from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NotificationTemplateBase(BaseModel):
    name: str
    body: str
    is_default: bool = False


class NotificationTemplateCreate(NotificationTemplateBase):
    pass


class NotificationTemplateRead(NotificationTemplateBase):
    id: str
    tenant_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


class NotificationRuleBase(BaseModel):
    trigger_type: str
    template_id: str
    active: bool = True
    send_window_start: Optional[str] = None
    send_window_end: Optional[str] = None
    utm_source: Optional[str] = "notifyinsights"
    utm_medium: Optional[str] = "whatsapp"
    utm_campaign: Optional[str] = "back_in_stock"


class NotificationRuleCreate(NotificationRuleBase):
    pass


class NotificationRuleRead(NotificationRuleBase):
    id: str
    tenant_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


class NotifySubscriptionCreate(BaseModel):
    tenant_slug: str
    product_id: str
    variant_id: Optional[str] = None
    product_name: str
    customer_name: str
    whatsapp_number: str


class NotifySubscriptionRead(BaseModel):
    id: str
    tenant_id: str
    customer_name: str
    whatsapp_number: str
    product_id: str
    variant_id: Optional[str] = None
    product_name: str
    source_channel: Optional[str] = None
    status: str
    created_at: datetime
    notified_at: Optional[datetime] = None

    class Config:
        orm_mode = True
