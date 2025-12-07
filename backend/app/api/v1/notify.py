from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.session import get_db
from app.models.notify import NotificationRule, NotificationTemplate, NotificationTrigger, NotifySubscription
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.notify import (
    NotificationRuleCreate,
    NotificationRuleRead,
    NotificationTemplateCreate,
    NotificationTemplateRead,
    NotifySubscriptionCreate,
    NotifySubscriptionRead,
)

router = APIRouter()


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
def list_subscriptions(
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(NotifySubscription)
        .filter(NotifySubscription.tenant_id == current_user.tenant_id)
        .order_by(NotifySubscription.created_at.desc())
        .all()
    )


@router.get("/notify/subscriptions/{subscription_id}", response_model=NotifySubscriptionRead)
def get_subscription(
    subscription_id: str,
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    subscription = db.query(NotifySubscription).filter_by(
        id=subscription_id, tenant_id=current_user.tenant_id
    ).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Not found")
    return subscription


@router.get("/notify/templates", response_model=list[NotificationTemplateRead])
def list_templates(
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    return db.query(NotificationTemplate).filter_by(tenant_id=current_user.tenant_id).all()


@router.post("/notify/templates", response_model=NotificationTemplateRead)
def create_template(
    payload: NotificationTemplateCreate,
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    template = NotificationTemplate(tenant_id=current_user.tenant_id, **payload.dict())
    if template.is_default:
        db.query(NotificationTemplate).filter_by(tenant_id=current_user.tenant_id).update({"is_default": False})
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


@router.get("/notify/rules", response_model=list[NotificationRuleRead])
def list_rules(
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    return db.query(NotificationRule).filter_by(tenant_id=current_user.tenant_id).all()


@router.post("/notify/rules", response_model=NotificationRuleRead)
def create_rule(
    payload: NotificationRuleCreate,
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    rule = NotificationRule(tenant_id=current_user.tenant_id, **payload.dict())
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule
