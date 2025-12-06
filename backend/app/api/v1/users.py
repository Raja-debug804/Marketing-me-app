from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.core.security import get_password_hash
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.common import UserCreate, UserRead

router = APIRouter()


@router.get("/users", response_model=list[UserRead])
def list_users(
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    return db.query(User).filter(User.tenant_id == current_user.tenant_id).all()


@router.post("/users", response_model=UserRead)
def create_user(
    payload: UserCreate,
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in [UserRole.SUPER_ADMIN.value, UserRole.TENANT_ADMIN.value]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role or UserRole.MANAGER.value,
        tenant_id=current_user.tenant_id,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
