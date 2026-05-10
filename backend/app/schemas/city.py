from datetime import datetime
from pydantic import BaseModel


class CityResponse(BaseModel):
    id: int
    name: str
    country: str | None
    region: str | None
    cost_index: float | None
    popularity_score: int
    description: str | None
    image_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class CitiesListResponse(BaseModel):
    cities: list[CityResponse]
    total: int
