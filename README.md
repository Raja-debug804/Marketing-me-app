# NotifyInsights

NotifyInsights is a multi-tenant SaaS starter that combines back-in-stock notifications with GA4-style insights and template-based WhatsApp messaging.

## Features
- Platform super admin space to manage tenants and tenant users.
- Tenant-scoped authentication with JWT and header-based tenant resolution.
- Notify Me module capturing product interest and processing Shopify inventory webhooks.
- Notification templates and rules with UTM defaults and sending windows.
- GA4-style insights endpoint and frontend dashboard.
- React + Vite frontend with sample pages and an embed snippet example.

## Project layout
- `backend/` FastAPI app with SQLAlchemy models, services, and routes under `app/api/v1`.
- `frontend/` React + TypeScript (Vite) UI with basic navigation and placeholder forms.
- `docker-compose.yml` for Postgres, backend, and frontend containers.
- `env.example` shows environment variables.

## Getting started
1. Copy the example env and adjust secrets:
   ```bash
   cp env.example .env
   ```
2. Launch with Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Backend will be at `http://localhost:8000`, frontend at `http://localhost:5173`.

### Running backend locally
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Running frontend locally
```bash
cd frontend
npm install
npm run dev
```

### Testing
Illustrative tests live under `backend/app/tests` and can be run with:
```bash
cd backend
pytest
```

## Public widget snippet
See `frontend/src/pages/PublicSnippet.tsx` for a ready-to-embed example that posts to `/api/v1/public/notify/subscribe` with tenant slug and product details.
