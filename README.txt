# Traveloop

A full-stack travel planning platform. Plan itineraries, track budgets, manage checklists, and share trips with a community — all in one polished workspace.

---

## Features

### Trip Management
- Create and organize trips with destination, dates, budget target, traveler count, and a cover photo
- Inline edit any trip field directly from the trips list
- Delete trips with optimistic UI updates
- Filter trips by status (Ongoing, Upcoming, Completed, Draft) and sort by date, budget, status, or name
- Live preview while creating — see your trip card update in real time

### Itinerary Builder
- Add ordered trip sections: Stay, Transfer, Experience, or Wellness
- Each section carries a city, description, date range, and budget
- Running budget total shown live as sections are added
- Navigate straight to itinerary preview or activity search from the builder

### Itinerary View
- Full read-only itinerary with all sections rendered in order
- Trip summary badges (date range, status, budget used)

### Budget & Invoice
- Auto-generated invoice from trip sections (line items, subtotal, tax, discount, grand total)
- Visual spend donut chart showing budget used vs. remaining
- Download invoice as PDF or export as PDF (powered by ReportLab)
- Mark invoice as paid

### Checklist
- Per-trip checklist with add, toggle, and delete
- Optimistic toggle updates — UI responds instantly, reverts on API error
- Reset all items to unchecked in one action

### Notes
- Free-form notes per trip

### Community Gallery
- Browse public trips shared by all users
- Search and sort by popularity or recency
- Copy any community trip into your own workspace with one click

### City & Activity Search
- Search cities by name or region with a live-filtered dropdown
- Browse activities filtered by city, type, and cost cap
- Save cities to your destinations list

### User Profile
- View and update profile details

### Admin Dashboard
- User list and count
- Analytics: popular cities, popular activities, monthly user growth trends
- Protected — only accessible to users with the `admin` role

### Auth
- Email / password sign-up and login
- JWT access tokens (15 min) with silent refresh via 7-day refresh tokens
- Forgot password flow — sends a reset link via email
- Reset password page — validates token, enforces password match

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Vite, Tailwind CSS, Axios |
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic |
| Database | PostgreSQL |
| Auth | JWT (python-jose), bcrypt |
| PDF | ReportLab |

---

## Quickstart

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL running locally (or a connection string to a hosted instance)

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/traveloop.git
cd traveloop
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, SECRET_KEY, and optionally SMTP settings
```

**.env minimum required values:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/traveloop
SECRET_KEY=your-secret-key-at-least-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

```bash
# Run database migrations
alembic upgrade head

# Start the backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API is now live at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

---

### 3. Frontend setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_BASE_URL if your backend is not on localhost:8000
```

**.env minimum required values:**

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

```bash
# Start the dev server
npm run dev
```

App is now live at `http://localhost:5173`.

---

### 4. Create the first admin user

After signing up through the UI, promote your account to admin directly in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

Then log out and back in — the Admin Dashboard will appear in the nav.

---

## Project Structure

```
traveloop/
├── backend/
│   ├── app/
│   │   ├── core/          # Config, security utilities
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── routers/       # One file per feature (trips, auth, invoice, …)
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   └── main.py        # FastAPI app entry point
│   ├── alembic/           # Database migration scripts
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/           # Axios instance with token refresh interceptor
        ├── components/    # Shared layout and UI primitives
        ├── context/       # AuthContext (login, logout, refresh)
        ├── data/          # Mock/seed data for offline fallback
        ├── pages/         # One folder per feature
        └── utils/         # Formatters (currency, dates)
```

---

## API Overview

All endpoints live under `/api/v1`. Key groups:

| Prefix | Description |
|---|---|
| `/auth` | Login, signup, refresh, forgot/reset password |
| `/trips` | CRUD, sections, checklist, notes, invoice, PDF |
| `/cities` | City search and saved destinations |
| `/activities` | Activity search |
| `/community` | Public trip gallery, copy trip |
| `/users` | Profile, saved destinations |
| `/admin` | User list, analytics |

Full interactive API docs: `http://localhost:8000/docs`

---

## License

MIT
