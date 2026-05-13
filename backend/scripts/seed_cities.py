"""Seed cities and activities tables with sample data."""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.core.database import SessionLocal
from app.models.city import City
from app.models.activity import Activity

CITIES =[
    {"name": "Paris", "country": "France", "region": "Europe", "cost_index": 180.00, "popularity_score": 98, "description": "The City of Light, known for the Eiffel Tower, cuisine, and art.", "image_url": None},
    {"name": "Tokyo", "country": "Japan", "region": "Asia", "cost_index": 160.00, "popularity_score": 97, "description": "A blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.", "image_url": None},
    {"name": "New York City", "country": "USA", "region": "North America", "cost_index": 200.00, "popularity_score": 96, "description": "The city that never sleeps — Times Square, Central Park, and world-class dining.", "image_url": None},
    {"name": "London", "country": "UK", "region": "Europe", "cost_index": 190.00, "popularity_score": 95, "description": "Historic capital with royal palaces, museums, and vibrant culture.", "image_url": None},
    {"name": "Rome", "country": "Italy", "region": "Europe", "cost_index": 130.00, "popularity_score": 94, "description": "The Eternal City with the Colosseum, Vatican, and legendary pasta.", "image_url": None},
    {"name": "Barcelona", "country": "Spain", "region": "Europe", "cost_index": 120.00, "popularity_score": 93, "description": "Gaudí architecture, beaches, and vibrant nightlife.", "image_url": None},
    {"name": "Dubai", "country": "UAE", "region": "Middle East", "cost_index": 170.00, "popularity_score": 92, "description": "Futuristic skyline, luxury shopping, and desert adventures.", "image_url": None},
    {"name": "Bangkok", "country": "Thailand", "region": "Asia", "cost_index": 60.00, "popularity_score": 91, "description": "Ornate temples, vibrant street life, and incredible food.", "image_url": None},
    {"name": "Singapore", "country": "Singapore", "region": "Asia", "cost_index": 155.00, "popularity_score": 90, "description": "Garden city with iconic Marina Bay Sands and diverse cuisine.", "image_url": None},
    {"name": "Amsterdam", "country": "Netherlands", "region": "Europe", "cost_index": 150.00, "popularity_score": 89, "description": "Canals, museums, and cycling culture.", "image_url": None},
    {"name": "Istanbul", "country": "Turkey", "region": "Europe/Asia", "cost_index": 80.00, "popularity_score": 88, "description": "Where East meets West — Hagia Sophia, bazaars, and Bosphorus views.", "image_url": None},
    {"name": "Sydney", "country": "Australia", "region": "Oceania", "cost_index": 170.00, "popularity_score": 87, "description": "Opera House, Bondi Beach, and stunning harbour.", "image_url": None},
    {"name": "Prague", "country": "Czech Republic", "region": "Europe", "cost_index": 85.00, "popularity_score": 86, "description": "Fairy-tale architecture, cobblestone streets, and affordable beer.", "image_url": None},
    {"name": "Bali", "country": "Indonesia", "region": "Asia", "cost_index": 50.00, "popularity_score": 85, "description": "Island of gods with rice terraces, temples, and surf beaches.", "image_url": None},
    {"name": "New Delhi", "country": "India", "region": "Asia", "cost_index": 40.00, "popularity_score": 84, "description": "India's capital with Red Fort, Qutub Minar, and rich history.", "image_url": None},
    {"name": "Cairo", "country": "Egypt", "region": "Africa", "cost_index": 45.00, "popularity_score": 83, "description": "Home to the Pyramids of Giza and the Sphinx.", "image_url": None},
    {"name": "Rio de Janeiro", "country": "Brazil", "region": "South America", "cost_index": 100.00, "popularity_score": 82, "description": "Christ the Redeemer, Copacabana Beach, and samba culture.", "image_url": None},
    {"name": "Cape Town", "country": "South Africa", "region": "Africa", "cost_index": 90.00, "popularity_score": 81, "description": "Table Mountain, wine country, and stunning coastlines.", "image_url": None},
    {"name": "Kyoto", "country": "Japan", "region": "Asia", "cost_index": 140.00, "popularity_score": 80, "description": "Ancient temples, geishas, and traditional tea ceremonies.", "image_url": None},
    {"name": "Vienna", "country": "Austria", "region": "Europe", "cost_index": 145.00, "popularity_score": 79, "description": "Imperial palaces, classical music, and café culture.", "image_url": None},
    {"name": "Lisbon", "country": "Portugal", "region": "Europe", "cost_index": 100.00, "popularity_score": 78, "description": "Hilly streets, Fado music, and pastéis de nata.", "image_url": None},
    {"name": "Mexico City", "country": "Mexico", "region": "North America", "cost_index": 70.00, "popularity_score": 77, "description": "Aztec history, murals, and world-class street food.", "image_url": None},
    {"name": "Buenos Aires", "country": "Argentina", "region": "South America", "cost_index": 65.00, "popularity_score": 76, "description": "Tango, steak, and European-style boulevards.", "image_url": None},
    {"name": "Marrakech", "country": "Morocco", "region": "Africa", "cost_index": 55.00, "popularity_score": 75, "description": "Colourful souks, riads, and the Atlas Mountains.", "image_url": None},
    {"name": "Seoul", "country": "South Korea", "region": "Asia", "cost_index": 120.00, "popularity_score": 74, "description": "K-pop culture, ancient palaces, and cutting-edge technology.", "image_url": None},
    {"name": "Athens", "country": "Greece", "region": "Europe", "cost_index": 95.00, "popularity_score": 73, "description": "Cradle of Western civilisation, the Acropolis, and Mediterranean cuisine.", "image_url": None},
    {"name": "Santorini", "country": "Greece", "region": "Europe", "cost_index": 180.00, "popularity_score": 72, "description": "Whitewashed villages, caldera sunsets, and volcanic beaches.", "image_url": None},
    {"name": "Phuket", "country": "Thailand", "region": "Asia", "cost_index": 65.00, "popularity_score": 71, "description": "Tropical beaches, clear waters, and vibrant nightlife.", "image_url": None},
    {"name": "Havana", "country": "Cuba", "region": "Caribbean", "cost_index": 60.00, "popularity_score": 70, "description": "Vintage cars, cigars, and colourful colonial architecture.", "image_url": None},
    {"name": "Petra", "country": "Jordan", "region": "Middle East", "cost_index": 80.00, "popularity_score": 69, "description": "The Rose City carved into rock — an ancient Nabataean wonder.", "image_url": None},
    {"name": "Machu Picchu", "country": "Peru", "region": "South America", "cost_index": 90.00, "popularity_score": 68, "description": "Inca citadel set high in the Andes Mountains.", "image_url": None},
    {"name": "Zurich", "country": "Switzerland", "region": "Europe", "cost_index": 250.00, "popularity_score": 67, "description": "Finance hub with stunning lake views and proximity to the Alps.", "image_url": None},
    {"name": "Copenhagen", "country": "Denmark", "region": "Europe", "cost_index": 200.00, "popularity_score": 66, "description": "Design capital with Nyhavn harbour and world-leading restaurants.", "image_url": None},
    {"name": "Vancouver", "country": "Canada", "region": "North America", "cost_index": 160.00, "popularity_score": 65, "description": "Mountains meet ocean — hiking, skiing, and Pacific cuisine.", "image_url": None},
    {"name": "Reykjavik", "country": "Iceland", "region": "Europe", "cost_index": 220.00, "popularity_score": 64, "description": "Northern lights, geysers, and geothermal pools.", "image_url": None},
    {"name": "Hanoi", "country": "Vietnam", "region": "Asia", "cost_index": 35.00, "popularity_score": 63, "description": "Old Quarter, street food, and French colonial architecture.", "image_url": None},
    {"name": "Ho Chi Minh City", "country": "Vietnam", "region": "Asia", "cost_index": 40.00, "popularity_score": 62, "description": "Bustling metropolis with war history, street food, and markets.", "image_url": None},
    {"name": "Colombo", "country": "Sri Lanka", "region": "Asia", "cost_index": 45.00, "popularity_score": 61, "description": "Tea country, ancient ruins, and pristine beaches.", "image_url": None},
    {"name": "Nairobi", "country": "Kenya", "region": "Africa", "cost_index": 70.00, "popularity_score": 60, "description": "Gateway to East African safaris and wildlife.", "image_url": None},
    {"name": "Lagos", "country": "Nigeria", "region": "Africa", "cost_index": 75.00, "popularity_score": 59, "description": "West Africa's largest city with vibrant music and culture.", "image_url": None},
    {"name": "Osaka", "country": "Japan", "region": "Asia", "cost_index": 130.00, "popularity_score": 58, "description": "Japan's kitchen — street food, friendly locals, and nightlife.", "image_url": None},
    {"name": "Hong Kong", "country": "China", "region": "Asia", "cost_index": 165.00, "popularity_score": 57, "description": "Skyline views, dim sum, and bustling harbour.", "image_url": None},
    {"name": "Miami", "country": "USA", "region": "North America", "cost_index": 175.00, "popularity_score": 56, "description": "Art Deco beaches, nightlife, and Cuban culture.", "image_url": None},
    {"name": "San Francisco", "country": "USA", "region": "North America", "cost_index": 190.00, "popularity_score": 55, "description": "Golden Gate Bridge, tech culture, and sourdough bread.", "image_url": None},
    {"name": "Los Angeles", "country": "USA", "region": "North America", "cost_index": 180.00, "popularity_score": 54, "description": "Hollywood, beaches, and year-round sunshine.", "image_url": None},
    {"name": "Chicago", "country": "USA", "region": "North America", "cost_index": 155.00, "popularity_score": 53, "description": "Deep-dish pizza, jazz, and stunning lakefront architecture.", "image_url": None},
    {"name": "Toronto", "country": "Canada", "region": "North America", "cost_index": 155.00, "popularity_score": 52, "description": "Diverse multicultural city with CN Tower and Niagara Falls nearby.", "image_url": None},
    {"name": "Berlin", "country": "Germany", "region": "Europe", "cost_index": 110.00, "popularity_score": 51, "description": "History, art, techno clubs, and incredible street food.", "image_url": None},
    {"name": "Madrid", "country": "Spain", "region": "Europe", "cost_index": 115.00, "popularity_score": 50, "description": "Prado Museum, tapas, and passionate football culture.", "image_url": None},
    {"name": "Florence", "country": "Italy", "region": "Europe", "cost_index": 135.00, "popularity_score": 49, "description": "Renaissance art, the Duomo, and Tuscany wine country.", "image_url": None},
    {"name": "Maldives", "country": "Maldives", "region": "Asia", "cost_index": 300.00, "popularity_score": 48, "description": "Overwater bungalows, crystal-clear lagoons, and coral reefs.", "image_url": None},
]

