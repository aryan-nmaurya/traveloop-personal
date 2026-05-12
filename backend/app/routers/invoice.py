import io
from enum import Enum

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.services import invoice_service

router = APIRouter(prefix="/trips/{trip_id}/invoice", tags=["invoice"])


class InvoiceStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    overdue = "overdue"
    cancelled = "cancelled"


class InvoiceStatusUpdate(BaseModel):
    status: InvoiceStatus


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
    invoice_service.update_invoice_status(db, trip_id, current_user.id, data.status.value)
    return {"message": f"Invoice status updated to {data.status.value}"}


@router.get("/pdf")
def get_invoice_pdf(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invoice = invoice_service.get_invoice(db, trip_id, current_user.id)

    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import mm
        from reportlab.pdfgen import canvas as rl_canvas

        buffer = io.BytesIO()
        c = rl_canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # ── Header ──────────────────────────────────────────────────────────
        c.setFont("Helvetica-Bold", 20)
        c.drawString(20 * mm, height - 25 * mm, "Traveloop — Trip Invoice")

        c.setFont("Helvetica", 11)
        c.drawString(20 * mm, height - 33 * mm, f"Trip: {invoice['trip_name']}")
        c.drawString(20 * mm, height - 39 * mm, f"Generated: {invoice['generated_date']}")
        c.drawString(20 * mm, height - 45 * mm, f"Status: {invoice['invoice_status'].upper()}")

        # ── Line items ───────────────────────────────────────────────────────
        y = height - 58 * mm
        c.setFont("Helvetica-Bold", 10)
        c.drawString(20 * mm, y, "Type")
        c.drawString(60 * mm, y, "Description")
        c.drawString(130 * mm, y, "Dates")
        c.drawString(175 * mm, y, "Amount")

        y -= 6 * mm
        c.line(20 * mm, y, 190 * mm, y)
        y -= 5 * mm

        c.setFont("Helvetica", 9)
        for item in invoice.get("line_items", []):
            date_str = ""
            if item.get("start_date"):
                date_str = item["start_date"]
            if item.get("end_date"):
                date_str += f" → {item['end_date']}"
            c.drawString(20 * mm, y, str(item.get("type") or "—")[:14])
            c.drawString(60 * mm, y, str(item.get("description") or "")[:40])
            c.drawString(130 * mm, y, date_str[:20])
            c.drawString(175 * mm, y, f"₹{item.get('amount', 0):,.2f}")
            y -= 6 * mm
            if y < 40 * mm:
                c.showPage()
                y = height - 25 * mm

        # ── Totals ───────────────────────────────────────────────────────────
        y -= 4 * mm
        c.line(20 * mm, y, 190 * mm, y)
        y -= 6 * mm
        c.setFont("Helvetica-Bold", 10)
        c.drawString(140 * mm, y, "Subtotal:")
        c.drawString(175 * mm, y, f"₹{invoice['subtotal']:,.2f}")
        y -= 6 * mm
        c.drawString(140 * mm, y, "Tax:")
        c.drawString(175 * mm, y, f"₹{invoice['tax']:,.2f}")
        y -= 6 * mm
        c.setFont("Helvetica-Bold", 12)
        c.drawString(140 * mm, y, "Grand Total:")
        c.drawString(175 * mm, y, f"₹{invoice['total']:,.2f}")

        c.save()
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=invoice_{trip_id}.pdf"},
        )

    except ImportError:
        # reportlab not available — fall back to downloadable JSON
        import json
        json_bytes = json.dumps(invoice, indent=2).encode("utf-8")
        return StreamingResponse(
            io.BytesIO(json_bytes),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=invoice_{trip_id}.json"},
        )
