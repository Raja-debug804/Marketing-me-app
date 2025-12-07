from datetime import date
from random import randint
from typing import Optional

from sqlalchemy.orm import Session

from app.schemas.ga4 import GA4InsightsResponse


class GA4Service:
    def __init__(self, db: Session, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id

    def fetch_overview(self, date_from: date, date_to: date, channel: Optional[str], product_sku: Optional[str]) -> GA4InsightsResponse:
        days = max((date_to - date_from).days, 1)
        base_sessions = randint(100, 500)
        conversions = int(base_sessions * 0.05)
        revenue = float(conversions * 49.0)
        kpis = [
            {"label": "Avg Sessions/day", "value": round(base_sessions / days, 2)},
            {"label": "Conversion Rate", "value": round(conversions / base_sessions, 4)},
            {"label": "Top Channel", "value": channel or "whatsapp"},
        ]
        return GA4InsightsResponse(
            sessions=base_sessions, conversions=conversions, revenue=revenue, kpis=kpis
        )
