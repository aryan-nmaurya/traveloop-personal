from datetime import date
from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.services.trip_service import _attach_status


def get_public_trips(
    db: Session,
    q: str | None = None,
    sort: str | None = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[Trip], int]:
    query = db.query(Trip).filter(Trip.is_public == True)
    if q:
        query = query.filter(Trip.name.ilike(f"%{q}%"))
    total = query.count()
    if sort == "popular":
        query = query.order_by(Trip.is_public.desc(), Trip.created_at.desc())
    else:
        query = query.order_by(Trip.created_at.desc())
    offset = (page - 1) * limit
    trips = query.offset(offset).limit(limit).all()
    for trip in trips:
        _attach_status(trip)
    return trips, total


def copy_trip(db: Session, trip_id: int, user_id: int) -> Trip:
    from fastapi import HTTPException, status

    original = db.query(Trip).filter(Trip.id == trip_id, Trip.is_public == True).first()
    if not original:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Public trip not found")

    from app.models.section import TripSection

    new_trip = Trip(
        user_id=user_id,
        name=f"Copy of {original.name}",
        description=original.description,
        start_date=original.start_date,
        end_date=original.end_date,
        cover_photo_url=original.cover_photo_url,
        is_public=False,
        budget=original.budget,
    )
    db.add(new_trip)
    db.flush()

    original_sections = db.query(TripSection).filter(TripSection.trip_id == trip_id).order_by(TripSection.order_index).all()
    for sec in original_sections:
        new_sec = TripSection(
            trip_id=new_trip.id,
            city_id=sec.city_id,
            order_index=sec.order_index,
            type=sec.type,
            description=sec.description,
            start_date=sec.start_date,
            end_date=sec.end_date,
            budget=sec.budget,
        )
        db.add(new_sec)

    db.commit()
    db.refresh(new_trip)
    return _attach_status(new_trip)
