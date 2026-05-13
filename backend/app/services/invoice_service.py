from datetime import date
from typing import Any, cast
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.models.section import TripSection


def get_invoice(db: Session, trip_id: int, user_id: int) -> dict:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    sections = db.query(TripSection).filter(TripSection.trip_id == trip_id).order_by(TripSection.order_index).all()

    line_items = []
    subtotal = 0.0
    for sec in sections:
        # Cast to Any to satisfy linter that thinks sec.budget is a Column object
        amount = float(cast(Any, sec.budget)) if sec.budget else 0.0
        subtotal += amount
        line_items.append({
            "section_id": sec.id,
            "description": sec.description or sec.type or "Section",
            "type": sec.type,
            "start_date": sec.start_date.isoformat() if sec.start_date else None,
            "end_date": sec.end_date.isoformat() if sec.end_date else None,
            "amount": amount,
        })

    tax_rate = 0.05  # 5% GST applicable to Indian tour operators
    tax = round(subtotal * tax_rate, 2)
    discount = 0.0  # Future support for discounts
    total = round(subtotal + tax - discount, 2)
    # Cast to float to satisfy linter
    budget = float(cast(Any, trip.budget)) if trip.budget else None

    return {
        "trip_id": trip.id,
        "trip_name": trip.name,
        "generated_date": date.today().isoformat(),
        "invoice_status": trip.invoice_status or "pending",
        "line_items": line_items,
        "subtotal": round(subtotal, 2),
        "tax": tax,
        "discount": discount,
        "total": total,
        "budget": budget,
        "budget_remaining": round(budget - total, 2) if budget is not None else None,
    }


def update_invoice_status(db: Session, trip_id: int, user_id: int, new_status: str) -> None:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    setattr(trip, 'invoice_status', new_status)
    db.commit()
