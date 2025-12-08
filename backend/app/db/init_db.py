from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import engine
from app.models.notify import NotificationTemplate
from app.models.tenant import Tenant, TenantStatus
from app.models.user import User, UserRole


def init_db(db: Session):
    # Schema is managed by Alembic migrations
    seed_tenants(db)


def seed_tenants(db: Session):
    tenants = [
        {"name": "Sapphire Retail", "slug": "sapphire", "status": TenantStatus.active.value},
        {"name": "Emerald Shops", "slug": "emerald", "status": TenantStatus.suspended.value},
    ]
    for tenant_data in tenants:
        tenant = db.query(Tenant).filter_by(slug=tenant_data["slug"]).first()
        if not tenant:
            tenant = Tenant(**tenant_data)
            db.add(tenant)
            db.commit()
            db.refresh(tenant)
        seed_users(db, tenant)
        seed_templates(db, tenant)


def seed_users(db: Session, tenant: Tenant):
    existing = db.query(User).filter(User.tenant_id == tenant.id).count()
    if existing:
        return
    admin = User(
        email=f"admin@{tenant.slug}.com",
        full_name=f"{tenant.name} Admin",
        role=UserRole.TENANT_ADMIN.value,
        tenant_id=tenant.id,
        hashed_password=get_password_hash("password123"),
    )
    analyst = User(
        email=f"analyst@{tenant.slug}.com",
        full_name=f"{tenant.name} Analyst",
        role=UserRole.ANALYST.value,
        tenant_id=tenant.id,
        hashed_password=get_password_hash("password123"),
    )
    db.add_all([admin, analyst])
    db.commit()


def seed_templates(db: Session, tenant: Tenant):
    existing = db.query(NotificationTemplate).filter(NotificationTemplate.tenant_id == tenant.id).count()
    if existing:
        return
    templates = [
        NotificationTemplate(
            tenant_id=tenant.id,
            name="Order Confirmation",
            body_template="Hi {{customer_name}}, your order #{{order_number}} has been confirmed!",
            is_default=True,
        ),
        NotificationTemplate(
            tenant_id=tenant.id,
            name="Shipping Update",
            body_template="Your order is on its way! Track at: {{tracking_link}}",
            is_default=False,
        ),
        NotificationTemplate(
            tenant_id=tenant.id,
            name="AI Copilot / Tenant Assistant",
            body_template="Hello {{customer_name}}, this is an automated message from our AI assistant.",
            is_default=False,
        ),
    ]
    db.add_all(templates)
    db.commit()
