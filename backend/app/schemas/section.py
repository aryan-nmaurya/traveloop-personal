from datetime import date, datetime
from pydantic import BaseModel

from app.schemas.activity import ActivityResponse


class TripSectionCreate(BaseModel):
    type: str | None = None
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    budget: float | None = None
    city_id: int | None = None
    order_index: int = 0


class TripSectionUpdate(BaseModel):
    type: str | None = None
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    budget: float | None = None
    city_id: int | None = None
    order_index: int | None = None


class TripSectionResponse(BaseModel):
    id: int
    trip_id: int
    city_id: int | None
    order_index: int
    type: str | None
    description: str | None
    start_date: date | None
    end_date: date | None
    budget: float | None
    created_at: datetime
    activities: list[ActivityResponse] = []

    model_config = {"from_attributes": True}
