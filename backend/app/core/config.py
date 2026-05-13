from pydantic import model_validator
from pydantic_settings import BaseSettings

_INSECURE_DEFAULT = "INSECURE-DEFAULT-SET-SECRET_KEY-IN-ENV"


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./traveloop.db"
    SECRET_KEY: str = _INSECURE_DEFAULT
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    NVIDIA_API_KEY: str | None = None
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

    @model_validator(mode="after")
    def _require_secret_key(self) -> "Settings":
        if self.SECRET_KEY == _INSECURE_DEFAULT:
            raise ValueError(
                "SECRET_KEY is not configured. Set a secure random value in your .env file.\n"
                "Generate one with: python3 -c \"import secrets; print(secrets.token_hex(32))\""
            )
        return self


settings = Settings()
