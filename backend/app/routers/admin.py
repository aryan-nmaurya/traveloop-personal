from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.dependencies.auth import require_admin
from app.dependencies.db import get_db
from app.models.activity import Activity
from app.models.city import City
from app.models.section import SectionActivity, TripSection
from app.models.trip import Trip
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * limit
    total = db.query(func.count(User.id)).scalar()
    users = db.query(User).order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    # Serialize manually to match UserResponse shape
    return {
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "phone": u.phone or "",
                "city": u.city or "",
                "country": u.country or "",
                "profile_photo_url": u.profile_photo_url,
                "role": u.role,
                "language_pref": getattr(u, "language_pref", "en"),
                "is_active": getattr(u, "is_active", True),
                "created_at": str(u.created_at) if u.created_at else None,
            }
            for u in users
        ],
        "total": total,
    }


@router.get("/analytics/popular-cities")
def popular_cities(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Popular cities by trip section usage. Falls back to all cities sorted by popularity."""
    rows = (
        db.query(City.id, City.name, func.count(TripSection.id).label("section_count"))
        .join(TripSection, TripSection.city_id == City.id)
        .group_by(City.id, City.name)
        .order_by(func.count(TripSection.id).desc())
        .limit(10)
        .all()
    )
    if rows:
        return {"cities": [{"city_id": r.id, "city_name": r.name, "section_count": r.section_count} for r in rows]}

    # Fallback: show all cities ranked by popularity_score
    all_cities = db.query(City).order_by(City.popularity_score.desc()).limit(12).all()
    return {
        "cities": [
            {"city_id": c.id, "city_name": c.name, "section_count": c.popularity_score}
            for c in all_cities
        ]
    }


@router.get("/analytics/popular-activities")
def popular_activities(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Popular activities by usage. Falls back to all activities."""
    rows = (
        db.query(Activity.id, Activity.name, func.count(SectionActivity.section_id).label("usage_count"))
        .join(SectionActivity, SectionActivity.activity_id == Activity.id)
        .group_by(Activity.id, Activity.name)
        .order_by(func.count(SectionActivity.section_id).desc())
        .limit(10)
        .all()
    )
    if rows:
        return {"activities": [{"activity_id": r.id, "activity_name": r.name, "usage_count": r.usage_count} for r in rows]}

    # Fallback: show all activities ranked by cost
    all_activities = db.query(Activity).order_by(Activity.cost.desc()).limit(15).all()
    return {
        "activities": [
            {"activity_id": a.id, "activity_name": a.name, "usage_count": 0}
            for a in all_activities
        ]
    }


@router.get("/analytics/user-trends")
def user_trends(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Monthly user signups — uses strftime for SQLite compatibility."""
    try:
        # SQLite compatible
        rows = (
            db.query(
                func.strftime("%Y-%m", User.created_at).label("month"),
                func.count(User.id).label("new_users"),
            )
            .group_by(func.strftime("%Y-%m", User.created_at))
            .order_by(func.strftime("%Y-%m", User.created_at).desc())
            .limit(12)
            .all()
        )
    except Exception:
        # PostgreSQL fallback
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

    return {
        "trends": [{"month": r.month, "new_users": r.new_users} for r in rows]
    }


@router.get("/analytics/overview")
def analytics_overview(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """High-level platform stats for the admin dashboard."""
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_trips = db.query(func.count(Trip.id)).scalar() or 0
    total_cities = db.query(func.count(City.id)).scalar() or 0
    total_activities = db.query(func.count(Activity.id)).scalar() or 0

    return {
        "total_users": total_users,
        "total_trips": total_trips,
        "total_cities": total_cities,
        "total_activities": total_activities,
    }
