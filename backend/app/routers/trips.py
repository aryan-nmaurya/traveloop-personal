from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.trip import TripCreate, TripResponse, TripUpdate, TripsListResponse, TripWithSectionsResponse
from app.services import trip_service

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("", response_model=TripsListResponse)
def list_trips(
    status: str | None = Query(None, description="Filter by status: ongoing | upcoming | completed"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trips, total = trip_service.get_trips(db, current_user.id, status, page, limit)
    return TripsListResponse(trips=trips, total=total)


@router.post("", response_model=TripResponse, status_code=201)
def create_trip(
    data: TripCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return trip_service.create_trip(db, current_user.id, data)


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return trip_service.get_trip(db, trip_id, current_user.id)


@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    data: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return trip_service.update_trip(db, trip_id, current_user.id, data)


@router.delete("/{trip_id}", status_code=204)
def delete_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip_service.delete_trip(db, trip_id, current_user.id)


@router.get("/{trip_id}/itinerary", response_model=TripWithSectionsResponse)
def get_itinerary(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return trip_service.get_trip_with_sections(db, trip_id, current_user.id)


@router.get("/{trip_id}/public", response_model=TripWithSectionsResponse)
def get_public_trip(
    trip_id: int,
    db: Session = Depends(get_db),
):
    """Publicly accessible endpoint — does not require authentication."""
    return trip_service.get_public_trip(db, trip_id)
