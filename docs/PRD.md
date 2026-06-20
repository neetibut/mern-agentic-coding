# PRD — NEONAUTH

**Status:** Reflects the app as currently built (reverse-engineered from the codebase).
**Related docs:** [`README.md`](../README.md) (run/use/deploy), [`AGENTS.md`](../AGENTS.md) (working in the code).

> Note: this PRD was written after the initial build to capture scope and intent. "Future work"
> items are not implemented — treat anything outside "Functional requirements" as not present.

## 1. Overview

NEONAUTH is a full-stack MERN application that lets a visitor create an account, sign in, manage
their profile (name, username, and multiple postal addresses), and delete their account. It is a
self-contained authentication + profile-management reference app with a cyberpunk-themed UI.

- **Frontend:** React + Vite + Tailwind CSS v4, React Router, Fetch API.
- **Backend:** Express + Mongoose on MongoDB Atlas.
- **Auth:** JSON Web Token stored in an httpOnly cookie; passwords hashed with bcrypt.

## 2. Problem statement

Most small apps need the same baseline: secure sign-up/sign-in and a place for a user to manage
their own account data. NEONAUTH provides that baseline end-to-end — a correct, cookie-based auth
flow plus self-service profile and address management — without pulling in a third-party auth
provider.

## 3. Goals & non-goals

### Goals
- Secure, self-hosted email + password authentication.
- Session persistence via an httpOnly JWT cookie (no token handling in client JS).
- Self-service profile management: name, username, and a list of addresses (CRUD).
- Self-service account deletion.
- Work correctly across the production split-domain deployment (Vercel + Render).

### Non-goals (current version)
- OAuth / social login, SSO.
- Email verification, password reset, "forgot password".
- Roles, permissions, or admin views.
- Rate limiting, account lockout, CAPTCHA.
- Multi-device session management / token revocation lists.

## 4. Target users

- **Visitor** — unauthenticated; can view the landing page, register, or log in.
- **Authenticated user** — owns exactly their own account; can read and modify only their own
  profile and addresses, and delete their own account. There is no notion of one user accessing
  another's data.

## 5. User stories

- As a visitor, I can register with a username, email, and password and be signed in immediately.
- As a visitor, I can log in with my email and password.
- As a user, I stay logged in across page refreshes until I log out or the session expires.
- As a user, I can log out.
- As a user, I can view my current profile.
- As a user, I can update my username, first name, and last name.
- As a user, I can add, edit, and remove multiple addresses.
- As a user, I can permanently delete my account.

## 6. Functional requirements

### 6.1 Authentication
- **Register** (`POST /api/auth/register`): requires `username`, `email`, `password`; optional
  `firstName`, `lastName`. On success creates the user, sets the auth cookie, returns the user
  (201). `username` and `email` are unique; `email` is stored lowercased.
- **Login** (`POST /api/auth/login`): requires `email`, `password`. On valid credentials sets the
  auth cookie and returns the user. Invalid credentials return 401 with a generic
  "Invalid email or password" message (no account-existence leak).
- **Logout** (`POST /api/auth/logout`): clears the auth cookie.
- **Current user** (`GET /api/auth/me`, auth required): returns the signed-in user, or 401 if the
  session is missing/invalid.

### 6.2 Profile
- **Update profile** (`PUT /api/users/me`, auth required): updates any provided subset of
  `username`, `firstName`, `lastName`. Fields not sent are left unchanged.

### 6.3 Addresses
Addresses are an embedded list on the user document. Each address has `label`, `street`, `city`,
`state`, `zip`, `country` (all optional strings) and an auto-generated `_id`.
- **Add** (`POST /api/users/me/addresses`, auth required).
- **Update** (`PUT /api/users/me/addresses/:addressId`, auth required): partial update; 404 if the
  address id is not found on the user.
- **Delete** (`DELETE /api/users/me/addresses/:addressId`, auth required).

### 6.4 Account
- **Delete account** (`DELETE /api/users/me`, auth required): permanently deletes the user and
  clears the auth cookie. This is irreversible and removes all embedded addresses with it.

### 6.5 Health
- **Health check** (`GET /api/health`): returns `{ status: "ok" }`, no auth.

## 7. Data model

**User**
- `username` — required, unique, trimmed, min length 3.
- `email` — required, unique, lowercased, must match a basic email pattern.
- `password` — required, min length 6, hashed with bcrypt on save, never returned in responses
  (excluded from queries by default and stripped from JSON).
- `firstName`, `lastName` — optional strings, default `""`.
- `addresses` — array of embedded address subdocuments (default `[]`).
- `createdAt`, `updatedAt` — timestamps.

**Address (embedded)**
- `label`, `street`, `city`, `state`, `zip`, `country` — optional trimmed strings, each with its
  own `_id`.

## 8. Non-functional requirements

### Security
- Passwords are hashed with bcrypt (salt rounds = 10) and never leave the server.
- Auth uses an httpOnly cookie named `token` containing a JWT signed with `JWT_SECRET`,
  expiring in 7 days; the cookie is not readable by client JavaScript.
- Cookie flags adapt to environment: `Secure` + `SameSite=None` in production (cross-domain),
  `SameSite=Lax` + non-secure for local `http` development.
- CORS is locked to the exact `CLIENT_URL` origin with `credentials: true` (no wildcard).
- Login failures return a uniform message to avoid revealing whether an email exists.

### Validation & errors
- Schema-level validation on the User model (required fields, lengths, email format, uniqueness).
- All errors flow through a central error handler and return JSON `{ message }`.

### Deployment / compatibility
- Frontend deploys to Vercel (SPA with rewrite), backend to Render, database on MongoDB Atlas.
- Known constraint: because frontend and backend live on different domains in production, the auth
  cookie is third-party and may be dropped by aggressive third-party-cookie blocking (Safari ITP,
  some Chrome configs). Mitigation is to host both under one parent domain via subdomains so the
  cookie is same-site (see `README.md`). No app code change is needed beyond env vars.

## 9. Out of scope / future work

Candidate enhancements, none currently implemented:
- Password reset and email verification flows.
- OAuth / social login.
- Rate limiting and brute-force protection on auth endpoints.
- Refresh tokens / server-side session revocation.
- Stronger password policy and breach checks.
- Automated tests (unit + integration) and linting/CI.
- Same-domain (subdomain) production setup to make the auth cookie same-site by default.

## 10. Success criteria

- A new visitor can register, land authenticated, refresh the page, and remain logged in.
- A user can update their name/username and add/edit/remove multiple addresses, with changes
  persisting across sessions.
- A user can log out and can delete their account, after which their session and data are gone.
- All authenticated endpoints reject requests without a valid session cookie (401).
- Passwords never appear in any API response or log.
