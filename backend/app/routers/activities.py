from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.activity import ActivitiesListResponse
from app.services import activity_service

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("", response_model=ActivitiesListResponse)
def list_activities(
    city_id: int | None = Query(None),
    type: str | None = Query(None, description="physical | cultural | food | adventure"),
    max_cost: float | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    activities, total = activity_service.get_activities(db, city_id, type, max_cost, page, limit)
    return ActivitiesListResponse(activities=activities, total=total)
