from fastapi import HTTPException, status
from sqlalchemy import func, distinct
from sqlalchemy.orm import Session

from app.models.city import City


def get_cities(
    db: Session,
    q: str | None = None,
    region: str | None = None,
    country: str | None = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[City], int]:
    query = db.query(City)
    if q:
        query = query.filter(
            City.name.ilike(f"%{q}%") | City.country.ilike(f"%{q}%") | City.region.ilike(f"%{q}%")
        )
    if region:
        query = query.filter(City.region.ilike(f"%{region}%"))
    if country:
        query = query.filter(City.country.ilike(f"%{country}%"))
    total = query.count()
    offset = (page - 1) * limit
    cities = query.order_by(City.popularity_score.desc()).offset(offset).limit(limit).all()
    return cities, total


def get_countries(db: Session) -> list[dict]:
    """Return distinct countries with their city count and a representative image."""
    rows = (
        db.query(
            City.country,
            func.count(City.id).label("city_count"),
            func.max(City.image_url).label("image_url"),
        )
        .group_by(City.country)
        .order_by(func.count(City.id).desc())
        .all()
    )
    return [{"country": r.country, "city_count": r.city_count, "image_url": r.image_url} for r in rows]


def get_regions_for_country(db: Session, country: str) -> list[dict]:
    """Return distinct regions within a country with city counts."""
    rows = (
        db.query(
            City.region,
            func.count(City.id).label("city_count"),
            func.max(City.image_url).label("image_url"),
        )
        .filter(City.country.ilike(f"%{country}%"))
        .group_by(City.region)
        .order_by(func.count(City.id).desc())
        .all()
    )
    return [{"region": r.region, "city_count": r.city_count, "image_url": r.image_url} for r in rows if r.region]


def get_city(db: Session, city_id: int) -> City:
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
    return city
