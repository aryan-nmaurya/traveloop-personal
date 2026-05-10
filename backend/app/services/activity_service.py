from sqlalchemy.orm import Session

from app.models.activity import Activity


def get_activities(
    db: Session,
    city_id: int | None = None,
    type: str | None = None,
    max_cost: float | None = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[Activity], int]:
    query = db.query(Activity)
    if city_id:
        query = query.filter(Activity.city_id == city_id)
    if type:
        query = query.filter(Activity.type == type)
    if max_cost is not None:
        query = query.filter(Activity.cost <= max_cost)
    total = query.count()
    offset = (page - 1) * limit
    activities = query.order_by(Activity.name).offset(offset).limit(limit).all()
    return activities, total
