from datetime import datetime
from pydantic import BaseModel


class TripNoteCreate(BaseModel):
    title: str | None = None
    body: str | None = None
    section_id: int | None = None


class TripNoteUpdate(BaseModel):
    title: str | None = None
    body: str | None = None


class TripNoteResponse(BaseModel):
    id: int
    trip_id: int
    section_id: int | None
    title: str | None
    body: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