ACTIVITIES_BY_CITY = {
    "Paris": [
        {"name": "Eiffel Tower Visit", "type": "cultural", "cost": 2100.00, "duration_minutes": 120, "description": "Visit the iconic iron tower with panoramic city views."},
        {"name": "Louvre Museum", "type": "cultural", "cost": 1400.00, "duration_minutes": 180, "description": "World's largest art museum featuring the Mona Lisa."},
        {"name": "Seine River Cruise", "type": "adventure", "cost": 1250.00, "duration_minutes": 60, "description": "Scenic boat ride along the Seine past Notre-Dame and landmarks."},
        {"name": "French Cooking Class", "type": "food", "cost": 6600.00, "duration_minutes": 180, "description": "Learn to cook croissants and classic French dishes."},
    ],
    "Tokyo": [
        {"name": "Tsukiji Market Tour", "type": "food", "cost": 0.00, "duration_minutes": 120, "description": "Explore the world's famous fish market and taste fresh sushi."},
        {"name": "Mount Fuji Day Trip", "type": "adventure", "cost": 5000.00, "duration_minutes": 480, "description": "Guided day trip to Japan's iconic volcano."},
        {"name": "Shibuya Crossing Walk", "type": "cultural", "cost": 0.00, "duration_minutes": 30, "description": "Experience the world's busiest pedestrian crossing."},
        {"name": "Sumo Wrestling Match", "type": "cultural", "cost": 3300.00, "duration_minutes": 240, "description": "Watch live sumo wrestling at a tournament."},
    ],
    "Rome": [
        {"name": "Colosseum & Forum Tour", "type": "cultural", "cost": 1350.00, "duration_minutes": 150, "description": "Explore the ancient amphitheatre and Roman Forum."},
        {"name": "Vatican Museums & Sistine Chapel", "type": "cultural", "cost": 1650.00, "duration_minutes": 180, "description": "Visit the Pope's museums and Michelangelo's famous ceiling."},
        {"name": "Pasta Making Class", "type": "food", "cost": 5400.00, "duration_minutes": 150, "description": "Learn to make fresh pasta from scratch with a local chef."},
        {"name": "Vespa Tour", "type": "adventure", "cost": 7500.00, "duration_minutes": 180, "description": "Explore Rome on a classic Vespa scooter."},
    ],
    "Bali": [
        {"name": "Tanah Lot Sunset", "type": "cultural", "cost": 420.00, "duration_minutes": 120, "description": "Watch the sunset at the iconic ocean temple."},
        {"name": "Ubud Monkey Forest", "type": "adventure", "cost": 420.00, "duration_minutes": 90, "description": "Wander through sacred forest with playful macaques."},
        {"name": "Surfing Lesson", "type": "physical", "cost": 2500.00, "duration_minutes": 120, "description": "Beginner surfing lesson on Kuta Beach."},
        {"name": "Balinese Cooking Class", "type": "food", "cost": 2900.00, "duration_minutes": 180, "description": "Learn to cook nasi goreng and satay."},
    ],
    "Bangkok": [
        {"name": "Grand Palace Tour", "type": "cultural", "cost": 1250.00, "duration_minutes": 120, "description": "Visit the ornate royal palace and Wat Phra Kaew."},
        {"name": "Street Food Tour", "type": "food", "cost": 2100.00, "duration_minutes": 180, "description": "Guided walking tour of Bangkok's best street food."},
        {"name": "Muay Thai Class", "type": "physical", "cost": 1650.00, "duration_minutes": 90, "description": "Try Thailand's national combat sport with a trainer."},
        {"name": "Chao Phraya Boat Ride", "type": "adventure", "cost": 420.00, "duration_minutes": 60, "description": "River taxi through Bangkok's waterways."},
    ],
}


def seed():
    db = SessionLocal()
    try:
        if db.query(City).count() > 0:
            print("Cities already seeded. Skipping.")
            return

        city_map = {}
        for city_data in CITIES:
            city = City(**city_data)
            db.add(city)
            db.flush()
            city_map[city_data["name"]] = city.id

        for city_name, acts in ACTIVITIES_BY_CITY.items():
            city_id = city_map.get(city_name)
            if not city_id:
                continue
            for act in acts:
                activity = Activity(city_id=city_id, **act)
                db.add(activity)

        db.commit()
        print(f"Seeded {len(CITIES)} cities and {sum(len(v) for v in ACTIVITIES_BY_CITY.values())} activities.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
