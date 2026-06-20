# Agentic Engineering Plan — NEONAUTH

How we work **with an AI coding agent** on this repo. The point isn't to ask an AI to write code —
it's to work with one in a disciplined way: clear context, small steps, review checkpoints, and
human ownership of the result.

> **Guiding principle:** the agent helps us move faster; **we stay responsible**. The agent can
> accelerate the work, but the developer still owns the *direction, quality, and correctness* of
> the software.

Related docs: [`AGENTS.md`](../AGENTS.md) (how to work in the code) ·
[`BUSINESS_PROBLEMS.md`](BUSINESS_PROBLEMS.md) · [`PRD.md`](PRD.md) ·
[`architecture.md`](architecture.md).

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
4. **Document the architecture.** Then [`architecture.md`](architecture.md): frontend &
   backend structure, data model, API structure, data flow, key decisions, risks & trade-offs.
5. **Agree on how we work with the agent** — this document.

The most valuable early work lives in these docs, not in the code. **The better the context, the
better the agent can help.** The lean, always-loaded [`AGENTS.md`](../AGENTS.md) is the index that
points the agent at the heavier docs instead of repeating them.

---

## 3. Safety rules — keep control of the work

1. **Plan before code.** Ask the agent for a plan and review it *before* allowing file changes.
2. **Keep tasks small.** Never "build the whole app in one prompt." One logical change at a time.
3. **Review every change.** Read the diffs before accepting them — don't rubber-stamp.
4. **Commit checkpoints.** Save working states with Git so you can always step back
   (see Conventional Commits practice already used in this repo's history).

---

## 4. Safety rules — protect secrets, verify output

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

## 5. The golden rule

**Don't accept code you can't explain.** You don't need every advanced detail, but for any change
you accept you should know: what it's for, where it lives, what it connects to, and how to check
whether it works.

---

## 6. What this looks like per change (checklist)

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
