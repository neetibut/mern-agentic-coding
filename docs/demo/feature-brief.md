# Feature Brief — Default Address (teaching demo)

> This brief is a **teaching artifact** for the recorded session. It describes the feature the
> instructor builds *live* with Claude Code on NEONAUTH. The feature is intentionally **not yet
> implemented** in the app source. Related: [`../PRD.md`](../PRD.md) (product context),
> [`../AGENTIC_ENGINEERING_PLAN.md`](../AGENTIC_ENGINEERING_PLAN.md) (the workflow),
> [`verification-checklist.md`](verification-checklist.md) (how we verify it).

## Summary

Let a signed-in user mark **exactly one** of their saved addresses as their **default**. Today
NEONAUTH stores a flat list of addresses with no notion of a primary one (see
[`../../apps/api/src/models/User.js`](../../apps/api/src/models/User.js)). This feature adds that
notion end-to-end.

## Behavior

1. **First address auto-defaults.** When a user adds their first address, it becomes the default.
2. **Switching is exclusive.** Marking an address as default unsets the previous default — there is
   never more than one default at a time.
3. **Deleting the default promotes another.** If the default address is deleted, the most recently
   added remaining address becomes the new default. If it was the last address, the user has no
   default.
4. **Visible in the UI.** The default address is badged ("Default") and listed **first**.

## The invariant (the heart of the feature)

> A user has **at most one** default address, and **exactly one** whenever they have ≥1 address.

This must be enforced **server-side** in the controller, not merely reflected in the UI — a client
could call the API directly.

## Acceptance criteria

- Adding the first address sets `isDefault = true` on it.
- Setting a new default flips the old one to `false` in the same operation.
- After any add / set-default / delete, the number of default addresses is exactly `1` if the user
  has any addresses, else `0`.
- Deleting the default promotes the most-recently-added remaining address.
- The web Dashboard shows a Default badge and orders the default address first.
- Full behavioral checklist: [`verification-checklist.md`](verification-checklist.md).

## Non-goals / constraints

- No new authentication or roles (auth already exists: JWT in an httpOnly cookie).
- No external services, no new dependencies.
- Stay within existing patterns: API `model → controller → routes`; web `Neon*` components + the
  `api` client wrapper.
- Existing address add / edit / delete / list, profile updates, and login/logout must keep working
  unchanged.

## Likely touch-points (for inspecting & planning)

| Layer | File | Expected change |
|---|---|---|
| Model | `apps/api/src/models/User.js` | add `isDefault: { type: Boolean, default: false }` to `addressSchema` |
| Controller | `apps/api/src/controllers/userController.js` | enforce the invariant in `addAddress` / `deleteAddress`; add a "set default" path |
| Routes | `apps/api/src/routes/userRoutes.js` | a route to set an address as default (e.g. `PUT /users/me/addresses/:id/default`) |
| Web | `apps/web/src/components/AddressList.jsx` | Default badge, "Make default" action, default-first ordering |
| Web | `apps/web/src/api/client.js` | reuse existing `api.put` — no new client needed |

## Edge cases to call out in the plan

- The **first** address added (auto-default).
- **Switching** the default between two addresses (old one must clear).
- **Deleting** the current default (promote another).
- Deleting the **last** address (no default, no error).
