# Prompt 01 — the weak request (what NOT to do)

This is the kind of one-liner many developers paste into a coding agent and hope for the best:

> Add a way for users to pick a main address.

## Why this is under-specified for an agent

It sounds reasonable to a human, but it forces the agent to **guess**:

- What does "main" mean — a flag on an address? A separate field on the user? A sort order?
- Can there be more than one "main" address, or exactly one?
- What happens to the previous main address when a new one is picked?
- What happens when the user **deletes** the address that is currently main?
- What about the **first** address a user ever adds — is it main by default?
- Should anything change in the UI (a badge? ordering?), or only in the data?
- Must the existing add / edit / delete / list behavior keep working untouched?

A vague request produces vague code. The next file, [`02-spec.md`](02-spec.md), rewrites this as an
engineering-ready brief — not just *longer*, but with the engineering thinking made **explicit**.
