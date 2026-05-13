from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.models.trip import Trip
from app.schemas.trip import TripCreate, TripUpdate
from app.utils.trip_utils import attach_status


def get_trips(
    db: Session,
    user_id: int,
    status_filter: str | None = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[Trip], int]:
    today = date.today()
    base_q = db.query(Trip).filter(Trip.user_id == user_id)

    if status_filter == "ongoing":
        base_q = base_q.filter(
            Trip.start_date.isnot(None),
            Trip.end_date.isnot(None),
            Trip.start_date <= today,
            Trip.end_date >= today,
        )
    elif status_filter == "upcoming":
        base_q = base_q.filter(
            or_(
                Trip.start_date.is_(None),
                Trip.end_date.is_(None),
                Trip.start_date > today,
            )
        )
    elif status_filter == "completed":
        base_q = base_q.filter(
            Trip.end_date.isnot(None),
            Trip.end_date < today,
        )

    total = db.query(func.count(Trip.id)).filter(Trip.user_id == user_id).scalar() or 0
    if status_filter:
        total = base_q.count()

    trips = (
        base_q
        .options(joinedload(Trip.sections))
        .order_by(Trip.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    for trip in trips:
        attach_status(trip)
    return trips, total


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
    return attach_status(trip)


def get_trip(db: Session, trip_id: int, user_id: int) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return attach_status(trip)


def update_trip(db: Session, trip_id: int, user_id: int, data: TripUpdate) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(trip, field, value)

    db.commit()
    db.refresh(trip)
    return attach_status(trip)


def get_trip_with_sections(db: Session, trip_id: int, user_id: int) -> Trip:
    trip = (
        db.query(Trip)
        .options(joinedload(Trip.sections))
        .filter(Trip.id == trip_id, Trip.user_id == user_id)
        .first()
    )
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return attach_status(trip)


def delete_trip(db: Session, trip_id: int, user_id: int) -> None:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    db.delete(trip)
    db.commit()


def get_public_trip(db: Session, trip_id: int) -> Trip:
    trip = (
        db.query(Trip)
        .options(joinedload(Trip.sections))
        .filter(Trip.id == trip_id, Trip.is_public == True)
        .first()
    )
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found or not public")
    return attach_status(trip)
