"""
Repair two classes of costing errors in the live DB:

A) Corrupted trip budgets caused by the old `parseInt(range_string.replace(/[^0-9]/g,''))`
   bug in MovieItineraryPage.  The YJHD budget string '₹45,000 – ₹75,000' was
   mis-parsed to 4,500,075,000.  Fix: set to the correct upper-end value.

B) AI-generated trips whose sections all have budget=0 because the AI wrote
   free-text descriptions instead of structured cost fields.  Fix: delete the
   garbage text-dump sections and replace with realistic budgeted stop sections.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.trip import Trip
from app.models.section import TripSection


# ── A. Realistic budgets for each movie trip ──────────────────────────────────
# key = corrupted budget value (exact match) → (correct_budget, trip_name_hint)
CORRUPTED_BUDGET_MAP = {
    4500075000.00: 75000,    # YJHD  ₹45,000–₹75,000  →  ₹75,000 (upper bound)
}

# ── B. Realistic section templates for AI trips with all-zero sections ────────
# Keyed by trip name substring (case-insensitive).
AI_TRIP_TEMPLATES = {
    "goa": {
        "budget": 50000,
        "sections": [
            {"type": "transfer", "description": "Flight / train to Goa + airport transfers", "budget": 8000, "order_index": 0},
            {"type": "stay",     "description": "North Goa — Candolim / Calangute beach hotel (4 nights)", "budget": 14000, "order_index": 1},
            {"type": "experience","description": "Fort Aguada, Anjuna flea market, Old Goa churches", "budget": 4000, "order_index": 2},
            {"type": "adventure","description": "Water sports — jet ski, parasailing, banana boat at Baga", "budget": 5000, "order_index": 3},
            {"type": "stay",     "description": "South Goa — Palolem / Agonda quiet beach resort (1 night)", "budget": 4000, "order_index": 4},
            {"type": "experience","description": "Dudhsagar waterfall trek + spice plantation tour", "budget": 3500, "order_index": 5},
            {"type": "wellness", "description": "Beach shacks, seafood dinners, evening walks — daily food budget", "budget": 8500, "order_index": 6},
            {"type": "transfer", "description": "Return travel + local Goa taxis / rental scooter", "budget": 3000, "order_index": 7},
        ],
    },
    "meghalaya": {
        "budget": 50000,
        "sections": [
            {"type": "transfer", "description": "Train / flight Bihar → Guwahati + shared cab to Shillong", "budget": 12000, "order_index": 0},
            {"type": "stay",     "description": "Shillong — boutique guesthouse (3 nights)", "budget": 9000, "order_index": 1},
            {"type": "experience","description": "Elephant Falls, Don Bosco Museum, Police Bazaar market walk", "budget": 2000, "order_index": 2},
            {"type": "adventure","description": "Cherrapunji — Nohkalikai Falls, Double-decker living root bridge trek", "budget": 5000, "order_index": 3},
            {"type": "stay",     "description": "Dawki / Shnongpdeng — river-side camp (2 nights)", "budget": 6000, "order_index": 4},
            {"type": "experience","description": "Dawki river boat ride, Mawlynnong (cleanest village in Asia)", "budget": 3000, "order_index": 5},
            {"type": "wellness", "description": "Local food — Jadoh, Tungrymbai, momos — daily meals budget", "budget": 7000, "order_index": 6},
            {"type": "transfer", "description": "Return shared cab Shillong → Guwahati + train/flight home", "budget": 6000, "order_index": 7},
        ],
    },
}

# Fallback template for unrecognised AI trips
FALLBACK_TEMPLATE = {
    "sections": [
        {"type": "transfer", "description": "Outbound travel — flights / train", "budget_frac": 0.18, "order_index": 0},
        {"type": "stay",     "description": "Main accommodation (majority of nights)", "budget_frac": 0.35, "order_index": 1},
        {"type": "experience","description": "Key sightseeing and activities", "budget_frac": 0.25, "order_index": 2},
        {"type": "wellness", "description": "Food, local transport, and incidentals", "budget_frac": 0.15, "order_index": 3},
        {"type": "transfer", "description": "Return travel", "budget_frac": 0.07, "order_index": 4},
    ]
}


def _match_template(trip_name: str):
    name_lower = trip_name.lower()
    for key, tmpl in AI_TRIP_TEMPLATES.items():
        if key in name_lower:
            return tmpl
    return None


def run():
    db = SessionLocal()
    try:
        # ── A. Fix corrupted trip budgets ─────────────────────────────────────
        fixed_budgets = 0
        for bad_val, good_val in CORRUPTED_BUDGET_MAP.items():
            trips = db.query(Trip).filter(Trip.budget == bad_val).all()
            for t in trips:
                print(f"  [A] Trip {t.id} '{t.name[:50]}': budget {t.budget} → {good_val}")
                t.budget = good_val
                fixed_budgets += 1

        # ── B. Fix AI-trip sections with all-zero budgets ─────────────────────
        fixed_trips = 0
        all_trips = db.query(Trip).all()
        for trip in all_trips:
            secs = db.query(TripSection).filter(TripSection.trip_id == trip.id).all()
            if not secs:
                continue
            all_zero = all(float(s.budget or 0) == 0 for s in secs)
            if not all_zero:
                continue

            trip_budget = float(trip.budget or 50000)
            tmpl = _match_template(trip.name)

            print(f"  [B] Trip {trip.id} '{trip.name[:50]}' — replacing {len(secs)} zero-budget sections")

            # Delete the old garbage sections
            for s in secs:
                db.delete(s)
            db.flush()

            if tmpl:
                for sec_data in tmpl["sections"]:
                    db.add(TripSection(
                        trip_id=trip.id,
                        type=sec_data["type"],
                        description=sec_data["description"],
                        budget=sec_data["budget"],
                        order_index=sec_data["order_index"],
                    ))
            else:
                # Distribute budget proportionally using fallback template
                for sec_data in FALLBACK_TEMPLATE["sections"]:
                    db.add(TripSection(
                        trip_id=trip.id,
                        type=sec_data["type"],
                        description=sec_data["description"],
                        budget=round(trip_budget * sec_data["budget_frac"]),
                        order_index=sec_data["order_index"],
                    ))

            fixed_trips += 1

        db.commit()
        print(f"\n✅ Done — {fixed_budgets} trip budget(s) corrected, {fixed_trips} AI trip(s) restructured.")

    except Exception as e:
        db.rollback()
        print(f"❌ Failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()
