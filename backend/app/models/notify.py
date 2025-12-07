import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class NotifyStatus(str, PyEnum):
    PENDING = "PENDING"
    NOTIFIED = "NOTIFIED"
    FAILED = "FAILED"


class NotificationTrigger(str, PyEnum):
    BACK_IN_STOCK = "BACK_IN_STOCK"
    LOW_STOCK = "LOW_STOCK"
    PRICE_DROP = "PRICE_DROP"


class NotifySubscription(Base):
    __tablename__ = "notify_subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform_tenants.id"), nullable=False)
    customer_name = Column(String, nullable=False)
    whatsapp_number = Column(String, nullable=False)
    product_id = Column(String, nullable=False)
    variant_id = Column(String, nullable=True)
    product_name = Column(String, nullable=False)
    source_channel = Column(String, default="shopify")
    status = Column(String, default=NotifyStatus.PENDING.value)
    ga_utm_source = Column(String, nullable=True)
    ga_utm_medium = Column(String, nullable=True)
    ga_utm_campaign = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    notified_at = Column(DateTime, nullable=True)

    tenant = relationship("Tenant")


class NotificationTemplate(Base):
    __tablename__ = "notification_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform_tenants.id"), nullable=False)
    name = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tenant = relationship("Tenant", back_populates="templates")


class NotificationRule(Base):
    __tablename__ = "notification_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform_tenants.id"), nullable=False)
    trigger_type = Column(String, default=NotificationTrigger.BACK_IN_STOCK.value)
    template_id = Column(UUID(as_uuid=True), ForeignKey("notification_templates.id"))
    active = Column(Boolean, default=True)
    send_window_start = Column(String, nullable=True)
    send_window_end = Column(String, nullable=True)
    utm_source = Column(String, default="notifyinsights")
    utm_medium = Column(String, default="whatsapp")
    utm_campaign = Column(String, default="back_in_stock")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    template = relationship("NotificationTemplate")
