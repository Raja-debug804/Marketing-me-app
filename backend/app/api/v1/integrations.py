from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.session import get_db
from app.models.integrations import GA4ConnectorSettings, ShopifyConnectorSettings
from app.models.notify import NotificationTrigger, NotifySubscription, NotifyStatus
from app.models.user import User
from app.schemas.ga4 import GA4InsightsRequest, GA4InsightsResponse, GA4Settings
from app.services.ga4_service import GA4Service
from app.services.notification_service import send_notification_for_subscription

router = APIRouter()


@router.get("/integrations/shopify/settings")
def get_shopify_settings(
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(ShopifyConnectorSettings)
        .filter(ShopifyConnectorSettings.tenant_id == current_user.tenant_id)
        .first()
    )


@router.put("/integrations/shopify/settings")
def upsert_shopify_settings(
    settings: dict,
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    record = (
        db.query(ShopifyConnectorSettings)
        .filter(ShopifyConnectorSettings.tenant_id == current_user.tenant_id)
        .first()
    )
    if record:
        for k, v in settings.items():
            setattr(record, k, v)
    else:
        record = ShopifyConnectorSettings(tenant_id=current_user.tenant_id, **settings)
        db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.post("/integrations/shopify/webhook/inventory-update")
def shopify_inventory_webhook(payload: dict, db: Session = Depends(get_db)):
    tenant_id = payload.get("tenant_id")
    product_id = payload.get("product_id")
    product_url = payload.get("product_url", "https://shop.example.com")
    if not tenant_id or not product_id:
        raise HTTPException(status_code=400, detail="Missing identifiers")
    subscriptions = db.query(NotifySubscription).filter_by(
        tenant_id=tenant_id, product_id=product_id, status=NotifyStatus.PENDING.value
    )
    for sub in subscriptions:
        send_notification_for_subscription(
            db=db,
            tenant_id=tenant_id,
            trigger=NotificationTrigger.BACK_IN_STOCK,
            subscription=sub,
            product_url=product_url,
        )
    return {"detail": "processed"}


@router.get("/integrations/ga4/settings")
def get_ga4_settings(
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(GA4ConnectorSettings)
        .filter(GA4ConnectorSettings.tenant_id == current_user.tenant_id)
        .first()
    )


@router.put("/integrations/ga4/settings")
def upsert_ga4_settings(
    settings: GA4Settings,
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    record = (
        db.query(GA4ConnectorSettings)
        .filter(GA4ConnectorSettings.tenant_id == current_user.tenant_id)
        .first()
    )
    if record:
        record.ga4_property_id = settings.ga4_property_id
        record.credentials_json = settings.credentials_json
    else:
        record = GA4ConnectorSettings(tenant_id=current_user.tenant_id, **settings.dict())
        db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.post("/insights/ga4/overview", response_model=GA4InsightsResponse)
def ga4_overview(
    filters: GA4InsightsRequest,
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    service = GA4Service(db, str(current_user.tenant_id))
    return service.fetch_overview(filters.date_from, filters.date_to, filters.channel, filters.product_sku)
