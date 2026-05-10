from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.city import CitiesListResponse, CityResponse
from app.services import city_service

router = APIRouter(prefix="/cities", tags=["cities"])


@router.get("", response_model=CitiesListResponse)
def list_cities(
    q: str | None = Query(None, description="Search by city name"),
    region: str | None = Query(None, description="Filter by region"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cities, total = city_service.get_cities(db, q, region, page, limit)
    return CitiesListResponse(cities=cities, total=total)


@router.get("/{city_id}", response_model=CityResponse)
def get_city(
    city_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return city_service.get_city(db, city_id)
