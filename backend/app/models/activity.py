from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50))  # physical | cultural | food | adventure
    cost = Column(Numeric(10, 2))
    duration_minutes = Column(Integer)
    image_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    city = relationship("City", back_populates="activities")
    sections = relationship("TripSection", secondary="section_activities", back_populates="activities")
