# Architecture — NEONAUTH

Durable "why" knowledge for the codebase. For *what/why at the product level* see
[`../PRD.md`](../PRD.md); for *how to run/deploy* see [`../README.md`](../README.md); for
*working conventions* see [`../AGENTS.md`](../AGENTS.md).

## Repository shape

An **npm-workspaces monorepo**. A single root `package.json` declares the workspaces and a
single root `package-lock.json`; `npm install` at the root installs and hoists everything.

```
/package.json          workspace root — workspaces: ["apps/*", "packages/*"]
/AGENTS.md             always-loaded agent context (lean: stack, commands, conventions)
/README.md             human onboarding
/PRD.md                product requirements (what/why)
/docs/architecture.md  this file — durable "why"
/apps/
   api/   @neonauth/api   Express + Mongoose API
   web/   @neonauth/web   React + Vite SPA
/packages/             (reserved) shared code — e.g. shared types / zod schemas
```

`packages/` is empty today; it exists so shared code (validation schemas, types) has a home
without another restructure.

## Components

- **`apps/api` (Express + Mongoose).** Layered `server.js → routes/ → controllers/ → models/`,
  with `middleware/` (`auth`, `errorHandler`) and `utils/` (`cookie`). All routes are mounted
  under `/api`. Errors funnel through a single error handler and return `{ message }` JSON.
- **`apps/web` (React + Vite + Tailwind v4).** SPA with React Router. All network calls go
  through `src/api/client.js`; auth state lives in `src/context/AuthContext.jsx`; routes are
  gated by `ProtectedRoute`.

## Auth & data flow

1. The browser submits credentials to `apps/api`.
2. On success the API signs a JWT and sets it in an **httpOnly `token` cookie** — the token is
   never exposed to client JavaScript and there is no `Authorization` header.
3. Every web request uses `credentials: "include"`; the API runs CORS locked to the exact
   `CLIENT_URL` origin with `credentials: true` (no wildcard, or cookies break).
4. Passwords are hashed with bcrypt and excluded from all responses.

User data is a single Mongo `User` document with embedded `addresses` subdocuments (see the PRD
data model).

## Deployment topology

`apps/web` → Vercel (static SPA + rewrite). `apps/api` → Render (Node web service).
MongoDB Atlas for storage. Each host points at its `apps/*` subdirectory as the project root.

**Key constraint:** in production the two apps live on different domains, so the auth cookie is
third-party (`SameSite=None; Secure`) and aggressive third-party-cookie blocking can drop it.
The robust fix is a shared parent domain via subdomains (`app.` / `api.`) so the cookie is
same-site — env-var change only, no code change. See the README's cross-site cookie note.

## Architecture decision records

Significant, hard-to-reverse decisions live in `docs/adr/` (one file per decision), so the
"why" survives even after the code changes. None recorded yet — add `docs/adr/0001-*.md` when
the first such decision comes up (e.g. choosing cookie-based auth over header tokens).
