from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.section import TripSection, SectionActivity
from app.models.trip import Trip
from app.schemas.section import TripSectionCreate, TripSectionUpdate


def _verify_trip_owner(db: Session, trip_id: int, user_id: int) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return trip


def get_sections(db: Session, trip_id: int, user_id: int) -> list[TripSection]:
    _verify_trip_owner(db, trip_id, user_id)
    return db.query(TripSection).filter(TripSection.trip_id == trip_id).order_by(TripSection.order_index).all()


def create_section(db: Session, trip_id: int, user_id: int, data: TripSectionCreate) -> TripSection:
    _verify_trip_owner(db, trip_id, user_id)
    section = TripSection(
        trip_id=trip_id,
        city_id=data.city_id,
        order_index=data.order_index,
        type=data.type,
        description=data.description,
        start_date=data.start_date,
        end_date=data.end_date,
        budget=data.budget,
    )
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


def update_section(db: Session, trip_id: int, section_id: int, user_id: int, data: TripSectionUpdate) -> TripSection:
    _verify_trip_owner(db, trip_id, user_id)
    section = db.query(TripSection).filter(TripSection.id == section_id, TripSection.trip_id == trip_id).first()
    if not section:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(section, field, value)
    db.commit()
    db.refresh(section)
    return section


def delete_section(db: Session, trip_id: int, section_id: int, user_id: int) -> None:
    _verify_trip_owner(db, trip_id, user_id)
    section = db.query(TripSection).filter(TripSection.id == section_id, TripSection.trip_id == trip_id).first()
    if not section:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
    db.delete(section)
    db.commit()


def add_activity_to_section(db: Session, trip_id: int, section_id: int, user_id: int, activity_id: int) -> None:
    _verify_trip_owner(db, trip_id, user_id)
    section = db.query(TripSection).filter(TripSection.id == section_id, TripSection.trip_id == trip_id).first()
    if not section:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
    existing = db.query(SectionActivity).filter(
        SectionActivity.section_id == section_id, SectionActivity.activity_id == activity_id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Activity already linked to this section")
    db.add(SectionActivity(section_id=section_id, activity_id=activity_id))
    db.commit()


def remove_activity_from_section(db: Session, trip_id: int, section_id: int, user_id: int, activity_id: int) -> None:
    _verify_trip_owner(db, trip_id, user_id)
    link = db.query(SectionActivity).filter(
        SectionActivity.section_id == section_id, SectionActivity.activity_id == activity_id
    ).first()
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not linked to this section")
    db.delete(link)
    db.commit()
