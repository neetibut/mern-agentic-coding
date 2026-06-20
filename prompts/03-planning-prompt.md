# Prompt 03 — context & planning (before any code)

Even with a good spec ([`02-spec.md`](02-spec.md)), we do **not** let the agent jump straight to
editing files. Two steps come first: **context**, then **plan**.

## Step 1 — Context (inspect, don't change)

> Please inspect this repository. Before making any changes, summarize the monorepo structure and
> identify the files involved in storing and managing a user's **addresses**: the Mongoose model,
> the controller, the routes, and the React components that render and edit addresses. Read
> `AGENTS.md` first for the project's conventions. **Do not modify any files yet.**

Why this matters: if the agent doesn't understand the existing design, it may "solve" the task in a
way that breaks current behavior. We expect it to name files like `apps/api/src/models/User.js`,
`apps/api/src/controllers/userController.js`, `apps/api/src/routes/userRoutes.js`, and
`apps/web/src/components/AddressList.jsx`.

## Step 2 — Plan (propose, wait for confirmation)

> Propose an implementation plan for the Default Address feature specified in
> [`02-spec.md`](02-spec.md) (full detail in [`../docs/demo/feature-brief.md`](../docs/demo/feature-brief.md)).
> Read those first. List the files you expect to change and the data-model change. State how you will
> enforce the **exactly-one-default** invariant
> on the server. Call out the edge cases — the first address, switching the default, deleting the
> default, and deleting the last address. Identify any risk of touching unrelated behavior
> (profile, auth). **Wait for my confirmation before writing code.**

## What I review in the plan before approving

- Is the data-model change **minimal** (one `isDefault` boolean on the address subdocument)?
- Is the invariant enforced **server-side** in the controller, not only in the UI?
- Are all four edge cases handled (first add, switch, delete-default, delete-last)?
- Is it staying inside existing patterns and **not** touching auth/profile?
- Are the listed file changes reasonable and scoped?

Agentic AI coding doesn't mean the agent decides everything. **The agent proposes; the human
reviews.** Only after this review do we approve implementation — then
[verify](../docs/demo/verification-checklist.md).
