from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.utils.trip_utils import attach_status


def get_recent_trips(db: Session, user_id: int, limit: int = 3) -> list[Trip]:
    trips = (
        db.query(Trip)
        .filter(Trip.user_id == user_id)
        .order_by(Trip.created_at.desc())
        .limit(limit)
        .all()
    )
    for trip in trips:
        attach_status(trip)
    return trips
