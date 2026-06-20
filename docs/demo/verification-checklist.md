# Verification Checklist — Default Address (teaching demo)

> The step many developers skip — and the part that turns AI-generated code into **engineering**.
> The agent can produce code; the developer is responsible for product behavior, edge cases, and
> maintainability. Brief: [`feature-brief.md`](feature-brief.md).

## How to verify

Both dev servers running (`npm run dev:api`, `npm run dev:web`), signed in as a test user on the
Dashboard. Walk these in order and confirm each one by hand.

### Core behavior
- [ ] **First address auto-defaults.** Add the first address → it shows the **Default** badge.
- [ ] **Second address doesn't steal default.** Add a second address → the first is still default.
- [ ] **Switching is exclusive.** Click "Make default" on the second → the badge moves; the first is
      no longer default. Exactly **one** default is shown.
- [ ] **Default lists first.** The default address is ordered at the top of the list.

### Persistence
- [ ] **Survives reload.** Refresh the page → the default is unchanged (it persisted to MongoDB, not
      just React state).

### Edge cases
- [ ] **Delete the default → promote.** Delete the current default → another remaining address
      becomes default automatically.
- [ ] **Delete the last address → no default.** Remove all addresses → no default, no console or
      server errors.
- [ ] **Edit doesn't disturb default.** Edit the fields of a non-default address → default is
      unchanged; edit the default's fields → it stays default.

### No regressions (existing behavior still works)
- [ ] Add / edit / delete a normal address still works.
- [ ] Update profile (username / first / last name) still works.
- [ ] Log out and back in → addresses and the default are intact.

### Server-side enforcement (don't trust the UI alone)
- [ ] Call the API directly (e.g. set-default endpoint) and re-fetch the user → the response has
      exactly one address with `isDefault: true`. The invariant holds without the UI's help.

---

If every box is checked, the feature is **verified** — not just "it looked like it worked."
