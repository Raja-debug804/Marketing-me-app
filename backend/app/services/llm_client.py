import httpx

from app.core.config import get_settings

settings = get_settings()


async def call_phi4(messages: list[dict]) -> str:
    """
    Call phi-4 using an OpenAI-compatible API.
    `messages` is a standard ChatCompletion-style list.
    Returns the assistant's text content.
    """
    if not settings.PHI4_API_BASE or not settings.PHI4_API_KEY:
        raise RuntimeError("PHI4 configuration is missing. Set PHI4_API_BASE and PHI4_API_KEY.")

    url = f"{settings.PHI4_API_BASE.rstrip('/')}/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {settings.PHI4_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": settings.PHI4_MODEL_NAME,
        "messages": messages,
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]
