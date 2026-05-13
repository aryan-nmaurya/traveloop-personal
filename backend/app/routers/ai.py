import json
import os
import random
import re
from typing import List

import httpx
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from app.core.limiter import limiter
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/ai", tags=["ai"])

NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
MODEL = "meta/llama-3.1-8b-instruct"

CHAT_SYSTEM_PROMPT = (
    "You are Traveloop AI, a world-class travel planning assistant with deep expertise in "
    "global destinations, budget planning, cultural experiences, and adventure travel. "
    "Your responses are enthusiastic, specific, and deeply practical. "
    "Always give exact numbers, hotel names, activity prices, and local tips. "
    "Format with short paragraphs or bullet points — never long walls of text. "
    "Use emojis sparingly and naturally. "
    "When listing destinations or activities, use bullet points (•)."
)

MOCK_CHAT_RESPONSES = [
    "Great question! **Goa in 7 days** on ₹45,000:\n\n• **Day 1-3:** North Goa — Baga Beach, Fort Aguada sunset, Anjuna flea market\n• **Day 4-5:** South Goa — Palolem beach, Dudhsagar waterfall trek\n• **Day 6-7:** Old Goa churches, spice plantation tour, final beach dinner\n\nStay at **Zostel Goa** (₹700/night hostel) or **Alila Diwa** (₹6,000/night luxury). Best time: October–March 🌊",
    "For a **romantic trip**, I'd recommend:\n\n• **Udaipur** — Lake Palace dinners, City Palace at sunset (₹35,000 for 5 days)\n• **Maldives** — Overwater bungalow, snorkelling with manta rays (₹1,20,000 for 5 days)\n• **Andaman Islands** — Radhanagar beach, scuba diving (₹55,000 for 7 days)\n\nWhich vibe suits you — heritage palaces, tropical beaches, or island escapes? 💑",
    "**Solo travel starter kit for India:**\n\n• **Rishikesh** — Yoga, river rafting, bungee jumping — budget ₹15,000 for 5 days\n• **McLeod Ganj** — Dharamshala hills, Tibetan culture, café hopping — ₹12,000 for 5 days\n• **Varanasi** — Ghats at dawn, boat rides, spiritual depth — ₹10,000 for 4 days\n\nAll three are incredibly safe for solo travelers and have amazing hostel communities 🎒",
]

class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]


class MovieItineraryRequest(BaseModel):
    movie_title: str
    vibe: str
    destinations: List[str]
    duration: str
    budget: str


async def _call_nvidia(messages: list, max_tokens: int = 600, temperature: float = 0.75) -> str | None:
    api_key = os.getenv("NVIDIA_API_KEY", "")
    if not api_key:
        return None
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{NVIDIA_BASE_URL}/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={"model": MODEL, "messages": messages, "max_tokens": max_tokens, "temperature": temperature},
            )
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"NVIDIA API error: {e}")
        return None


def _strip_json_fences(text: str) -> str:
    """Remove markdown code fences and extract raw JSON."""
    text = text.strip()
    # Remove ```json ... ``` or ``` ... ```
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


@router.post("/chat")
@limiter.limit("20/minute")
async def chat(request: Request, body: ChatRequest, current_user: User = Depends(get_current_user)):
    messages = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]
    for m in body.messages:
        if m.role in ("user", "assistant"):
            messages.append({"role": m.role, "content": m.content})

    reply = await _call_nvidia(messages, max_tokens=700)

    if reply:
        return {"reply": reply}

    return {"reply": random.choice(MOCK_CHAT_RESPONSES)}


