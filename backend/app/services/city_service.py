from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.city import City


def get_cities(
    db: Session,
    q: str | None = None,
    region: str | None = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[City], int]:
    query = db.query(City)
    if q:
        query = query.filter(City.name.ilike(f"%{q}%"))
    if region:
        query = query.filter(City.region.ilike(f"%{region}%"))
    total = query.count()
    offset = (page - 1) * limit
    cities = query.order_by(City.popularity_score.desc()).offset(offset).limit(limit).all()
    return cities, total


def get_city(db: Session, city_id: int) -> City:
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
    return city
