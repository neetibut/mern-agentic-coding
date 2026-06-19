# AGENTS.md

Guidance for AI agents working in this repo. Companion docs: [`PRD.md`](PRD.md) (what/why — product requirements) and [`README.md`](README.md) (how to run/use/deploy).

## What this is

NEONAUTH — a MERN full-stack auth + profile app. An **npm-workspaces monorepo** with two packages:

- `apps/api/` (`@neonauth/api`) — Express + Mongoose API. JWT in an httpOnly cookie, bcrypt password hashing.
- `apps/web/` (`@neonauth/web`) — React + Vite + Tailwind v4 SPA. React Router, Fetch API.

The root `package.json` declares the workspaces (`apps/*`, `packages/*`) and a single root `package-lock.json`. Run `npm install` **once at the root** — it installs both packages and hoists dependencies. New shared packages go under `packages/`.

## Commands

From the repo root (preferred — uses the workspace scripts):

- `npm install` — install everything (both workspaces)
- `npm run dev:api` — nodemon, http://localhost:5000
- `npm run dev:web` — Vite, http://localhost:5173
- `npm run build:web` — build the SPA to `apps/web/dist/`
- `npm run start:api` — production API (`node server.js`)
- `npm run preview:web` — serve the built SPA

Or target a single workspace directly, e.g. `npm run dev --workspace @neonauth/api`. You can still `cd apps/api` / `cd apps/web` and run the package's own scripts.

There is currently **no test suite and no linter configured**. Don't claim tests pass; verify changes by running the app.

## Environment

Each package reads env vars from its own `.env` and ships a `.env.example`. `apps/api/.env` is gitignored and contains live secrets — never commit it, never paste its contents into code, logs, or output.

- API (`apps/api`): `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`, `NODE_ENV`
- Web (`apps/web`): `VITE_API_URL`

## Architecture & conventions

- **ES modules** everywhere (`"type": "module"`). Use `import`/`export`, and include the `.js` extension in `apps/api` relative imports.
- API layering (`apps/api`): `server.js` → `routes/` → `controllers/` → `models/`, with `middleware/` (`auth.js`, `errorHandler.js`) and `utils/` (`cookie.js`). Keep this separation; controllers hold logic, routes only wire paths.
- All API routes live under `/api` (`/api/auth`, `/api/users`, `/api/health`). Responses are JSON; errors flow through `errorHandler` and return `{ message }`.
- The web app talks to the API only through `apps/web/src/api/client.js` (`api.get/post/put/del`). Every request uses `credentials: "include"` so the auth cookie flows — don't bypass this wrapper with raw `fetch`.
- Auth is **cookie-based, not header tokens**: the JWT lives in an httpOnly `token` cookie set/cleared server-side. There is no `Authorization` header to send from the client.
- Web auth state lives in `apps/web/src/context/AuthContext.jsx`; gate routes with `ProtectedRoute`. UI uses the `Neon*` components and the cyberpunk Tailwind theme — match existing styling.

## Gotchas

- **CORS + credentials**: the API sets an explicit `origin` (`CLIENT_URL`) with `credentials: true` — a wildcard origin breaks cookies. Keep it explicit.
- **Cross-site cookies in prod**: the web app (Vercel) and API (Render) are different domains, so the cookie is third-party (`SameSite=None; Secure`). See the README's cross-site cookie note before changing cookie/CORS behavior.
- `apps/web/dist/` is build output — don't hand-edit it.
