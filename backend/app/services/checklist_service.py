from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.checklist import ChecklistItem
from app.models.trip import Trip
from app.schemas.checklist import ChecklistItemCreate, ChecklistItemUpdate


def _verify_trip_owner(db: Session, trip_id: int, user_id: int) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return trip


def get_checklist(db: Session, trip_id: int, user_id: int) -> list[ChecklistItem]:
    _verify_trip_owner(db, trip_id, user_id)
    return db.query(ChecklistItem).filter(ChecklistItem.trip_id == trip_id).order_by(ChecklistItem.category, ChecklistItem.id).all()


def add_item(db: Session, trip_id: int, user_id: int, data: ChecklistItemCreate) -> ChecklistItem:
    _verify_trip_owner(db, trip_id, user_id)
    item = ChecklistItem(trip_id=trip_id, name=data.name, category=data.category)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_item(db: Session, trip_id: int, item_id: int, user_id: int, data: ChecklistItemUpdate) -> ChecklistItem:
    _verify_trip_owner(db, trip_id, user_id)
    item = db.query(ChecklistItem).filter(ChecklistItem.id == item_id, ChecklistItem.trip_id == trip_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, trip_id: int, item_id: int, user_id: int) -> None:
    _verify_trip_owner(db, trip_id, user_id)
    item = db.query(ChecklistItem).filter(ChecklistItem.id == item_id, ChecklistItem.trip_id == trip_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    db.delete(item)
    db.commit()


def reset_checklist(db: Session, trip_id: int, user_id: int) -> None:
    _verify_trip_owner(db, trip_id, user_id)
    db.query(ChecklistItem).filter(ChecklistItem.trip_id == trip_id).update({"is_packed": False})
    db.commit()
