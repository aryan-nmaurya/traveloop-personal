from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.services import invoice_service

router = APIRouter(prefix="/trips/{trip_id}/invoice", tags=["invoice"])


class InvoiceStatusUpdate(BaseModel):
    status: str


@router.get("")
def get_invoice(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return invoice_service.get_invoice(db, trip_id, current_user.id)


@router.put("/status")
def update_status(
    trip_id: int,
    data: InvoiceStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invoice_service.update_invoice_status(db, trip_id, current_user.id, data.status)
    return {"message": f"Invoice status updated to {data.status}"}
