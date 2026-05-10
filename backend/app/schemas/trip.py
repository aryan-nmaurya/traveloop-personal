from datetime import date, datetime
from pydantic import BaseModel


class TripResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: str | None
    start_date: date | None
    end_date: date | None
    cover_photo_url: str | None
    is_public: bool
    budget: float | None
    status: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class DashboardResponse(BaseModel):
    recent_trips: list[TripResponse]
    user_name: str
