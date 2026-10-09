# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A minimal full-stack task list app: React (Vite) frontend, Express backend, MySQL database. No ORM — raw SQL via `mysql2`. No test suite, linter, or CI config exists in this repo.

## Architecture

- `frontend/` — React 19 + Vite SPA. All app logic lives in `frontend/src/App.jsx` (single component, no router, no state library — just `useState`/`useEffect` and `fetch`).
- `backend/` — Express 5 API in `backend/index.js`. Three routes: `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id` (toggles `done`). Errors are caught by Express 5's async-rejection forwarding into a single error-handling middleware at the bottom of `index.js`.
- `backend/db.js` — creates the `mysql2` connection pool and exports `ensureSchema()`, which creates the `tasks` table if missing. `ensureSchema()` runs on backend startup (in `index.js`) instead of using migration files.
- `backend/seed.js` — standalone script (`npm run seed`) that truncates `tasks` and inserts 4 fixture rows. Run it directly against a running DB, not through the API.
- No shared code between frontend and backend — they only communicate over HTTP.

### Request flow

- Dev: Vite dev server proxies `/api/*` to `http://localhost:3001` (see `frontend/vite.config.js`), so the backend must be running on port 3001 separately.
- Docker/prod: `frontend/nginx.conf` proxies `/api/` to the `backend` service (`http://backend:3001`) and serves the built SPA for everything else, falling back to `index.html` for client-side routing.

### Services (docker-compose.yml)

Three services: `db` (MySQL 8.4, with a healthcheck that `backend` waits on), `backend` (built from `backend/Dockerfile`, connects via `DB_HOST=db`), `frontend` (built from `frontend/Dockerfile`, serves on host port 8080 via nginx). The backend's own schema bootstrap means no separate migration step is needed when starting the stack.

## Commands

### Backend (`backend/`)
- `npm start` — run the API (defaults to port 3001; reads `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` from env, falling back to local MySQL defaults root/root/testdb).
- `npm run seed` — wipe and reseed the `tasks` table with fixture data.

### Frontend (`frontend/`)
- `npm run dev` — Vite dev server (proxies `/api` to `localhost:3001`; requires the backend running separately).
- `npm run build` — production build to `dist/`.
- `npm run preview` — preview the production build locally.

### Full stack via Docker
- `docker compose up --build` — builds and runs `db` + `backend` + `frontend`; app is served at `http://localhost:8080`.

There are no lint, format, or test commands configured in either `package.json`.
