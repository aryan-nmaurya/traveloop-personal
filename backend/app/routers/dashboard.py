from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.trip import DashboardResponse
from app.services.dashboard_service import get_recent_trips

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trips = get_recent_trips(db, current_user.id, limit=3)
    user_name = f"{current_user.first_name or ''} {current_user.last_name or ''}".strip() or "Traveler"
    return DashboardResponse(recent_trips=trips, user_name=user_name)
