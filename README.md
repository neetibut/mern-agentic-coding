# NEONAUTH — MERN Cyberpunk Auth + Profile Dashboard

A full-stack app where a visitor can **register**, **log in**, manage a **profile**
(username, first name, last name, and multiple **addresses**), and **delete their account**.

- **Frontend:** React + Vite + Tailwind CSS v4 (cyberpunk theme), Fetch API, React Router
- **Backend:** Express + Mongoose + MongoDB Atlas
- **Auth:** JWT stored in an **httpOnly cookie**, passwords hashed with **bcrypt**
- **Deploy:** Frontend → **Vercel**, Backend → **Render**

An **npm-workspaces monorepo**:

```
.
├── package.json   workspace root (apps/*, packages/*)
└── apps/
    ├── api/   Express API   (@neonauth/api)
    └── web/   React app     (@neonauth/web)
```

## Documentation

- **README.md** (this file) — how to run, use, and deploy the app.
- **[PRD.md](PRD.md)** — product requirements: what the app does, for whom, and why.
- **[AGENTS.md](AGENTS.md)** — guidance for AI agents working in this codebase.

---

## Local development

Install once at the repo root — npm workspaces installs both apps:

```bash
npm install
```

### 1. API (`apps/api`)

```bash
cp apps/api/.env.example apps/api/.env   # fill in MONGODB_URI and JWT_SECRET
npm run dev:api                          # http://localhost:5000
```

`.env` values:

| Var           | Example                                              | Notes                                  |
| ------------- | ---------------------------------------------------- | -------------------------------------- |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/cyber`  | MongoDB Atlas SRV string               |
| `JWT_SECRET`  | long random string                                   | signs the session JWT                  |
| `CLIENT_URL`  | `http://localhost:5173`                              | exact frontend origin (CORS + cookie)  |
| `PORT`        | `5000`                                               | Render injects its own in production   |
| `NODE_ENV`    | `development`                                         | `production` enables secure cookies    |

### 2. Web (`apps/web`)

```bash
cp apps/web/.env.example apps/web/.env   # VITE_API_URL=http://localhost:5000
npm run dev:web                          # http://localhost:5173
```

The web app talks to the API with `credentials: "include"` so the auth cookie
flows on every request; the API allows that origin via CORS `credentials: true`.

---

## API

Base path `/api`. All responses are JSON. Auth uses an httpOnly `token` cookie.

| Method   | Path                          | Auth | Purpose                                   |
| -------- | ----------------------------- | ---- | ----------------------------------------- |
| `POST`   | `/auth/register`              | —    | Create account, set cookie                |
| `POST`   | `/auth/login`                 | —    | Log in, set cookie                        |
| `POST`   | `/auth/logout`                | —    | Clear cookie                              |
| `GET`    | `/auth/me`                    | ✓    | Current user                              |
| `PUT`    | `/users/me`                   | ✓    | Update username / first / last name       |
| `POST`   | `/users/me/addresses`         | ✓    | Add an address                            |
| `PUT`    | `/users/me/addresses/:id`     | ✓    | Update an address                         |
| `DELETE` | `/users/me/addresses/:id`     | ✓    | Remove an address                         |
| `DELETE` | `/users/me`                   | ✓    | Delete the account, clear cookie          |
| `GET`    | `/health`                     | —    | Health check                              |

---

## Deployment

### MongoDB Atlas
1. Create a free cluster and a database user.
2. Network Access → allow `0.0.0.0/0` (or Render's egress IPs).
3. Copy the SRV connection string into the API `MONGODB_URI`.

> Both hosts support a monorepo subdirectory as the project root — point each at its
> `apps/*` folder below. The build runs inside that folder against the package's own
> `package.json`.

### API → Render (Web Service)
- **Root directory:** `apps/api`
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables:** `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (the Vercel URL),
  `NODE_ENV=production`. Render provides `PORT` automatically.

### Web → Vercel
- **Root directory:** `apps/web`
- **Framework preset:** Vite (build `npm run build`, output `dist`)
- **Environment variable:** `VITE_API_URL` = the Render API URL
- `vercel.json` adds the SPA rewrite so refreshing `/dashboard` works.

After both are live, set the API `CLIENT_URL` to the exact Vercel origin and redeploy.

### ⚠️ Cross-site cookie note
The frontend (`*.vercel.app`) and backend (`*.onrender.com`) are different domains, so the
auth cookie is **third-party**. In production it is sent as `SameSite=None; Secure` and the
API runs CORS with `credentials: true`. This works in most browsers, but aggressive
third-party-cookie blocking (Safari ITP, some Chrome configs) can drop it and end the session.

**Robust fix:** put both apps under one custom domain using subdomains — e.g.
`app.example.com` (Vercel) and `api.example.com` (Render). The cookie then becomes
**same-site**, and you can scope it to `.example.com`. Update `CLIENT_URL` / `VITE_API_URL`
accordingly. No code changes are required beyond those env vars.
