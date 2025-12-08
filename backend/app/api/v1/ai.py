from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.session import get_db
from app.models.user import User
from app.schemas.ai import ChatRequest, ChatResponse, TenantChatRequest
from app.services.chat_service import run_platform_query, run_tenant_query

router = APIRouter()


@router.post("/platform/query", response_model=ChatResponse)
async def platform_query(payload: ChatRequest, db: Session = Depends(get_db)):
    return await run_platform_query(payload.question, db)


@router.post("/tenant/query", response_model=ChatResponse)
async def tenant_query(
    payload: TenantChatRequest,
    current_user: User = Depends(deps.get_current_active_tenant_user),
    db: Session = Depends(get_db),
):
    # Ensure the requested tenant_id matches the user's tenant
    if str(current_user.tenant_id) != payload.tenant_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Access denied to requested tenant")
    return await run_tenant_query(payload.question, payload.tenant_id, db)
