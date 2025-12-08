from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.common import UserCreate, UserRead

router = APIRouter()


@router.get("/users", response_model=list[UserRead])
def list_users(
    tenant_id: str = Query(..., description="Tenant ID to filter users"),
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    try:
        tenant_uuid = UUID(tenant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tenant_id format")

    # Ensure user can only access their own tenant's users
    if current_user.tenant_id != tenant_uuid and not current_user.is_platform_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this tenant's users")

    return db.query(User).filter(User.tenant_id == tenant_uuid).all()


@router.post("/users", response_model=UserRead)
def create_user(
    payload: UserCreate,
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    # Ensure user can only create users in their own tenant
    if current_user.tenant_id != payload.tenant_id and not current_user.is_platform_admin:
        raise HTTPException(status_code=403, detail="Not authorized to create users for this tenant")

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Create user with placeholder password (no real auth for now)
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role or UserRole.ANALYST.value,
        tenant_id=payload.tenant_id,
        hashed_password="placeholder",  # Will be set properly when auth is implemented
        is_active=True,
        is_platform_admin=payload.is_platform_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
