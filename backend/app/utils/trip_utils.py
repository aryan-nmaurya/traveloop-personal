from datetime import date
from app.models.trip import Trip


def compute_trip_status(trip: Trip) -> str:
    today = date.today()
    if not trip.start_date or not trip.end_date:
        return "upcoming"
    if today < trip.start_date:
        return "upcoming"
    if trip.start_date <= today <= trip.end_date:
        return "ongoing"
    return "completed"


def attach_status(trip: Trip) -> Trip:
    setattr(trip, "status", compute_trip_status(trip))
    return trip
