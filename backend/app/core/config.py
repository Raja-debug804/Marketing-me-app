from functools import lru_cache
from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = "NotifyInsights"
    database_url: str = "postgresql://notify_admin:notify_password@localhost:5432/notify_hub"
    database_url_local: str | None = None
    jwt_secret: str = "change_me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_minutes: int = 60 * 24
    ga4_default_property: str = "demo"
    environment: str = "development"
    PHI4_API_KEY: str | None = None
    PHI4_API_BASE: str | None = None
    PHI4_MODEL_NAME: str = "phi-4-mini"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
