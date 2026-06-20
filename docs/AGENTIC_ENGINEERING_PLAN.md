# Agentic Engineering Plan — NEONAUTH

How we work **with an AI coding agent** on this repo. The point isn't to ask an AI to write code —
it's to work with one in a disciplined way: clear context, small steps, review checkpoints, and
human ownership of the result.

> **Guiding principle:** the agent helps us move faster; **we stay responsible**. The agent can
> accelerate the work, but the developer still owns the *direction, quality, and correctness* of
> the software.

Related docs: [`AGENTS.md`](../AGENTS.md) (how to work in the code) ·
[`BUSINESS_PROBLEMS.md`](BUSINESS_PROBLEMS.md) · [`PRD.md`](PRD.md) ·
[`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 1. Coding vs. Engineering

- **Agentic AI coding** is the *activity* — using an agent (Claude Code, Cursor, Codex…) to help
  build software.
- **Agentic engineering** is the *discipline* — the process that keeps that work clear, reviewable,
  and maintainable.

The risk we're managing: a single vague prompt ("build me the app") forces the agent to **guess**
the users, the scope, the architecture, the data model, and what "done" means. The result can look
impressive and be fragile underneath. This plan is the map that prevents that.

---

## 2. Context comes before code

We prepare context **before** asking for implementation. The order matters:

1. **Business problems first.** A human writes [`BUSINESS_PROBLEMS.md`](BUSINESS_PROBLEMS.md) — the
   problems, who has them, and why they matter. The developer sets the initial direction; we don't
   hand this to the AI cold.
2. **Refine the thinking with AI.** Use the agent as a *thinking partner* to challenge assumptions,
   find vague problems, and sharpen the statements — before any PRD.
3. **Generate the PRD.** With the problems clear, draft [`PRD.md`](PRD.md): overview, target users,
   goals/non-goals, user stories, MVP scope & success criteria, assumptions & open questions.
4. **Document the architecture.** Then [`ARCHITECTURE.md`](ARCHITECTURE.md): frontend &
   backend structure, data model, API structure, data flow, key decisions, risks & trade-offs.
5. **Agree on how we work with the agent** — this document.

The most valuable early work lives in these docs, not in the code. **The better the context, the
better the agent can help.** The lean, always-loaded [`AGENTS.md`](../AGENTS.md) is the index that
points the agent at the heavier docs instead of repeating them.

---

## 3. Context architecture — the files that carry it

The goal is a **lean, always-loaded context layer** plus **on-demand "why" knowledge** — not one
giant context file. Every token in an always-loaded file is paid on *every* turn, and bloat causes
context rot. This repo (**NEONAUTH**) implements the layout below.

```
/package.json              ← workspace root: workspaces ["apps/*", "packages/*"]
/AGENTS.md                 ← root: stack, workspace map, global commands & conventions (always loaded)
/CLAUDE.md                 ← Claude Code entry point (one-line import of AGENTS.md)
/README.md                 ← human onboarding (not for agents)
/CONTRIBUTING.md           ← (optional) commit / PR / branch conventions
/docs/
   BUSINESS_PROBLEMS.md    ← the problems the product solves (human-authored, first)
   PRD.md                  ← product requirements (what/why)
   AGENTIC_ENGINEERING_PLAN.md  ← how the team works with AI agents (this file)
   ARCHITECTURE.md         ← data flow, auth, deployment topology
   adr/0001-use-mongoose.md   ← architecture decision records (one per decision)
/apps/
   web/  AGENTS.md         ← React conventions (components, state, data-fetching)
   api/  AGENTS.md         ← Express/Mongoose conventions (routes, models, error shape)
/packages/
   shared/  AGENTS.md      ← (when needed) shared types / zod schemas
```

A per-package `AGENTS.md` is optional until a package's conventions diverge enough to warrant its
own file; until then the root `AGENTS.md` covers both. `CONTRIBUTING.md` and `packages/*` are
recommended-when-needed, not required to start.

| File | Role | Keep it… |
|---|---|---|
| **Root `AGENTS.md`** | "Project README for agents" — always loaded | **Tight.** Stack + versions, workspace map, package manager + canonical `install / dev / build` commands, global conventions, and what *not* to touch (generated files, `.env`) |
| **Per-package `AGENTS.md`** | Scoped context — agents read the *nearest* one | Only what's specific to that package: `api/` documents route→controller→model, the Mongoose schema style, the JSON error envelope; `web/` documents component structure, state, and how to call the API |
| **`PRD.md`** | Product requirements — what/why, for whom | Authored by the human first; the agent helps sharpen and expand it |
| **`ARCHITECTURE.md` + `adr/*`** | Durable "why" knowledge | Referenced when needed, not loaded every turn |

**Two principles drive this:**

1. **Always-loaded must stay lean.** Put stack + commands + conventions in `AGENTS.md`; push
   everything else into `docs/` and reference it on demand.
2. **Nest context in a monorepo.** A root `AGENTS.md` plus a small one per workspace means an agent
   editing `apps/api` gets backend conventions without dragging in the React rules, and vice versa.
   This is the single biggest win for monorepos specifically.

So "context is the material" and "keep always-loaded context lean" are not in tension: the rich
context lives in `docs/`; `AGENTS.md` is the thin, ever-present index that routes the agent to it.

---

## 4. Safety rules — keep control of the work

1. **Plan before code.** Ask the agent for a plan and review it *before* allowing file changes.
2. **Keep tasks small.** Never "build the whole app in one prompt." One logical change at a time.
3. **Review every change.** Read the diffs before accepting them — don't rubber-stamp.
4. **Commit checkpoints.** Save working states with Git so you can always step back
   (see Conventional Commits practice already used in this repo's history).

---

## 5. Safety rules — protect secrets, verify output

5. **Never paste secrets.** No API keys, tokens, connection strings, or `.env` contents in prompts,
   code, logs, or output. In this repo that means **`apps/api/.env` is off-limits** — it is
   gitignored and holds `MONGODB_URI` and `JWT_SECRET`.
6. **Use `.env` + `.gitignore`.** Keep secrets out of the repo entirely; only `.env.example`
   (placeholders) is committed.
7. **Ask for trade-offs.** Make the agent explain its important decisions and alternatives, not just
   hand you code.
8. **Run and test it yourself.** Don't trust "it works" — confirm it. This repo has **no test suite
   and no linter** yet, so verification means *running the app* (`npm run dev:api` /
   `npm run dev:web`) and exercising the behavior. Never claim tests pass.

---

## 6. The golden rule

**Don't accept code you can't explain.** You don't need every advanced detail, but for any change
you accept you should know: what it's for, where it lives, what it connects to, and how to check
whether it works.

---

## 7. What this looks like per change (checklist)

- [ ] The task is small and stated clearly (problem, not just "fix it").
- [ ] The agent has the context it needs (pointed at the relevant docs / files).
- [ ] A plan was reviewed before code changed.
- [ ] I read the diff and can explain every accepted change.
- [ ] No secrets entered the prompt, the code, or the logs.
- [ ] I ran the app and confirmed the behavior — I'm not trusting "it works."
- [ ] Working state committed as a checkpoint with a clear message.

---

> **The lesson:** not AI replacing the developer — the developer **with leverage**. Build faster,
> build with control.
