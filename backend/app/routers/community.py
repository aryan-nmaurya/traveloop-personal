from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.trip import TripResponse, TripsListResponse
from app.services import community_service

router = APIRouter(tags=["community"])


@router.get("/community", response_model=TripsListResponse)
def get_community(
    q: str | None = Query(None),
    sort: str | None = Query(None, description="popular | recent"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trips, total = community_service.get_public_trips(db, q, sort, page, limit)
    return TripsListResponse(trips=trips, total=total)


@router.post("/trips/{trip_id}/copy", response_model=TripResponse, status_code=201)
def copy_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return community_service.copy_trip(db, trip_id, current_user.id)
