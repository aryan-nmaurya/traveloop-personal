from datetime import date, datetime
from pydantic import BaseModel

from app.schemas.section import TripSectionResponse


class TripCreate(BaseModel):
    name: str
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    cover_photo_url: str | None = None
    is_public: bool = False
    budget: float | None = None


class TripUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    cover_photo_url: str | None = None
    is_public: bool | None = None
    budget: float | None = None


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
    invoice_status: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class TripWithSectionsResponse(TripResponse):
    sections: list[TripSectionResponse] = []

    model_config = {"from_attributes": True}


class TripsListResponse(BaseModel):
    trips: list[TripResponse]
    total: int


class DashboardResponse(BaseModel):
    recent_trips: list[TripResponse]
    user_name: str
