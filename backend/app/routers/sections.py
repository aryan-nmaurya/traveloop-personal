from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.section import TripSectionCreate, TripSectionResponse, TripSectionUpdate
from app.services import section_service

router = APIRouter(prefix="/trips/{trip_id}/sections", tags=["sections"])


class ActivityLink(BaseModel):
    activity_id: int


@router.get("", response_model=list[TripSectionResponse])
def list_sections(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return section_service.get_sections(db, trip_id, current_user.id)


@router.post("", response_model=TripSectionResponse, status_code=201)
def create_section(
    trip_id: int,
    data: TripSectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return section_service.create_section(db, trip_id, current_user.id, data)


@router.put("/{section_id}", response_model=TripSectionResponse)
def update_section(
    trip_id: int,
    section_id: int,
    data: TripSectionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return section_service.update_section(db, trip_id, section_id, current_user.id, data)


@router.delete("/{section_id}", status_code=204)
def delete_section(
    trip_id: int,
    section_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    section_service.delete_section(db, trip_id, section_id, current_user.id)


@router.post("/{section_id}/activities", status_code=201)
def add_activity(
    trip_id: int,
    section_id: int,
    data: ActivityLink,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    section_service.add_activity_to_section(db, trip_id, section_id, current_user.id, data.activity_id)
    return {"message": "Activity linked"}


@router.delete("/{section_id}/activities/{activity_id}", status_code=204)
def remove_activity(
    trip_id: int,
    section_id: int,
    activity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    section_service.remove_activity_from_section(db, trip_id, section_id, current_user.id, activity_id)
