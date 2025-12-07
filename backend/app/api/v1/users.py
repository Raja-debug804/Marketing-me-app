from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.session import get_db
from app.models.tenant import Tenant
from app.models.user import User, UserRole
from app.schemas.common import UserCreate, UserRead

router = APIRouter()


def resolve_tenant(db: Session, tenant_identifier: str) -> Tenant:
    tenant = db.query(Tenant).filter(Tenant.id == tenant_identifier).first()
    if not tenant:
        tenant = db.query(Tenant).filter(Tenant.slug == tenant_identifier).first()
    return tenant


@router.get("/tenants/{tenant_id}/users", response_model=list[UserRead])
def list_users(tenant_id: str, db: Session = Depends(get_db)):
    tenant = resolve_tenant(db, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return db.query(User).filter(User.tenant_id == tenant.id).order_by(User.created_at.desc()).all()


@router.post("/tenants/{tenant_id}/users", response_model=UserRead)
def create_user(tenant_id: str, payload: UserCreate, db: Session = Depends(get_db)):
    tenant = resolve_tenant(db, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role or UserRole.TENANT_ADMIN.value,
        tenant_id=tenant.id,
        password_hash=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
