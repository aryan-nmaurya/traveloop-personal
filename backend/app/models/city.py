from sqlalchemy import Column, DateTime, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    country = Column(String(100))
    region = Column(String(100))
    cost_index = Column(Numeric(5, 2))
    popularity_score = Column(Integer, default=0)
    description = Column(Text)
    image_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    activities = relationship("Activity", back_populates="city", cascade="all, delete-orphan")
    sections = relationship("TripSection", back_populates="city")
