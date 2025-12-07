from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.core.security import get_password_hash
from app.db.session import get_db
from app.models.tenant import Tenant
from app.models.user import User, UserRole
from app.schemas.common import TenantCreate, TenantRead, UserCreate, UserRead

router = APIRouter(dependencies=[Depends(deps.get_platform_admin)])


@router.get("/tenants", response_model=list[TenantRead])
def list_tenants(db: Session = Depends(get_db)):
    return db.query(Tenant).all()


@router.post("/tenants", response_model=TenantRead)
def create_tenant(payload: TenantCreate, db: Session = Depends(get_db)):
    tenant = Tenant(**payload.dict())
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return tenant


@router.post("/tenants/{tenant_id}/users", response_model=UserRead)
def create_tenant_user(tenant_id: str, payload: UserCreate, db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role or UserRole.MANAGER.value,
        hashed_password=get_password_hash(payload.password),
        tenant_id=tenant_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
