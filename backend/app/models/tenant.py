import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class TenantStatus(str, PyEnum):
    active = "active"
    suspended = "suspended"


class Tenant(Base):
    __tablename__ = "platform_tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default=TenantStatus.active.value)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship("User", back_populates="tenant")
    templates = relationship("NotificationTemplate", back_populates="tenant")
    shopify_settings = relationship("ShopifyConnectorSettings", back_populates="tenant")
    ga4_settings = relationship("GA4ConnectorSettings", back_populates="tenant")
