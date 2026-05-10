from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str | None
    last_name: str | None
    phone: str | None
    city: str | None
    country: str | None
    profile_photo_url: str | None
    role: str
    language_pref: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class SignupResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
