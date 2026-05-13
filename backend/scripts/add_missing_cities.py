"""
Add all missing movie-destination cities and key Indian tourist cities to the DB.
Safe to re-run — skips cities that already exist (matched by name, case-insensitive).
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.city import City
from app.models.activity import Activity

# ── New cities to add ─────────────────────────────────────────────────────────
CITIES = [
    # ── India – Himalayan belt ────────────────────────────────────────────────
    {"name": "Manali", "country": "India", "region": "Asia", "cost_index": 35, "popularity_score": 92,
     "description": "Himalayan hill station with snow-capped peaks, river rafting, and the iconic Rohtang Pass.",
     "image_url": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Kasol", "country": "India", "region": "Asia", "cost_index": 20, "popularity_score": 81,
     "description": "Backpacker hamlet in the Parvati Valley — cafes, river walks, and the Kheerganga trek.",
     "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Leh", "country": "India", "region": "Asia", "cost_index": 40, "popularity_score": 88,
     "description": "High-altitude capital of Ladakh — monasteries, Pangong Tso lake, and lunar landscapes.",
     "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Spiti Valley", "country": "India", "region": "Asia", "cost_index": 25, "popularity_score": 79,
     "description": "Cold-desert mountain valley at 4,000 m — Key Monastery, fossils, and pin-drop silence.",
     "image_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Zanskar", "country": "India", "region": "Asia", "cost_index": 22, "popularity_score": 71,
     "description": "Remote Himalayan valley accessible only in summer — Phuktal Monastery and frozen-river treks.",
     "image_url": "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Chitkul", "country": "India", "region": "Asia", "cost_index": 18, "popularity_score": 68,
     "description": "Last inhabited village on the Indo-Tibetan border in Kinnaur — apple orchards and glaciers.",
     "image_url": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Rishikesh", "country": "India", "region": "Asia", "cost_index": 20, "popularity_score": 86,
     "description": "Yoga capital of the world — Ganges ghats, white-water rafting, and bungee jumping.",
     "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Shimla", "country": "India", "region": "Asia", "cost_index": 28, "popularity_score": 83,
     "description": "Colonial hill station and former British summer capital — toy train and Mall Road.",
     "image_url": "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?auto=format&fit=crop&w=1000&q=80"},

    # ── India – Rajasthan ─────────────────────────────────────────────────────
    {"name": "Udaipur", "country": "India", "region": "Asia", "cost_index": 45, "popularity_score": 93,
     "description": "City of Lakes — Lake Pichola, City Palace, rooftop restaurants, and romantic haveli stays.",
     "image_url": "https://images.unsplash.com/photo-1477587458883-47145ed31459?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Jaisalmer", "country": "India", "region": "Asia", "cost_index": 38, "popularity_score": 87,
     "description": "The Golden City in the Thar Desert — camel safaris, Sam Sand Dunes, and a living fort.",
     "image_url": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Jaipur", "country": "India", "region": "Asia", "cost_index": 42, "popularity_score": 90,
     "description": "The Pink City — Amber Fort, Hawa Mahal, gem markets, and Rajasthani cuisine.",
     "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Jodhpur", "country": "India", "region": "Asia", "cost_index": 35, "popularity_score": 82,
     "description": "The Blue City — Mehrangarh Fort, indigo-washed streets, and view of the Thar.",
     "image_url": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80"},

    # ── India – Coastal & Western ─────────────────────────────────────────────
    {"name": "Goa", "country": "India", "region": "Asia", "cost_index": 50, "popularity_score": 95,
     "description": "India's beach paradise — Portuguese churches, Anjuna flea markets, and Baga nightlife.",
     "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Mumbai", "country": "India", "region": "Asia", "cost_index": 65, "popularity_score": 91,
     "description": "Maximum City — Gateway of India, Marine Drive, Bollywood, and world-class street food.",
     "image_url": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Lonavala", "country": "India", "region": "Asia", "cost_index": 30, "popularity_score": 76,
     "description": "Hill station escape from Mumbai — Bhushi Dam, chikki shops, and misty monsoon valleys.",
     "image_url": "https://images.unsplash.com/photo-1615091808362-0b3d91b44bc0?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Mahabaleshwar", "country": "India", "region": "Asia", "cost_index": 32, "popularity_score": 74,
     "description": "Maharashtra's highest hill resort — strawberry farms, Kaas Plateau, and panoramic valley views.",
     "image_url": "https://images.unsplash.com/photo-1580793396044-f0a9c6a20bc8?auto=format&fit=crop&w=1000&q=80"},

    # ── India – South ─────────────────────────────────────────────────────────
    {"name": "Munnar", "country": "India", "region": "Asia", "cost_index": 28, "popularity_score": 85,
     "description": "Kerala's tea country — rolling green estates, misty peaks, and elephant sanctuaries.",
     "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Coorg", "country": "India", "region": "Asia", "cost_index": 35, "popularity_score": 83,
     "description": "Scotland of India — coffee estates, waterfalls, river rafting, and misty forest treks.",
     "image_url": "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Hampi", "country": "India", "region": "Asia", "cost_index": 15, "popularity_score": 80,
     "description": "UNESCO World Heritage Site — dramatic boulder landscape, Vijayanagara ruins, and sunsets.",
     "image_url": "https://images.unsplash.com/photo-1590577976322-3d2d6a2130b5?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Mysuru", "country": "India", "region": "Asia", "cost_index": 25, "popularity_score": 78,
     "description": "City of Palaces — Mysore Palace illuminated at night, Chamundi Hills, and sandalwood.",
     "image_url": "https://images.unsplash.com/photo-1580544196815-3b6a9f78a7c9?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Pondicherry", "country": "India", "region": "Asia", "cost_index": 22, "popularity_score": 77,
     "description": "French colonial town — colourful villas, Auroville, beach promenade, and café culture.",
     "image_url": "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Ooty", "country": "India", "region": "Asia", "cost_index": 24, "popularity_score": 73,
     "description": "Queen of hill stations — Nilgiri toy train, botanical gardens, and tea factory tours.",
     "image_url": "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Alleppey", "country": "India", "region": "Asia", "cost_index": 30, "popularity_score": 82,
     "description": "Venice of the East — Kerala backwater houseboats, coconut lagoons, and coir villages.",
     "image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80"},

    # ── India – Northeast & East ──────────────────────────────────────────────
    {"name": "Darjeeling", "country": "India", "region": "Asia", "cost_index": 25, "popularity_score": 80,
     "description": "Tea gardens at dawn, Kanchenjunga views, and the iconic toy train through misty hills.",
     "image_url": "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Shillong", "country": "India", "region": "Asia", "cost_index": 22, "popularity_score": 75,
     "description": "Scotland of the East — Meghalaya's capital with waterfalls, living root bridges, and music.",
     "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Cherrapunji", "country": "India", "region": "Asia", "cost_index": 18, "popularity_score": 71,
     "description": "One of the wettest places on Earth — Nohkalikai Falls, double-decker root bridges, caves.",
     "image_url": "https://images.unsplash.com/photo-1584548763810-e3aa94461d6c?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Varanasi", "country": "India", "region": "Asia", "cost_index": 18, "popularity_score": 84,
     "description": "One of the world's oldest living cities — Ganges ghats at dawn, boat rides, and Ganga Aarti.",
     "image_url": "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Agra", "country": "India", "region": "Asia", "cost_index": 30, "popularity_score": 88,
     "description": "Home of the Taj Mahal — Mughal architecture, Agra Fort, and the Yamuna at sunrise.",
     "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Amritsar", "country": "India", "region": "Asia", "cost_index": 20, "popularity_score": 86,
     "description": "Home of the Golden Temple — Sikh heritage, Wagah Border ceremony, and Punjabi cuisine.",
     "image_url": "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80"},

    # ── India – Islands ───────────────────────────────────────────────────────
    {"name": "Havelock Island", "country": "India", "region": "Asia", "cost_index": 45, "popularity_score": 89,
     "description": "Radhanagar Beach (Asia's best), snorkelling, mangrove kayaking in the Andaman Islands.",
     "image_url": "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Neil Island", "country": "India", "region": "Asia", "cost_index": 32, "popularity_score": 78,
     "description": "Quiet Andaman island — Natural Bridge, cycling, night squid fishing, and untouched beaches.",
     "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Lakshadweep", "country": "India", "region": "Asia", "cost_index": 80, "popularity_score": 76,
     "description": "36 coral atolls — scuba diving on pristine reefs, lagoon kayaking, and bioluminescent nights.",
     "image_url": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1000&q=80"},

    # ── Spain (ZNMD gaps) ─────────────────────────────────────────────────────
    {"name": "Pamplona", "country": "Spain", "region": "Europe", "cost_index": 105, "popularity_score": 74,
     "description": "San Fermín festival city — Running of the Bulls route, Basque txakoli wine, and the Pyrenees.",
     "image_url": "https://images.unsplash.com/photo-1543716091-a840c05249ec?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Seville", "country": "Spain", "region": "Europe", "cost_index": 100, "popularity_score": 82,
     "description": "Andalusia's heart — Real Alcázar, flamenco shows, tapas culture, and Metropol Parasol.",
     "image_url": "https://images.unsplash.com/photo-1549887534-1541e9326688?auto=format&fit=crop&w=1000&q=80"},
    {"name": "Marbella", "country": "Spain", "region": "Europe", "cost_index": 175, "popularity_score": 79,
     "description": "Costa del Sol glam — golden beaches, old town alleys, luxury marinas, and skydiving.",
     "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80"},

    # ── South America (Interstellar) ──────────────────────────────────────────
    {"name": "Salar de Uyuni", "country": "Bolivia", "region": "South America", "cost_index": 40, "popularity_score": 85,
     "description": "World's largest salt flat — mirror-like sky reflections, cactus islands, and star trails at 3,600m.",
     "image_url": "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1000&q=80"},
    {"name": "San Pedro de Atacama", "country": "Chile", "region": "South America", "cost_index": 70, "popularity_score": 80,
     "description": "Driest desert on Earth — Valle de la Luna, ALMA observatory, El Tatio geysers, and clear skies.",
     "image_url": "https://images.unsplash.com/photo-1531761535209-180857e963b9?auto=format&fit=crop&w=1000&q=80"},

    # ── Iceland (Westfjords gap) ──────────────────────────────────────────────
    {"name": "Westfjords", "country": "Iceland", "region": "Europe", "cost_index": 250, "popularity_score": 72,
     "description": "Iceland's most remote peninsula — Dynjandi waterfall, arctic foxes, and midnight sun hot pots.",
     "image_url": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80"},
]

# ── Activities for key Indian destinations ────────────────────────────────────
ACTIVITIES_BY_CITY = {
    "Manali": [
        {"name": "Rohtang Pass Sunrise Trek", "type": "adventure", "cost": 3500,
         "duration_minutes": 300, "description": "Early-morning jeep + trek to Rohtang Pass with panoramic Himalayan views."},
        {"name": "Solang Valley Snow Day", "type": "adventure", "cost": 2500,
         "duration_minutes": 240, "description": "Skiing, zorbing, and snow activities in a glacial bowl near Manali."},
        {"name": "Beas River Rafting", "type": "adventure", "cost": 1800,
         "duration_minutes": 90, "description": "Grade III-IV rapids on the Beas River — full rafting run with life jackets."},
        {"name": "Old Manali Café Walk", "type": "cultural", "cost": 600,
         "duration_minutes": 120, "description": "Evening stroll through Old Manali's backpacker lane — momos and bonfire."},
    ],
    "Udaipur": [
        {"name": "Lake Pichola Sunset Boat Ride", "type": "relaxation", "cost": 800,
         "duration_minutes": 60, "description": "Private shikara boat around Lake Pichola with City Palace views."},
        {"name": "City Palace at Golden Hour", "type": "cultural", "cost": 500,
         "duration_minutes": 120, "description": "Explore the magnificent palace complex as the sun turns the marble golden."},
        {"name": "Rooftop Rajasthani Dinner", "type": "food", "cost": 1200,
         "duration_minutes": 120, "description": "Thali dinner with live folk music on a rooftop overlooking the lake."},
        {"name": "Bazaar & Havelis Walk", "type": "cultural", "cost": 300,
         "duration_minutes": 150, "description": "Wander Udaipur's spice market, miniature-painting ateliers, and heritage havelis."},
    ],
    "Jaisalmer": [
        {"name": "Sam Sand Dunes Camel Safari", "type": "adventure", "cost": 2500,
         "duration_minutes": 180, "description": "Sunset camel ride into the Thar Desert followed by folk-music desert camp dinner."},
        {"name": "Desert Overnight Camp", "type": "adventure", "cost": 4500,
         "duration_minutes": 720, "description": "Sleep under 10,000 stars — tent camp with bonfire, folk music, and mirror-painted tents."},
        {"name": "Jaisalmer Fort Heritage Walk", "type": "cultural", "cost": 500,
         "duration_minutes": 120, "description": "Living fort exploration — Jain temples, havelis, and rooftop Thar panoramas."},
        {"name": "Patwon Ki Haveli", "type": "cultural", "cost": 300,
         "duration_minutes": 90, "description": "Ornate five-mansion complex with intricate sandstone carvings and royal artefacts."},
    ],
    "Goa": [
        {"name": "Baga & Anjuna Beach Sunset", "type": "relaxation", "cost": 500,
         "duration_minutes": 120, "description": "Feni cocktails and seafood at a Goa beach shack as the sun melts into the sea."},
        {"name": "Anjuna Flea Market", "type": "cultural", "cost": 300,
         "duration_minutes": 180, "description": "Vibrant Wednesday market — silver jewellery, spices, and live djembe."},
        {"name": "Dudhsagar Waterfall Trek", "type": "adventure", "cost": 1500,
         "duration_minutes": 360, "description": "Full-day jeep + trek to India's tallest waterfall through the Western Ghats."},
        {"name": "Baga Water Sports", "type": "adventure", "cost": 2000,
         "duration_minutes": 180, "description": "Jet skiing, parasailing, and banana boat ride at Baga beach."},
        {"name": "Fort Aguada Sunset Walk", "type": "cultural", "cost": 100,
         "duration_minutes": 90, "description": "17th-century Portuguese fort with ocean views and lighthouse."},
    ],
    "Mumbai": [
        {"name": "Gateway of India at Sunrise", "type": "cultural", "cost": 0,
         "duration_minutes": 60, "description": "Watch the sun rise over the historic arch gateway with fishing boats in harbour."},
        {"name": "Marine Drive Night Walk", "type": "relaxation", "cost": 0,
         "duration_minutes": 90, "description": "Walk the Queen's Necklace promenade at night with city lights on the Arabian Sea."},
        {"name": "Dharavi & Colaba Street Food Tour", "type": "food", "cost": 1800,
         "duration_minutes": 240, "description": "Guided food walk through Colaba Causeway, Vada Pav stalls, and Irani cafes."},
        {"name": "Bandra-Worli Sea Link Drive", "type": "cultural", "cost": 150,
         "duration_minutes": 30, "description": "Iconic cable-stayed bridge crossing — best at dusk when the lights come on."},
    ],
    "Leh": [
        {"name": "Pangong Tso Lake Day Trip", "type": "adventure", "cost": 5000,
         "duration_minutes": 600, "description": "Dramatic 5-hour drive to the turquoise lake at 4,350m — colours shift from blue to green."},
        {"name": "Shanti Stupa Sunrise", "type": "cultural", "cost": 200,
         "duration_minutes": 90, "description": "Meditate at the white-domed Buddhist stupa above Leh as the Himalayas turn gold."},
        {"name": "Nubra Valley Camel Safari", "type": "adventure", "cost": 3500,
         "duration_minutes": 480, "description": "Cross the world's highest motorable pass (Khardung La) to double-humped Bactrian camel dunes."},
        {"name": "Leh Palace & Market Walk", "type": "cultural", "cost": 300,
         "duration_minutes": 180, "description": "Explore the nine-storey Namgyal palace, Tibetan Buddhist thangka shops, and apricot stalls."},
    ],
    "Rishikesh": [
        {"name": "Ganges White-Water Rafting", "type": "adventure", "cost": 1500,
         "duration_minutes": 180, "description": "16 km Grade III-IV rapids from Shivpuri to Rishikesh — no experience needed."},
        {"name": "Laxman Jhula Evening Aarti", "type": "cultural", "cost": 0,
         "duration_minutes": 60, "description": "Watch the riverside fire ceremony as priests chant mantras at sunset."},
        {"name": "Bungee Jumping at Mohan Chatti", "type": "adventure", "cost": 3500,
         "duration_minutes": 60, "description": "India's highest bungee jump (83m) over the Ganges gorge."},
        {"name": "Yoga & Meditation Class", "type": "wellness", "cost": 800,
         "duration_minutes": 120, "description": "Morning Iyengar yoga class at an ashram overlooking the sacred river."},
    ],
    "Havelock Island": [
        {"name": "Radhanagar Beach Sunrise", "type": "relaxation", "cost": 0,
         "duration_minutes": 90, "description": "Asia's best beach at first light — pristine sand, turquoise water, no crowds."},
        {"name": "Elephant Beach Snorkelling", "type": "adventure", "cost": 1800,
         "duration_minutes": 180, "description": "Boat + snorkel at one of Andaman's top coral reef spots — turtles and rays."},
        {"name": "Mangrove Kayaking", "type": "adventure", "cost": 1200,
         "duration_minutes": 120, "description": "Paddle through tidal mangrove creeks with guides — bioluminescent plankton at night."},
        {"name": "Glass-Bottom Boat Tour", "type": "relaxation", "cost": 800,
         "duration_minutes": 60, "description": "Peer through the boat floor at coral gardens without getting wet."},
    ],
    "Varanasi": [
        {"name": "Dawn Ganges Boat Ride", "type": "cultural", "cost": 800,
         "duration_minutes": 90, "description": "Row past burning ghats and bathing pilgrims at 5 AM — deeply moving."},
        {"name": "Ganga Aarti Ceremony", "type": "cultural", "cost": 0,
         "duration_minutes": 60, "description": "Attend the nightly fire offering ritual on Dashashwamedh Ghat — best seat at Manikarnika."},
        {"name": "Old City Rickshaw Trail", "type": "cultural", "cost": 500,
         "duration_minutes": 180, "description": "Cycle rickshaw through 3,000-year-old lanes, silk weaving workshops, and hidden temples."},
    ],
    "Jaipur": [
        {"name": "Amber Fort Elephant Ride", "type": "cultural", "cost": 1500,
         "duration_minutes": 180, "description": "Ride up to the golden Amber Fort and explore palaces, mirror halls, and ramparts."},
        {"name": "Hawa Mahal Photo Walk", "type": "cultural", "cost": 200,
         "duration_minutes": 60, "description": "Photograph the five-storey 'Palace of Winds' from the street and climb inside."},
        {"name": "Gem Market & Block Print Workshop", "type": "cultural", "cost": 800,
         "duration_minutes": 150, "description": "Johari Bazaar jewellery shopping followed by hands-on block-print textile class."},
        {"name": "Chokhi Dhani Folk Dinner", "type": "food", "cost": 1200,
         "duration_minutes": 240, "description": "Rajasthani village experience — folk dancers, puppet shows, and unlimited thali."},
    ],
    "Seville": [
        {"name": "Real Alcázar Palace Gardens", "type": "cultural", "cost": 1300,
         "duration_minutes": 120, "description": "Moorish-Renaissance palace with orange groves, tiled fountains, and royal apartments."},
        {"name": "Flamenco Show at Tablao El Arenal", "type": "cultural", "cost": 5000,
         "duration_minutes": 90, "description": "Authentic tablao flamenco — passionate dance, cante jondo, and guitar."},
        {"name": "Triana Tapas Route", "type": "food", "cost": 2500,
         "duration_minutes": 180, "description": "Cross the Guadalquivir to Triana's ceramic tiles, azulejo bars, and midnight tapas."},
        {"name": "Metropol Parasol at Dusk", "type": "cultural", "cost": 500,
         "duration_minutes": 60, "description": "Climb the world's largest wooden structure for rooftop city panoramas at golden hour."},
    ],
}


def run():
    db = SessionLocal()
    added_cities = 0
    added_activities = 0

    try:
        # Build a set of lowercase existing city names
        existing = {c.name.lower() for c in db.query(City).all()}

        # Map city name → id for activity linking
        city_name_to_id = {c.name.lower(): c.id for c in db.query(City).all()}

        # Add new cities
        for city_data in CITIES:
            if city_data["name"].lower() in existing:
                print(f"  skip (exists) — {city_data['name']}")
                continue
            city = City(**city_data)
            db.add(city)
            db.flush()  # get id
            city_name_to_id[city_data["name"].lower()] = city.id
            existing.add(city_data["name"].lower())
            added_cities += 1
            print(f"  + city: {city_data['name']}")

        # Add activities
        for city_name, acts in ACTIVITIES_BY_CITY.items():
            city_id = city_name_to_id.get(city_name.lower())
            if not city_id:
                print(f"  warn: city not found for activities — {city_name}")
                continue
            # Avoid duplicating activities (check by city_id + name)
            existing_acts = {a.name for a in db.query(Activity).filter(Activity.city_id == city_id).all()}
            for act in acts:
                if act["name"] in existing_acts:
                    continue
                activity = Activity(city_id=city_id, **act)
                db.add(activity)
                added_activities += 1
                print(f"    + activity: {act['name']} ({city_name})")

        db.commit()
        print(f"\n✅ Done — {added_cities} cities added, {added_activities} activities added.")

    except Exception as e:
        db.rollback()
        print(f"❌ Failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()
