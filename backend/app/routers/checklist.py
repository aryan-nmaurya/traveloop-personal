from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.checklist import ChecklistItemCreate, ChecklistItemResponse, ChecklistItemUpdate
from app.services import checklist_service

router = APIRouter(prefix="/trips/{trip_id}/checklist", tags=["checklist"])


@router.get("", response_model=list[ChecklistItemResponse])
def get_checklist(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return checklist_service.get_checklist(db, trip_id, current_user.id)


@router.post("", response_model=ChecklistItemResponse, status_code=201)
def add_item(
    trip_id: int,
    data: ChecklistItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return checklist_service.add_item(db, trip_id, current_user.id, data)


@router.post("/reset", status_code=200)
def reset_checklist(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    checklist_service.reset_checklist(db, trip_id, current_user.id)
    return {"message": "Checklist reset"}


@router.put("/{item_id}", response_model=ChecklistItemResponse)
def update_item(
    trip_id: int,
    item_id: int,
    data: ChecklistItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return checklist_service.update_item(db, trip_id, item_id, current_user.id, data)


@router.delete("/{item_id}", status_code=204)
def delete_item(
    trip_id: int,
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    checklist_service.delete_item(db, trip_id, item_id, current_user.id)
