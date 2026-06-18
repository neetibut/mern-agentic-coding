# AGENTS.md

Guidance for AI agents working in this repo. Companion docs: [`PRD.md`](PRD.md) (what/why — product requirements) and [`README.md`](README.md) (how to run/use/deploy).

## What this is

NEONAUTH — a MERN full-stack auth + profile app. Two independent packages:

- `backend/` — Express + Mongoose API. JWT in an httpOnly cookie, bcrypt password hashing.
- `frontend/` — React + Vite + Tailwind v4 SPA. React Router, Fetch API.

There is no root `package.json`; each package is installed and run on its own.

## Commands

Backend (`cd backend`):

- `npm install`
- `npm run dev` — nodemon, http://localhost:5000
- `npm start` — production (`node server.js`)

Frontend (`cd frontend`):

- `npm install`
- `npm run dev` — Vite, http://localhost:5173
- `npm run build` — outputs to `dist/`
- `npm run preview` — serve the build

There is currently **no test suite and no linter configured**. Don't claim tests pass; verify changes by running the app.

## Environment

Both packages read env vars and ship a `.env.example`. `backend/.env` is gitignored and contains live secrets — never commit it, never paste its contents into code, logs, or output.

- Backend: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`, `NODE_ENV`
- Frontend: `VITE_API_URL`

## Architecture & conventions

- **ES modules** everywhere (`"type": "module"`). Use `import`/`export`, and include the `.js` extension in backend relative imports.
- Backend layering: `server.js` → `routes/` → `controllers/` → `models/`, with `middleware/` (`auth.js`, `errorHandler.js`) and `utils/` (`cookie.js`). Keep this separation; controllers hold logic, routes only wire paths.
- All API routes live under `/api` (`/api/auth`, `/api/users`, `/api/health`). Responses are JSON; errors flow through `errorHandler` and return `{ message }`.
- Frontend talks to the API only through `src/api/client.js` (`api.get/post/put/del`). Every request uses `credentials: "include"` so the auth cookie flows — don't bypass this wrapper with raw `fetch`.
- Auth is **cookie-based, not header tokens**: the JWT lives in an httpOnly `token` cookie set/cleared server-side. There is no `Authorization` header to send from the client.
- Frontend auth state lives in `src/context/AuthContext.jsx`; gate routes with `ProtectedRoute`. UI uses the `Neon*` components and the cyberpunk Tailwind theme — match existing styling.

## Gotchas

- **CORS + credentials**: the backend sets an explicit `origin` (`CLIENT_URL`) with `credentials: true` — a wildcard origin breaks cookies. Keep it explicit.
- **Cross-site cookies in prod**: frontend (Vercel) and backend (Render) are different domains, so the cookie is third-party (`SameSite=None; Secure`). See the README's cross-site cookie note before changing cookie/CORS behavior.
- `frontend/dist/` is build output — don't hand-edit it.
