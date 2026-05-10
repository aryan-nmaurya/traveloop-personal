from datetime import date

from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.models.user import User


def compute_trip_status(trip: Trip) -> str:
    today = date.today()
    if not trip.start_date or not trip.end_date:
        return "upcoming"
    if today < trip.start_date:
        return "upcoming"
    if trip.start_date <= today <= trip.end_date:
        return "ongoing"
    return "completed"


def get_recent_trips(db: Session, user_id: int, limit: int = 3) -> list[Trip]:
    trips = (
        db.query(Trip)
        .filter(Trip.user_id == user_id)
        .order_by(Trip.created_at.desc())
        .limit(limit)
        .all()
    )
    for trip in trips:
        trip.status = compute_trip_status(trip)
    return trips
