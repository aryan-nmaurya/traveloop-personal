from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.note import TripNoteCreate, TripNoteResponse, TripNoteUpdate
from app.services import note_service

router = APIRouter(prefix="/trips/{trip_id}/notes", tags=["notes"])


@router.get("", response_model=list[TripNoteResponse])
def get_notes(
    trip_id: int,
    filter: str | None = Query(None, description="all | day | stop"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return note_service.get_notes(db, trip_id, current_user.id, filter)


@router.post("", response_model=TripNoteResponse, status_code=201)
def create_note(
    trip_id: int,
    data: TripNoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return note_service.create_note(db, trip_id, current_user.id, data)


@router.put("/{note_id}", response_model=TripNoteResponse)
def update_note(
    trip_id: int,
    note_id: int,
    data: TripNoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return note_service.update_note(db, trip_id, note_id, current_user.id, data)


@router.delete("/{note_id}", status_code=204)
def delete_note(
    trip_id: int,
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note_service.delete_note(db, trip_id, note_id, current_user.id)
