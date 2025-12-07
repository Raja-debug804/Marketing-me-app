from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class TenantChatRequest(ChatRequest):
    tenant_id: str


class ChatResponse(BaseModel):
    answer: str
    sql: str
    rows: list[dict]
