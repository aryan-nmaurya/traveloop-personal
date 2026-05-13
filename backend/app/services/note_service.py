from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.note import TripNote
from app.models.trip import Trip
from app.schemas.note import TripNoteCreate, TripNoteUpdate


def _verify_trip_owner(db: Session, trip_id: int, user_id: int) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return trip


def get_notes(db: Session, trip_id: int, user_id: int, filter: str | None = None) -> list[TripNote]:
    _verify_trip_owner(db, trip_id, user_id)
    query = db.query(TripNote).filter(TripNote.trip_id == trip_id)
    if filter == "stop":
        query = query.filter(TripNote.section_id.isnot(None))

    order = TripNote.created_at if filter == "day" else TripNote.created_at.desc()
    return query.order_by(order).all()


def create_note(db: Session, trip_id: int, user_id: int, data: TripNoteCreate) -> TripNote:
    _verify_trip_owner(db, trip_id, user_id)
    note = TripNote(trip_id=trip_id, section_id=data.section_id, title=data.title, body=data.body)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update_note(db: Session, trip_id: int, note_id: int, user_id: int, data: TripNoteUpdate) -> TripNote:
    _verify_trip_owner(db, trip_id, user_id)
    note = db.query(TripNote).filter(TripNote.id == note_id, TripNote.trip_id == trip_id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, trip_id: int, note_id: int, user_id: int) -> None:
    _verify_trip_owner(db, trip_id, user_id)
    note = db.query(TripNote).filter(TripNote.id == note_id, TripNote.trip_id == trip_id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    db.delete(note)
    db.commit()
