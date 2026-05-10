from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.core.database import Base


class SavedDestination(Base):
    __tablename__ = "saved_destinations"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"), primary_key=True)
