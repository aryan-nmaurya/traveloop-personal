from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.trip import Trip
from app.schemas.trip import TripCreate, TripUpdate


def _compute_status(trip: Trip) -> str:
    today = date.today()
    if not trip.start_date or not trip.end_date:
        return "upcoming"
    if today < trip.start_date:
        return "upcoming"
    if trip.start_date <= today <= trip.end_date:
        return "ongoing"
    return "completed"


def _attach_status(trip: Trip) -> Trip:
    trip.status = _compute_status(trip)
    return trip


def get_trips(
    db: Session,
    user_id: int,
    status_filter: str | None = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[Trip], int]:
    query = db.query(Trip).options(joinedload(Trip.sections)).filter(Trip.user_id == user_id)

    all_trips = query.order_by(Trip.created_at.desc()).all()
    for trip in all_trips:
        _attach_status(trip)

    if status_filter:
        all_trips = [t for t in all_trips if t.status == status_filter]

    total = len(all_trips)
    offset = (page - 1) * limit
    return all_trips[offset : offset + limit], total


def create_trip(db: Session, user_id: int, data: TripCreate) -> Trip:
    trip = Trip(
        user_id=user_id,
        name=data.name,
        description=data.description,
        start_date=data.start_date,
        end_date=data.end_date,
        cover_photo_url=data.cover_photo_url,
        is_public=data.is_public,
        budget=data.budget,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return _attach_status(trip)


def get_trip(db: Session, trip_id: int, user_id: int) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return _attach_status(trip)


def update_trip(db: Session, trip_id: int, user_id: int, data: TripUpdate) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(trip, field, value)

    db.commit()
    db.refresh(trip)
    return _attach_status(trip)


def get_trip_with_sections(db: Session, trip_id: int, user_id: int) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    _attach_status(trip)
    # sections already lazy-loaded via relationship ordered by order_index
    _ = trip.sections
    return trip


def delete_trip(db: Session, trip_id: int, user_id: int) -> None:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    db.delete(trip)
    db.commit()
