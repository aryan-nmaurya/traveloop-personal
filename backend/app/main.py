from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from starlette.middleware.base import BaseHTTPMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.core.limiter import limiter
from app.routers import auth, users, dashboard, trips, sections, cities, activities, checklist, notes, invoice, community, admin, ai

app = FastAPI(title="Traveloop API", version="1.0.0")

# ── Rate limiting ─────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Security headers ──────────────────────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(trips.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(sections.router, prefix="/api/v1")
app.include_router(cities.router, prefix="/api/v1")
app.include_router(activities.router, prefix="/api/v1")
app.include_router(checklist.router, prefix="/api/v1")
app.include_router(notes.router, prefix="/api/v1")
app.include_router(invoice.router, prefix="/api/v1")
app.include_router(community.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
