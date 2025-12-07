from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class Message(BaseModel):
    detail: str


class TenantBase(BaseModel):
    name: str
    slug: str
    status: Optional[str] = "active"


class TenantCreate(TenantBase):
    pass


class TenantUpdate(BaseModel):
    name: Optional[str]
    status: Optional[str]


class TenantRead(TenantBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = True


class UserCreate(UserBase):
    password: str
    tenant_id: Optional[str] = None
    is_platform_admin: bool = False


class UserRead(UserBase):
    id: str
    tenant_id: Optional[str] = None
    is_platform_admin: bool = False
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
