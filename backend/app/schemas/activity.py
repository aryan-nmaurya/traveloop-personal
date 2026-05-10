from datetime import datetime
from pydantic import BaseModel


class ActivityResponse(BaseModel):
    id: int
    city_id: int
    name: str
    description: str | None
    type: str | None
    cost: float | None
    duration_minutes: int | None
    image_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ActivitiesListResponse(BaseModel):
    activities: list[ActivityResponse]
    total: int
