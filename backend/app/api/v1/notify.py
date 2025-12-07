from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.notify import NotificationRule, NotificationTemplate, NotificationTrigger, NotifySubscription
from app.models.tenant import Tenant
from app.schemas.notify import (
    NotificationRuleCreate,
    NotificationRuleRead,
    NotificationTemplateCreate,
    NotificationTemplateRead,
    NotifySubscriptionCreate,
    NotifySubscriptionRead,
)

router = APIRouter()


def resolve_tenant(db: Session, tenant_identifier: str) -> Tenant:
    tenant = db.query(Tenant).filter(Tenant.id == tenant_identifier).first()
    if not tenant:
        tenant = db.query(Tenant).filter(Tenant.slug == tenant_identifier).first()
    return tenant


@router.post("/public/notify/subscribe", response_model=NotifySubscriptionRead)
def public_subscribe(payload: NotifySubscriptionCreate, db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.slug == payload.tenant_slug).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    subscription = NotifySubscription(
        tenant_id=tenant.id,
        product_id=payload.product_id,
        variant_id=payload.variant_id,
        product_name=payload.product_name,
        customer_name=payload.customer_name,
        whatsapp_number=payload.whatsapp_number,
        ga_utm_source="notify_widget",
        ga_utm_medium="whatsapp",
        ga_utm_campaign="back_in_stock",
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


@router.get("/notify/subscriptions", response_model=list[NotifySubscriptionRead])
def list_subscriptions(db: Session = Depends(get_db)):
    return db.query(NotifySubscription).order_by(NotifySubscription.created_at.desc()).all()


@router.get("/notify/subscriptions/{subscription_id}", response_model=NotifySubscriptionRead)
def get_subscription(subscription_id: str, db: Session = Depends(get_db)):
    subscription = db.query(NotifySubscription).filter_by(id=subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Not found")
    return subscription


@router.get("/tenants/{tenant_id}/templates", response_model=list[NotificationTemplateRead])
def list_templates(tenant_id: str, db: Session = Depends(get_db)):
    tenant = resolve_tenant(db, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return db.query(NotificationTemplate).filter_by(tenant_id=tenant.id).order_by(NotificationTemplate.created_at.desc()).all()


@router.post("/tenants/{tenant_id}/templates", response_model=NotificationTemplateRead)
def create_template(tenant_id: str, payload: NotificationTemplateCreate, db: Session = Depends(get_db)):
    tenant = resolve_tenant(db, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    if payload.is_default:
        db.query(NotificationTemplate).filter_by(tenant_id=tenant.id).update({"is_default": False})
    template = NotificationTemplate(tenant_id=tenant.id, **payload.dict())
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


@router.post("/tenants/{tenant_id}/templates/{template_id}/default", response_model=NotificationTemplateRead)
def set_default_template(tenant_id: str, template_id: str, db: Session = Depends(get_db)):
    tenant = resolve_tenant(db, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    template = db.query(NotificationTemplate).filter_by(id=template_id, tenant_id=tenant.id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    db.query(NotificationTemplate).filter_by(tenant_id=tenant.id).update({"is_default": False})
    template.is_default = True
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


@router.get("/notify/rules", response_model=list[NotificationRuleRead])
def list_rules(db: Session = Depends(get_db)):
    return db.query(NotificationRule).all()


@router.post("/notify/rules", response_model=NotificationRuleRead)
def create_rule(payload: NotificationRuleCreate, db: Session = Depends(get_db)):
    rule = NotificationRule(**payload.dict())
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule
