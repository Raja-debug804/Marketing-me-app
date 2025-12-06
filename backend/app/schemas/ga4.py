from datetime import date
from typing import Optional
from pydantic import BaseModel


class GA4Settings(BaseModel):
    ga4_property_id: str
    credentials_json: Optional[str] = None


class GA4InsightsRequest(BaseModel):
    date_from: date
    date_to: date
    channel: Optional[str] = None
    product_sku: Optional[str] = None


class GA4InsightsResponse(BaseModel):
    sessions: int
    conversions: int
    revenue: float
    kpis: list[dict]
