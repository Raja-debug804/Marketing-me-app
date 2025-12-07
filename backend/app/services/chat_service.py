import json
import re
from typing import Any

from fastapi import HTTPException
from fastapi.concurrency import run_in_threadpool
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.llm_client import call_phi4

ALLOWED_TABLES = {
    "platform_tenants": ["id", "name", "slug", "status", "created_at", "updated_at"],
    "tenant_users": [
        "id",
        "tenant_id",
        "email",
        "full_name",
        "role",
        "created_at",
        "updated_at",
    ],
    "notification_templates": [
        "id",
        "tenant_id",
        "name",
        "body",
        "is_default",
        "created_at",
        "updated_at",
    ],
}

SCHEMA_PROMPT = "\n".join(
    [
        "Available tables:",
        "platform_tenants(id, name, slug, status, created_at, updated_at)",
        "tenant_users(id, tenant_id, email, full_name, role, created_at, updated_at)",
        "notification_templates(id, tenant_id, name, body, is_default, created_at, updated_at)",
    ]
)


def _extract_tables(sql: str) -> set[str]:
    return {match[1].lower() for match in re.findall(r"(from|join)\s+([a-zA-Z0-9_\.]+)", sql.lower())}


def _validate_sql(sql: str, require_tenant_filter: bool = False) -> None:
    lowered = sql.strip().lower()
    if not lowered.startswith("select"):
        raise HTTPException(status_code=400, detail="Only SELECT statements are allowed")
    forbidden = [";", "delete", "update", "insert", "drop", "alter", "truncate"]
    if any(token in lowered for token in forbidden):
        raise HTTPException(status_code=400, detail="Disallowed SQL detected")

    tables = _extract_tables(sql)
    if not tables:
        raise HTTPException(status_code=400, detail="No table found in SQL")
    for table in tables:
        if table not in ALLOWED_TABLES:
            raise HTTPException(status_code=400, detail=f"Table {table} is not allowed")

    if require_tenant_filter and "tenant_id" not in lowered:
        raise HTTPException(status_code=400, detail="Tenant filter is required in queries")


async def _execute_sql(db: Session, sql: str, params: dict[str, Any]) -> list[dict]:
    def _run():
        result = db.execute(text(sql), params)
        return [dict(row) for row in result.mappings().all()]

    return await run_in_threadpool(_run)


async def _answer_from_results(question: str, sql: str, rows: list[dict]) -> str:
    assistant_prompt = [
        {
            "role": "system",
            "content": "You are a helpful analytics assistant. Use the SQL results provided to answer the user succinctly.",
        },
        {
            "role": "user",
            "content": json.dumps({"question": question, "sql": sql, "rows": rows}),
        },
    ]
    return await call_phi4(assistant_prompt)


async def run_platform_query(question: str, db: Session) -> dict:
    sql_prompt = [
        {
            "role": "system",
            "content": (
                "Generate a safe SQL SELECT query for PostgreSQL using only the allowed tables. "
                "Always prefer aggregated summaries and include clear column selection. \n" + SCHEMA_PROMPT
            ),
        },
        {"role": "user", "content": question},
    ]
    sql = (await call_phi4(sql_prompt)).strip()
    _validate_sql(sql)

    rows = await _execute_sql(db, sql, {})
    answer = await _answer_from_results(question, sql, rows)
    return {"answer": answer, "sql": sql, "rows": rows}


async def run_tenant_query(question: str, tenant_id: str, db: Session) -> dict:
    sql_prompt = [
        {
            "role": "system",
            "content": (
                "Generate a safe SQL SELECT query scoped to the tenant_id provided as a named parameter (:tenant_id). "
                "Only use allowed tables and be sure every query filters by tenant_id. \n" + SCHEMA_PROMPT
            ),
        },
        {"role": "user", "content": question},
    ]
    sql = (await call_phi4(sql_prompt)).strip()
    _validate_sql(sql, require_tenant_filter=True)

    rows = await _execute_sql(db, sql, {"tenant_id": tenant_id})
    answer = await _answer_from_results(question, sql, rows)
    return {"answer": answer, "sql": sql, "rows": rows}
