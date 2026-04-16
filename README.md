# Feature Voting System

## Project Overview
Feature Voting System is a small full stack app for collecting feature requests and ranking them by votes. It includes a Django REST API, a React frontend built with Vite and TypeScript, lightweight frontend tests, and Docker support for quick local startup.

## Tech Stack
- Backend: Django, Django REST Framework, django-cors-headers, SQLite
- Frontend: React, TypeScript, Vite
- Testing: Vitest, React Testing Library
- Containerization: Docker, Docker Compose

## Features Implemented
- Submit a feature with a title and description
- List features sorted by vote count descending
- Upvote a feature
- Frontend API layer using `VITE_API_URL`
- Dockerized backend and frontend
- Focused frontend tests for API calls, rendering, and voting interactions

## Project Structure
```text
backend/
  feature_voting/
  features/
frontend/
  src/components/
  src/pages/
  src/services/
  src/tests/
docker-compose.yml
```

## How To Run With Docker
### Prerequisites
- Docker Desktop

### Steps
1. From the project root, build and start the services:
   ```bash
   docker compose up --build
   ```
2. Seed the demo users for authentication:
   ```bash
   docker compose exec backend python manage.py seed_users
   ```
3. Open the app at `http://localhost:3000`.
4. The backend API is available at `http://localhost:8000`.

### Notes
- In Docker, the frontend uses `VITE_API_URL=/api`.
- Vite proxies `/api` requests to the backend service name `http://backend:8000`.
- This keeps browser requests working while still using Docker service-to-service networking internally.

## How To Run Locally Without Docker
Local setup is optional. Python `3.11+` is recommended for the backend.

### Backend
1. Create and activate a virtual environment.
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Apply migrations:
   ```bash
   cd backend
   python manage.py migrate
   ```
4. Start the API:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create `frontend/.env` from `frontend/.env.example`.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Environment Variables
### Frontend
Create `frontend/.env` from `frontend/.env.example`.

File: `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
```

All frontend API calls go through this variable.

## API Endpoints
### `GET /api/features`
Returns all features sorted by votes descending.

### `POST /api/features`
Creates a feature.

Example request body:
```json
{
  "title": "Dark mode",
  "description": "Improve readability in low light."
}
```

### `POST /api/features/{id}/upvote`
Increments the vote count for a feature by 1.

## Testing Instructions
Run frontend tests:

```bash
cd frontend
npm test
```

Build the frontend:

```bash
cd frontend
npm run build
```

## Key Technical Decisions
- SQLite keeps the backend setup fast and simple.
- Django REST Framework generic views keep the API small and readable.
- The upvote endpoint uses a Django `F()` expression to avoid race-prone read/modify/write logic.
- The frontend uses a small `services/api.ts` layer so components stay focused on rendering and state updates.
- Vite proxying is used in Docker so the browser can call the backend correctly while containers still communicate with service names.
- `fetch` is used instead of Axios to avoid unnecessary dependencies.

## Trade-Offs
- SQLite is fine for a demo, but not ideal for heavier multi-user production traffic.
- The frontend uses simple hook-based state management instead of a more advanced caching/data library.
- Styling is intentionally lightweight and focused on speed over design polish.

## Future Improvements
- Add pagination or infinite scroll when the list grows.
- Add authentication and per-user voting rules.
- Add backend validation rules such as duplicate title detection.

## Verification Completed
- Frontend tests passed with `npm test`
- Frontend production build passed with `npm run build`
- Docker services started successfully with `docker compose up --build -d`
- Backend API smoke test passed for list, create, and upvote
- Frontend HTTP smoke test passed on port `3000`
