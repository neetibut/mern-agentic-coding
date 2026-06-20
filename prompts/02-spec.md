# Prompt 02 — the improved spec (engineering-ready)

The same request, rewritten so the agent has behavior, constraints, and acceptance criteria. Note
it is **not just longer** — it makes the engineering thinking explicit. Full detail lives in
[`../docs/demo/feature-brief.md`](../docs/demo/feature-brief.md); this is the version pasted to the
agent.

---

> **Implement a Default Address feature for NEONAUTH.**
>
> Each user can mark **exactly one** of their saved addresses as their default.
>
> **Behavior**
> - Adding a user's **first** address makes it the default automatically.
> - Marking another address as default **unsets** the previous default — there is never more than
>   one default.
> - **Deleting** the default address promotes another remaining address to default (the most
>   recently added). If it was the last address, the user simply has no default.
> - In the UI, the default address is clearly **badged** and listed **first**.
>
> **Constraints / non-goals**
> - The "exactly one default" rule must be enforced **server-side**, not just in the UI.
> - Do **not** add authentication or roles — auth already exists (JWT httpOnly cookie).
> - Do **not** introduce external services or new dependencies.
> - Stay within the existing patterns: Mongoose model → controller → routes on the API, and the
>   existing `Neon*` components + `api` client on the web.
> - Existing address add / edit / delete / list, profile updates, and login/logout must keep
>   working unchanged.
>
> **Acceptance criteria** — see [`../docs/demo/verification-checklist.md`](../docs/demo/verification-checklist.md).
>
> **Before writing any code, inspect the codebase and propose a plan. Do not modify files yet.**

---

The closing instruction matters as much as the spec: a good brief tells the agent to **inspect and
plan first**. That hand-off is in [`03-planning-prompt.md`](03-planning-prompt.md).
