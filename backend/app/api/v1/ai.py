from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.ai import ChatRequest, ChatResponse, TenantChatRequest
from app.services.chat_service import run_platform_query, run_tenant_query

router = APIRouter()


@router.post("/platform/query", response_model=ChatResponse)
async def platform_query(payload: ChatRequest, db: Session = Depends(get_db)):
    return await run_platform_query(payload.question, db)


@router.post("/tenant/query", response_model=ChatResponse)
async def tenant_query(payload: TenantChatRequest, db: Session = Depends(get_db)):
    return await run_tenant_query(payload.question, payload.tenant_id, db)
