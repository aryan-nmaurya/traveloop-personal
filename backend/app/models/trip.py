from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    cover_photo_url = Column(Text)
    is_public = Column(Boolean, default=False, index=True)
    budget = Column(Numeric(12, 2))
    status = Column(String(20))  # ongoing | upcoming | completed
    invoice_status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp())
    updated_at = Column(DateTime(timezone=True), server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    user = relationship("User", back_populates="trips")
    sections = relationship("TripSection", back_populates="trip", cascade="all, delete-orphan", order_by="TripSection.order_index")
    checklist_items = relationship("ChecklistItem", back_populates="trip", cascade="all, delete-orphan")
    notes = relationship("TripNote", back_populates="trip", cascade="all, delete-orphan")
