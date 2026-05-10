from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/traveloop"
    SECRET_KEY: str = "change-this-to-a-long-random-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    NVIDIA_API_KEY: str | None = None

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }


settings = Settings()
