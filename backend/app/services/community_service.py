from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.section import SectionActivity, TripSection
from app.models.trip import Trip
from app.utils.trip_utils import attach_status


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
        # Order by number of sections as a proxy for completeness/quality.
        section_count = (
            db.query(func.count(TripSection.id))
            .filter(TripSection.trip_id == Trip.id)
            .correlate(Trip)
            .scalar_subquery()
        )
        query = query.order_by(section_count.desc(), Trip.created_at.desc())
    else:
        query = query.order_by(Trip.created_at.desc())

    trips = query.offset((page - 1) * limit).limit(limit).all()
    for trip in trips:
        attach_status(trip)
    return trips, total


def copy_trip(db: Session, trip_id: int, user_id: int) -> Trip:
    from fastapi import HTTPException, status

    original = db.query(Trip).filter(Trip.id == trip_id, Trip.is_public == True).first()
    if not original:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Public trip not found")

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

    original_sections = (
        db.query(TripSection)
        .filter(TripSection.trip_id == trip_id)
        .order_by(TripSection.order_index)
        .all()
    )
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
        db.flush()

        # Copy linked activities so the cloned trip is complete.
        for sa in db.query(SectionActivity).filter(SectionActivity.section_id == sec.id).all():
            db.add(SectionActivity(section_id=new_sec.id, activity_id=sa.activity_id))

    db.commit()
    db.refresh(new_trip)
    return attach_status(new_trip)
