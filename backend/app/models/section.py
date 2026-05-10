from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class TripSection(Base):
    __tablename__ = "trip_sections"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="SET NULL"), nullable=True)
    order_index = Column(Integer, default=0)
    type = Column(String(50))  # travel | hotel | activity | other
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    budget = Column(Numeric(12, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp())

    trip = relationship("Trip", back_populates="sections")
    city = relationship("City", back_populates="sections")
    notes = relationship("TripNote", back_populates="section")
    activities = relationship("Activity", secondary="section_activities", back_populates="sections")


class SectionActivity(Base):
    __tablename__ = "section_activities"
    __table_args__ = (UniqueConstraint("section_id", "activity_id"),)

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("trip_sections.id", ondelete="CASCADE"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
