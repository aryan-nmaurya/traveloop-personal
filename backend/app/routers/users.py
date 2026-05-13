from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.city import City
from app.models.saved_destination import SavedDestination
from app.models.user import User
from app.schemas.city import CityResponse
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", status_code=204)
def delete_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.delete(current_user)
    db.commit()


@router.get("/me/saved-destinations", response_model=list[CityResponse])
def get_saved_destinations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.query(SavedDestination).filter(SavedDestination.user_id == current_user.id).all()
    city_ids = [row.city_id for row in rows]
    if not city_ids:
        return []
    return db.query(City).filter(City.id.in_(city_ids)).all()


@router.post("/me/saved-destinations/{city_id}", status_code=201)
def save_destination(
    city_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
    existing = db.query(SavedDestination).filter(
        SavedDestination.user_id == current_user.id,
        SavedDestination.city_id == city_id,
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already saved")
    db.add(SavedDestination(user_id=current_user.id, city_id=city_id))
    db.commit()
    return {"message": "Saved"}


@router.delete("/me/saved-destinations/{city_id}", status_code=204)
def remove_saved_destination(
    city_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = db.query(SavedDestination).filter(
        SavedDestination.user_id == current_user.id,
        SavedDestination.city_id == city_id,
    ).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not saved")
    db.delete(row)
    db.commit()
