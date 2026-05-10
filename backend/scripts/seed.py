"""Seed script — populates cities, activities, and a demo user."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.city import City
from app.models.activity import Activity
from app.core.security import hash_password

Base.metadata.create_all(bind=engine)

CITIES = [
    {"name": "Manali", "country": "India", "region": "Himachal Pradesh", "cost_index": 2.5, "popularity_score": 92,
     "description": "Snow-capped peaks, pine forests, and Himalayan adventures await in this iconic mountain town.",
     "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Udaipur", "country": "India", "region": "Rajasthan", "cost_index": 3.0, "popularity_score": 90,
     "description": "The City of Lakes, known for royal palaces, shimmering lakes, and Rajasthani heritage.",
     "image_url": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Goa", "country": "India", "region": "Goa", "cost_index": 3.5, "popularity_score": 95,
     "description": "Sun, sand, and Portuguese charm meet vibrant nightlife on India's most beloved coastline.",
     "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Jaisalmer", "country": "India", "region": "Rajasthan", "cost_index": 2.0, "popularity_score": 87,
     "description": "The Golden City — sand dunes, camel safaris, and forts rising from the Thar Desert.",
     "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Leh", "country": "India", "region": "Ladakh", "cost_index": 3.2, "popularity_score": 94,
     "description": "A high-altitude paradise with stark landscapes, ancient monasteries, and crystal-clear skies.",
     "image_url": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Rishikesh", "country": "India", "region": "Uttarakhand", "cost_index": 2.0, "popularity_score": 89,
     "description": "The Yoga Capital of the World — river Ganges, ashrams, bungee jumping, and rafting.",
     "image_url": "https://images.unsplash.com/photo-1588882534102-c60f0c90df97?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Mumbai", "country": "India", "region": "Maharashtra", "cost_index": 4.0, "popularity_score": 96,
     "description": "India's city of dreams — Bollywood, street food, colonial architecture, and the iconic Marine Drive.",
     "image_url": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Havelock Island", "country": "India", "region": "Andaman & Nicobar", "cost_index": 3.8, "popularity_score": 91,
     "description": "Asia's best beach — Radhanagar — with turquoise waters, coral reefs, and untouched tropical beauty.",
     "image_url": "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Barcelona", "country": "Spain", "region": "Catalonia", "cost_index": 7.0, "popularity_score": 97,
     "description": "Gaudí's masterpieces, tapas bars, Gothic Quarter lanes, and a beach with Mediterranean sunshine.",
     "image_url": "https://images.unsplash.com/photo-1543716091-a840c05249ec?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Kasol", "country": "India", "region": "Himachal Pradesh", "cost_index": 1.5, "popularity_score": 83,
     "description": "A tiny Himalayan village on the Parvati River — the backpacker capital of India's mountains.",
     "image_url": "https://images.unsplash.com/photo-1571301375900-81de374d5f7e?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Spiti Valley", "country": "India", "region": "Himachal Pradesh", "cost_index": 2.2, "popularity_score": 85,
     "description": "Cold desert landscapes, ancient monasteries, and some of India's most remote villages at 4,000m.",
     "image_url": "https://images.unsplash.com/photo-1455156218388-5e61b526818b?auto=format&fit=crop&w=1200&q=80"},
    {"name": "Maldives", "country": "Maldives", "region": "South Asia", "cost_index": 12.0, "popularity_score": 98,
     "description": "Overwater bungalows, manta ray snorkelling, and the most pristine ocean on the planet.",
     "image_url": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80"},
]

ACTIVITIES = {
    "Manali": [
        {"name": "Rohtang Pass Trek", "description": "Hike to the famous Rohtang Pass at 3,978m for panoramic snow views.", "type": "adventure", "cost": 2500, "duration_minutes": 480,
         "image_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"},
        {"name": "Solang Valley Snow Activities", "description": "Skiing, zorbing, and snowboarding in the pristine Solang Valley.", "type": "adventure", "cost": 1800, "duration_minutes": 300,
         "image_url": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80"},
        {"name": "Old Manali Café Hopping", "description": "Explore bohemian cafes, street food, and local culture in Old Manali.", "type": "food", "cost": 800, "duration_minutes": 180,
         "image_url": "https://images.unsplash.com/photo-1559305616-3f99cd43e353?auto=format&fit=crop&w=800&q=80"},
    ],
    "Udaipur": [
        {"name": "Boat Ride on Lake Pichola", "description": "Glide across the serene lake with views of the City Palace and Jag Mandir.", "type": "cultural", "cost": 600, "duration_minutes": 90,
         "image_url": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"},
        {"name": "City Palace Heritage Tour", "description": "Explore the grandeur of the 400-year-old City Palace with a certified guide.", "type": "cultural", "cost": 1200, "duration_minutes": 180,
         "image_url": "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&w=800&q=80"},
        {"name": "Rajasthani Culinary Class", "description": "Learn to cook authentic Rajasthani dishes — dal baati churma, gatte ki sabji.", "type": "food", "cost": 2000, "duration_minutes": 240,
         "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80"},
    ],
    "Goa": [
        {"name": "Sunset at Fort Aguada", "description": "Watch the golden sunset over the Arabian Sea from this 17th-century Portuguese fort.", "type": "cultural", "cost": 200, "duration_minutes": 120,
         "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"},
        {"name": "North Goa Beach Party", "description": "Experience Goa's legendary beach parties at Baga, Calangute, and Anjuna.", "type": "adventure", "cost": 1500, "duration_minutes": 240,
         "image_url": "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=800&q=80"},
        {"name": "Dudhsagar Waterfall Trek", "description": "Trek through the Western Ghats to reach the spectacular four-tiered Dudhsagar Falls.", "type": "physical", "cost": 1800, "duration_minutes": 360,
         "image_url": "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=800&q=80"},
    ],
    "Leh": [
        {"name": "Pangong Tso Lake Visit", "description": "Experience the ethereal blue lake at 4,350m straddling the India-China border.", "type": "adventure", "cost": 3500, "duration_minutes": 720,
         "image_url": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80"},
        {"name": "Shanti Stupa Sunrise", "description": "Meditate at sunrise at the hilltop white dome stupa with sweeping views of Leh.", "type": "cultural", "cost": 0, "duration_minutes": 90,
         "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"},
        {"name": "Khardung La Pass Bike Ride", "description": "Ride to the world's highest motorable road at 5,359m on a Royal Enfield.", "type": "adventure", "cost": 4000, "duration_minutes": 480,
         "image_url": "https://images.unsplash.com/photo-1571482752528-c5a5b3e8c0e7?auto=format&fit=crop&w=800&q=80"},
    ],
    "Rishikesh": [
        {"name": "White Water River Rafting", "description": "Tackle Grade III–IV rapids on the Ganges through the scenic Himalayas.", "type": "adventure", "cost": 1200, "duration_minutes": 180,
         "image_url": "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80"},
        {"name": "Yoga & Meditation Retreat", "description": "A full-day immersive yoga session in a riverside ashram with a certified guru.", "type": "cultural", "cost": 800, "duration_minutes": 300,
         "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"},
        {"name": "Bungee Jumping", "description": "Leap from a 83m platform over the Ganges — India's highest fixed-platform bungee.", "type": "adventure", "cost": 3500, "duration_minutes": 60,
         "image_url": "https://images.unsplash.com/photo-1563804951218-467f0bec8fe4?auto=format&fit=crop&w=800&q=80"},
    ],
    "Barcelona": [
        {"name": "La Sagrada Família Tour", "description": "Visit Gaudí's extraordinary unfinished basilica, a UNESCO World Heritage Site.", "type": "cultural", "cost": 3200, "duration_minutes": 180,
         "image_url": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80"},
        {"name": "Gothic Quarter Evening Walk", "description": "Wander ancient Roman and medieval lanes, tapas bars, and hidden plazas.", "type": "cultural", "cost": 0, "duration_minutes": 150,
         "image_url": "https://images.unsplash.com/photo-1543716091-a840c05249ec?auto=format&fit=crop&w=800&q=80"},
        {"name": "Park Güell Mosaic Terraces", "description": "Explore Gaudí's fairy-tale park with colourful mosaic art and city panoramas.", "type": "cultural", "cost": 2200, "duration_minutes": 120,
         "image_url": "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=800&q=80"},
    ],
    "Jaisalmer": [
        {"name": "Camel Safari into the Thar", "description": "Ride into the golden dunes at sunset and camp overnight under the desert stars.", "type": "adventure", "cost": 3000, "duration_minutes": 480,
         "image_url": "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?auto=format&fit=crop&w=800&q=80"},
        {"name": "Jaisalmer Fort Heritage Walk", "description": "Explore the living fort — one of the world's largest — with bazaars and havelis.", "type": "cultural", "cost": 600, "duration_minutes": 180,
         "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"},
    ],
    "Mumbai": [
        {"name": "Marine Drive Night Walk", "description": "Stroll the 'Queen's Necklace' — Mumbai's iconic 3.6km seafront promenade lit at night.", "type": "cultural", "cost": 0, "duration_minutes": 90,
         "image_url": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80"},
        {"name": "Dharavi Slum Tour", "description": "A respectful, eye-opening walking tour of Asia's most dynamic entrepreneurial hub.", "type": "cultural", "cost": 1800, "duration_minutes": 180,
         "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"},
    ],
    "Havelock Island": [
        {"name": "Snorkelling at Elephant Beach", "description": "Explore pristine coral gardens and tropical fish in glass-clear waters.", "type": "adventure", "cost": 1500, "duration_minutes": 240,
         "image_url": "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"},
        {"name": "Radhanagar Beach Sunrise", "description": "Watch the sunrise on one of Asia's most beautiful beaches — voted best in Asia.", "type": "physical", "cost": 0, "duration_minutes": 90,
         "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"},
    ],
    "Maldives": [
        {"name": "Manta Ray Snorkel at Hanifaru Bay", "description": "Swim alongside hundreds of manta rays in a UNESCO Biosphere Reserve.", "type": "adventure", "cost": 12000, "duration_minutes": 300,
         "image_url": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80"},
        {"name": "Overwater Bungalow Sunset", "description": "Enjoy a private sunset dinner on your overwater deck above the lagoon.", "type": "cultural", "cost": 8000, "duration_minutes": 180,
         "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"},
    ],
    "Kasol": [
        {"name": "Kheerganga Trek", "description": "Trek through pine forests to reach natural hot springs at 2,950m elevation.", "type": "physical", "cost": 1200, "duration_minutes": 600,
         "image_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"},
    ],
    "Spiti Valley": [
        {"name": "Key Monastery Visit", "description": "Explore the 1,000-year-old monastery clinging to a hilltop at 4,166m.", "type": "cultural", "cost": 500, "duration_minutes": 180,
         "image_url": "https://images.unsplash.com/photo-1455156218388-5e61b526818b?auto=format&fit=crop&w=800&q=80"},
    ],
}


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(City).count() > 0:
            print("Database already seeded — skipping cities/activities.")
        else:
            city_map = {}
            for c in CITIES:
                city = City(**c)
                db.add(city)
                db.flush()
                city_map[c["name"]] = city.id

            for city_name, acts in ACTIVITIES.items():
                city_id = city_map.get(city_name)
                if not city_id:
                    continue
                for a in acts:
                    activity = Activity(city_id=city_id, **a)
                    db.add(activity)

            db.commit()
            print(f"✅ Seeded {len(CITIES)} cities and {sum(len(v) for v in ACTIVITIES.values())} activities.")

        # Demo user
        if not db.query(User).filter(User.email == "demo@traveloop.com").first():
            user = User(
                email="demo@traveloop.com",
                password_hash=hash_password("demo1234"),
                first_name="Demo",
                last_name="Traveler",
                city="Mumbai",
                country="India",
                role="traveler",
            )
            db.add(user)

        # Admin user
        if not db.query(User).filter(User.email == "admin@traveloop.com").first():
            admin = User(
                email="admin@traveloop.com",
                password_hash=hash_password("admin1234"),
                first_name="Admin",
                last_name="Traveloop",
                city="Mumbai",
                country="India",
                role="admin",
            )
            db.add(admin)

        db.commit()
        print("✅ Demo accounts ready:")
        print("   Traveler: demo@traveloop.com / demo1234")
        print("   Admin:    admin@traveloop.com / admin1234")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
