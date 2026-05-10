from datetime import datetime
from pydantic import BaseModel


class ChecklistItemCreate(BaseModel):
    name: str
    category: str = "General"


class ChecklistItemUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    is_packed: bool | None = None


class ChecklistItemResponse(BaseModel):
    id: int
    trip_id: int
    name: str
    category: str
    is_packed: bool
    created_at: datetime

    model_config = {"from_attributes": True}
