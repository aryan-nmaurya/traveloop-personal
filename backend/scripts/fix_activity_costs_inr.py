"""
One-time migration: convert activity costs from USD scale → INR.

Run this if the database was seeded with seed_cities.py before the INR fix
(i.e. activities have costs like 5.00, 25.00, 17.00 instead of 420, 2100, 1400).

Detection heuristic: if MAX(cost) across all non-free activities is < 500,
the costs are almost certainly USD-scale. Multiply every non-zero cost by 83.

Safe to run multiple times — it skips if costs are already in INR range.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.activity import Activity
from sqlalchemy import func, cast, Float

INR_MULTIPLIER = 83  # approximate USD → INR rate


def run():
    db = SessionLocal()
    try:
        total = db.query(Activity).count()
        if total == 0:
            print("No activities found — nothing to migrate.")
            return

        max_cost = db.query(func.max(cast(Activity.cost, Float))).scalar() or 0

        if max_cost >= 500:
            print(f"Activities already appear to be in INR range (max cost = {max_cost:.2f}). Skipping.")
            return

        print(f"Detected USD-scale costs (max = {max_cost:.2f}). Converting {total} activities × {INR_MULTIPLIER}…")
        updated = 0
        for activity in db.query(Activity).all():
            if activity.cost and float(activity.cost) > 0:
                activity.cost = round(float(activity.cost) * INR_MULTIPLIER, 2)
                updated += 1

        db.commit()
        print(f"✅ Converted {updated} activity costs to INR.")

    except Exception as e:
        db.rollback()
        print(f"❌ Migration failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()
