# Recommended Markdown Files for Agentic Engineering in a MERN Monorepo

> Goal: a **lean, always-loaded context layer** + **on-demand "why" knowledge** — not one giant
> context file. Every token in an always-loaded file is paid on *every* turn, and bloat causes
> context rot.

> This repo (**NEONAUTH**) implements the layout below: an npm-workspaces monorepo with
> `apps/web` + `apps/api`, a lean root `AGENTS.md`, and durable docs under `docs/`.

---

## Recommended layout

```
/package.json              ← workspace root: workspaces ["apps/*", "packages/*"]
/AGENTS.md                 ← root: stack, workspace map, global commands & conventions
/README.md                 ← human onboarding (not for agents)
/PRD.md                    ← product requirements (what/why)
/CONTRIBUTING.md           ← (optional) commit / PR / branch conventions
/docs/
   architecture.md         ← data flow, auth, deployment topology
   adr/0001-use-mongoose.md   ← architecture decision records (one per decision)
/apps/
   web/  AGENTS.md         ← React conventions (components, state, data-fetching)
   api/  AGENTS.md         ← Express/Mongoose conventions (routes, models, error shape)
/packages/
   shared/  AGENTS.md      ← (when needed) shared types / zod schemas
```

A per-package `AGENTS.md` is optional until a package's conventions diverge enough to be worth
their own file; until then the root `AGENTS.md` covers both. `CONTRIBUTING.md` and `packages/*`
are recommended-when-needed, not required to start.

---

## What each file is for

| File | Role | Keep it… |
|---|---|---|
| **Root `AGENTS.md`** | The "project README for agents" — always loaded | **Tight.** Stack + versions, workspace map, package manager + the canonical `install / dev / build` commands, global conventions, and what *not* to touch (generated files, `.env`) |
| **Per-package `AGENTS.md`** | Scoped context — agents read the *nearest* one | Only what's specific to that package: `api/` documents the route→controller→model pattern, the Mongoose schema style, and the JSON error envelope; `web/` documents component structure, state, and how to call the API |
| **`PRD.md`** | Product requirements — what/why, for whom | Authored by the human first; the agent helps sharpen and expand it |
| **`docs/architecture.md` + `docs/adr/*`** | Durable "why" knowledge | Referenced when needed, not loaded every turn |

---

## The two principles driving this

1. **Always-loaded must stay lean.** Every token in `AGENTS.md` is paid on *every* turn, and bloat
   causes context rot. Put stack + commands + conventions there; push everything else out.
2. **Nest context in a monorepo.** A root `AGENTS.md` plus a small one per workspace means an agent
   editing `apps/api` gets backend conventions without dragging in the React rules, and vice versa.
   This is the single biggest win for monorepos specifically.

---

## How this connects to "prepare context before coding"

The teaching deck (`/sample-session-script.html`) says the most important early work lives in
**docs you author** — business problems, then the PRD, then architecture. This file is the other
half of that story:

- **Humans author the heavy context** — `PRD.md`, `docs/architecture.md`, and any business-problem
  notes. These are deep, occasionally read, and *not* loaded on every turn.
- **`AGENTS.md` is the lean, always-loaded pointer** — it states the stack, commands, and
  conventions, and points at the heavy docs when they're needed.

So "context is the material" (the deck) and "keep always-loaded context lean" (this file) are not
in tension: the rich context lives in `docs/` and `PRD.md`; `AGENTS.md` is the thin, ever-present
index that routes the agent to it.

---

## Quick checklist

- [x] Root `package.json` with `workspaces` (this repo: `apps/*`, `packages/*`)
- [x] Root `AGENTS.md` — lean: stack, workspace map, commands, global conventions
- [x] `docs/architecture.md` (+ an `adr/` folder for decisions when they arise)
- [x] `README.md` + `PRD.md` for humans
- [ ] Per-package `AGENTS.md` in `apps/*` once conventions diverge enough to warrant it
- [ ] `CONTRIBUTING.md` when contributor conventions need to be written down
