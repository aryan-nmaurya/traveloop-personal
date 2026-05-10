from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class TripNote(Base):
    __tablename__ = "trip_notes"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    section_id = Column(Integer, ForeignKey("trip_sections.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255))
    body = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    trip = relationship("Trip", back_populates="notes")
    section = relationship("TripSection", back_populates="notes")
