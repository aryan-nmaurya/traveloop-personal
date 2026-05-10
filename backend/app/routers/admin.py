from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.dependencies.auth import require_admin
from app.dependencies.db import get_db
from app.models.activity import Activity
from app.models.city import City
from app.models.section import SectionActivity, TripSection
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserResponse])
def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * limit
    return db.query(User).order_by(User.created_at.desc()).offset(offset).limit(limit).all()


@router.get("/analytics/popular-cities")
def popular_cities(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(City.id, City.name, func.count(TripSection.id).label("section_count"))
        .join(TripSection, TripSection.city_id == City.id)
        .group_by(City.id, City.name)
        .order_by(func.count(TripSection.id).desc())
        .limit(10)
        .all()
    )
    return [{"city_id": r.id, "city_name": r.name, "section_count": r.section_count} for r in rows]


@router.get("/analytics/popular-activities")
def popular_activities(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Activity.id, Activity.name, func.count(SectionActivity.section_id).label("usage_count"))
        .join(SectionActivity, SectionActivity.activity_id == Activity.id)
        .group_by(Activity.id, Activity.name)
        .order_by(func.count(SectionActivity.section_id).desc())
        .limit(10)
        .all()
    )
    return [{"activity_id": r.id, "activity_name": r.name, "usage_count": r.usage_count} for r in rows]


@router.get("/analytics/user-trends")
def user_trends(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(
            func.to_char(func.date_trunc("month", User.created_at), "YYYY-MM").label("month"),
            func.count(User.id).label("new_users"),
        )
        .group_by(func.date_trunc("month", User.created_at))
        .order_by(func.date_trunc("month", User.created_at).desc())
        .limit(12)
        .all()
    )
    return [{"month": r.month, "new_users": r.new_users} for r in rows]
