# NotifyInsights

NotifyInsights is a multi-tenant SaaS starter that combines back-in-stock notifications with GA4-style insights and template-based WhatsApp messaging.

## Features
- Platform super admin space to manage tenants and tenant users.
- Tenant-per-row data model with Postgres and SQLAlchemy.
- Notification templates and rules with UTM defaults and sending windows.
- GA4-style insights endpoint and frontend dashboard.
- React + Vite frontend with polished admin UI and an embed snippet example.

## Project layout
- `backend/` FastAPI app with SQLAlchemy models, services, and routes under `app/api/v1`.
- `frontend/` React + TypeScript (Vite) UI with navigation, tenant selector, settings, and template management.
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
   - Postgres: `postgresql://notify_admin:notify_password@localhost:5432/notify_hub`
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173

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

### Seeding
On startup the API seeds sample data:
- Tenants: Sapphire Retail (active) and Emerald Shops (suspended)
- Users per tenant: admin@<slug>.com (TENANT_ADMIN) and analyst@<slug>.com (ANALYST)
- Notification templates: Back in stock default (default) and Promo follow-up

### AI copilot sanity check
1. Set PHI4 credentials in `.env` (the API expects OpenAI-compatible endpoints):
   ```bash
   PHI4_API_KEY=your_key
   PHI4_API_BASE=https://your-endpoint
   PHI4_MODEL_NAME=phi-4-mini
   ```
2. Run the stack (`docker-compose up --build` or start backend + frontend locally).
3. Open the Platform AI page (sidebar → Platform AI) and ask:
   "How many tenants are there and which ones are active vs suspended?" — the answer reflects seeded tenants.
4. Select a tenant via the selector, open Tenant AI (sidebar → Tenant AI), and ask:
   "Which users belong to this tenant and what roles do they have?" — responses are scoped to the chosen tenant only.

### Testing
Illustrative tests live under `backend/app/tests` and can be run with:
```bash
cd backend
pytest
```

## Public widget snippet
See `frontend/src/pages/PublicSnippet.tsx` for a ready-to-embed example that posts to `/api/v1/public/notify/subscribe` with tenant slug and product details.