@router.post("/generate_movie_itinerary")
@limiter.limit("10/minute")
async def generate_movie_itinerary(request: Request, body: MovieItineraryRequest, current_user: User = Depends(get_current_user)):
    destinations_str = ", ".join(body.destinations)

    system_prompt = (
        "You are an elite cinematic travel curator who designs immersive, movie-inspired journeys. "
        "Your itineraries perfectly capture the emotional essence, visual aesthetic, and adventurous spirit of each film. "
        "You include hidden gems, cinematic photo spots, specific hotel names, authentic local experiences, and precise budget breakdowns in INR. "
        "CRITICAL: Your entire response must be ONLY a valid JSON object — no markdown, no explanation, no text before or after the JSON. "
        "The JSON must exactly match this structure:\n"
        '{"itinerary": [{"day": "1-3", "location": "City Name Only", '
        '"activities": ["Specific named activity 1", "Specific named activity 2", "Specific named activity 3", "Hidden gem or cinematic photo spot"], '
        '"stay": "Specific hotel or unique accommodation name with city", "budget": "₹XX,XXX"}]}'
        "\n\nRules: location must be the CITY NAME only (not 'City, Country'). "
        "Each activity must be specific and named — never say 'explore the city' or 'visit local attractions'. "
        "Budget must be in Indian Rupees (₹) with realistic INR amounts."
    )

    user_prompt = (
        f"Create a cinematic {body.duration} travel itinerary inspired by the movie '{body.movie_title}'.\n"
        f"Film vibe & mood: {body.vibe}\n"
        f"Key destinations (use exact city names): {destinations_str}\n"
        f"Total budget (INR): {body.budget}\n\n"
        f"Requirements:\n"
        f"- Capture the EXACT emotional tone and visual atmosphere of the movie\n"
        f"- Include exactly 4 activities per segment — all must be specific named experiences (not generic)\n"
        f"- Name specific hotels, guesthouses, or unique stays that match the film's vibe\n"
        f"- Include one hidden gem or cinematic photo spot per segment\n"
        f"- Split {body.duration} into exactly {max(3, len(body.destinations))} segments, one per destination\n"
        f"- Each segment budget must be in ₹ INR; all budgets must sum to approximately {body.budget}\n"
        f"- location field = city name only (e.g. 'Manali', not 'Manali, India')\n"
        f"- Make every activity feel like a scene from the movie\n"
        f"Return ONLY the JSON object, nothing else."
    )

    reply = await _call_nvidia(
        [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
        max_tokens=2000,
        temperature=0.8,
    )

    if reply:
        cleaned = _strip_json_fences(reply)
        # Try to find JSON object even if model added extra text
        match = re.search(r'\{.*"itinerary".*\}', cleaned, re.DOTALL)
        if match:
            cleaned = match.group(0)
        try:
            parsed = json.loads(cleaned)
            if "itinerary" in parsed and isinstance(parsed["itinerary"], list):
                return parsed
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}\nRaw: {cleaned[:500]}")

    # Rich static fallback based on movie
    movie_fallbacks = {
        "Yeh Jawaani Hai Deewani": [
            {"day": "1-3", "location": "Manali, Himachal Pradesh", "activities": ["Rohtang Pass trek at golden sunrise", "Solang Valley paragliding and snow activities", "River rafting on the Beas with locals", "Bonfire night at Old Manali cafes"], "stay": "The Himalayan, Manali", "budget": "₹12,000"},
            {"day": "4-5", "location": "Kasol & Kheerganga", "activities": ["Trek to Kheerganga natural hot springs (12km)", "Night camping under 3,000m stars", "Riverside cafe culture in Kasol", "Hidden waterfalls on the Parvati trail"], "stay": "Alpine Camp, Kasol", "budget": "₹6,000"},
            {"day": "6-8", "location": "Udaipur, Rajasthan", "activities": ["Boat ride on shimmering Lake Pichola", "City Palace at sunset — the golden hour view", "Rooftop Rajasthani dinner overlooking the lake", "Jagdish Temple and old city bazaars"], "stay": "Taj Lake Palace (iconic floating hotel)", "budget": "₹20,000"},
            {"day": "9-10", "location": "Jaisalmer Desert", "activities": ["Camel safari into the Thar Desert dunes", "Overnight desert camp with folk music & stars", "Sam Sand Dunes at golden hour photography", "Patwon Ki Haveli intricate carvings tour"], "stay": "Suryagarh Jaisalmer", "budget": "₹14,000"},
        ],
        "Zindagi Na Milegi Dobara": [
            {"day": "1-3", "location": "Barcelona, Spain", "activities": ["La Sagrada Família at dawn before crowds arrive", "Park Güell mosaic terraces with city panorama", "Gothic Quarter evening tapas bar crawl", "Barceloneta beach sunset — the famous ZNMD scene"], "stay": "Hotel Arts Barcelona (beachfront)", "budget": "₹45,000"},
            {"day": "4-5", "location": "Pamplona, Navarra", "activities": ["Running of the Bulls route walk (or watch safely from balcony)", "San Fermín old town fiesta culture exploration", "Txakoli white wine tasting in Basque country", "Scenic mountain drive through Pyrenees foothills"], "stay": "Hotel La Perla Pamplona", "budget": "₹28,000"},
            {"day": "6-9", "location": "Seville, Andalusia", "activities": ["Real Alcázar palace garden photography session", "Authentic Flamenco show at Tablao El Arenal", "La Triana market tapas route at midnight", "Metropol Parasol (Las Setas) at golden sunset"], "stay": "Hotel Alfonso XIII (historic luxury)", "budget": "₹55,000"},
            {"day": "10-12", "location": "Costa del Sol", "activities": ["Tandem skydiving over the Mediterranean coastline", "Marbella old town white-washed alleys", "Boat trip to hidden coves near Benalmádena", "Final cinematic sunset dinner on the beach"], "stay": "Marbella Club Hotel", "budget": "₹50,000"},
        ],
    }

    # Try to match movie title to fallback
    for key, itinerary in movie_fallbacks.items():
        if key.lower() in body.movie_title.lower() or body.movie_title.lower() in key.lower():
            return {"itinerary": itinerary}

    # Generic rich fallback
    generic = []
    segment_budget = 25000
    for i, dest in enumerate(body.destinations[:4]):
        days_start = i * 3 + 1
        days_end = days_start + 2
        generic.append({
            "day": f"{days_start}-{days_end}",
            "location": dest,
            "activities": [
                f"Explore the iconic landmarks of {dest} at golden hour",
                f"Discover local street food markets and hidden cafes",
                f"Cinematic photography at the most photogenic viewpoint",
                f"Immerse in local culture with a guided heritage experience",
            ],
            "stay": f"Boutique Hotel in {dest} — film-inspired aesthetic",
            "budget": f"₹{segment_budget:,}",
        })
    return {"itinerary": generic}
