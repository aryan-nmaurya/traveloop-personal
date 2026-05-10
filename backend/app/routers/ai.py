import os
from typing import List
from fastapi import APIRouter
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/ai", tags=["ai"])

NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
SYSTEM_PROMPT = (
    "You are Traveloop AI, a premium travel planning assistant. "
    "Help users plan amazing trips, discover destinations, suggest itineraries, "
    "estimate budgets, and find activities. "
    "Be concise, enthusiastic, and practical. "
    "Format responses with short paragraphs or bullet points — never long walls of text. "
    "When listing destinations or activities, use bullet points."
)

MOCK_RESPONSES = [
    "Great question! For a budget trip to Bali, aim for ₹60,000–₹80,000 for 7 days including flights. Stay in Seminyak or Ubud for the best experience. I'd recommend visiting Tegallalang Rice Terraces, Tanah Lot temple at sunset, and doing a cooking class in Ubud.",
    "For a romantic getaway, consider Udaipur (City of Lakes) or the Maldives. Udaipur offers the iconic Lake Palace and stunning lakeside dinners. The Maldives gives you overwater bungalows and crystal-clear lagoons. Which vibe suits you better — heritage or tropical?",
    "A great solo trip in India: start with McLeod Ganj for mountain vibes and Buddhism culture, then head to Rishikesh for yoga and river rafting, and finish in Varanasi for a profound spiritual experience. Budget: ₹25,000–₹40,000 for 10 days.",
]

_mock_index = 0


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]


@router.post("/chat")
async def chat(request: ChatRequest):
    global _mock_index

    api_key = os.getenv("NVIDIA_API_KEY", "")

    if not api_key:
        _mock_index = (_mock_index + 1) % len(MOCK_RESPONSES)
        return {"reply": MOCK_RESPONSES[_mock_index]}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{NVIDIA_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "meta/llama-3.1-8b-instruct",
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        *[m.model_dump() for m in request.messages],
                    ],
                    "max_tokens": 512,
                    "temperature": 0.7,
                },
            )
            data = response.json()
            reply = data["choices"][0]["message"]["content"]
            return {"reply": reply}
    except Exception:
        _mock_index = (_mock_index + 1) % len(MOCK_RESPONSES)
        return {"reply": MOCK_RESPONSES[_mock_index]}
