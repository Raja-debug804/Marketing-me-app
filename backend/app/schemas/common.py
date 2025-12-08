from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from uuid import UUID


class Message(BaseModel):
    detail: str


class TenantBase(BaseModel):
    name: str
    slug: str
    status: Optional[str] = "active"


class TenantCreate(TenantBase):
    pass


class TenantRead(TenantBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = True


class UserCreate(UserBase):
    tenant_id: UUID
    is_platform_admin: bool = False


class UserRead(UserBase):
    id: UUID
    tenant_id: Optional[UUID] = None
    is_platform_admin: bool = False
    created_at: datetime

    class Config:
        from_attributes = True
