# Business Problems — NEONAUTH

**Status:** First-pass, human-authored. This is the *starting point* — written before the PRD to
set direction. It is deliberately **problem-focused**: who hurts, why it matters, and what a good
outcome looks like. It intentionally avoids solutions, scope decisions, and architecture — those
come later in [`PRD.md`](PRD.md) and [`architecture.md`](architecture.md).

> How to use this doc: read it critically. The next step is to **challenge it with an AI thinking
> partner** — find the vague problems, question the assumptions, and sharpen the statements —
> *before* generating a PRD. Anything unresolved belongs in "Open questions" at the bottom, not
> hidden inside a confident sentence.

---

## 1. Background

Almost every web app starts at the same place: people need to **create an account, sign in, and
manage their own information** — and the app needs to do that **securely**. NEONAUTH exists to be a
small, correct, self-hosted baseline for exactly that: email + password authentication plus
self-service profile and address management, owned end-to-end with no third-party auth provider.

It is also a **learning vehicle** — a realistic-but-small full-stack app used to practise agentic
engineering. Both framings matter, and they sometimes pull in different directions (see
§7 Tensions).

---

## 2. The core problems

### P1 — Everyone rebuilds the same auth baseline, and often gets it wrong
Solo developers and small teams re-implement register / login / "stay logged in" on every new
project. Because it's boilerplate, it gets rushed, and the rushed version tends to be **insecure**:
tokens stashed in `localStorage`, passwords mishandled, login responses that leak whether an email
exists. The cost is real but invisible until something is breached.

- **Who feels it:** developers starting a new product; the eventual users whose credentials are at risk.
- **Why it matters:** security mistakes here are high-severity and reputation-damaging.

### P2 — Owning your auth shouldn't require giving away your users
Hosted auth providers (Auth0, Clerk, Firebase Auth, …) remove the boilerplate but add **cost,
vendor lock-in, and a dependency that now holds your users' identity data**. Some projects — for
privacy, data-residency, budget, or learning reasons — need to **own the auth flow and the user
data themselves**.

- **Who feels it:** teams with data-ownership or cost constraints; anyone learning how auth
  actually works.
- **Why it matters:** there's a missing middle between "roll your own (risky)" and "outsource it
  (lock-in)."

### P3 — Users need to manage their own account without asking anyone
Once signed in, a person should be able to **update their profile and manage their data on their
own** — change their name/username, keep multiple addresses, and **delete their account entirely**
— without emailing support or filing a ticket. Self-service account deletion in particular is
increasingly an expectation (and in many places a legal one).

- **Who feels it:** end users; and the support/ops people who otherwise field these requests.
- **Why it matters:** lack of self-service creates support load and erodes user trust and privacy.

### P4 — Auth that "works on my machine" silently breaks in real deployments
An auth flow can look perfect in local development and then **fail in production** because the
frontend and backend live on different domains: cookies get dropped, CORS blocks requests, sessions
end without warning. These failures are **subtle, intermittent, and trust-destroying** — the user
just notices they keep getting logged out.

- **Who feels it:** users on the deployed app; the developer debugging a problem they can't
  reproduce locally.
- **Why it matters:** "correct in dev" is not the bar; "correct where it's deployed" is.

### P5 — Learners need a reference that is realistic but not overwhelming
People learning full-stack and agentic engineering need a codebase that is **small enough to read
and fully understand in a sitting, yet real enough to demonstrate a correct end-to-end auth flow**.
Toy demos teach the wrong habits; full production systems are too much to absorb.

- **Who feels it:** learners; anyone using this repo to teach.
- **Why it matters:** the value of a reference app is proportional to how completely a learner can
  explain it.

---

## 3. Who has these problems (stakeholders)

- **The builder** — a solo dev or small team standing up a product MVP who needs auth handled
  correctly and quickly, and wants to keep ownership of their users' data.
- **The end user** — someone who registers, signs in, manages their profile/addresses, and may
  decide to delete their account. They expect their data to be private and their session to be
  reliable.
- **The learner / teacher** — using NEONAUTH to understand (or demonstrate) how a correct,
  cookie-based auth flow fits together across a full stack.

---

## 4. What a good outcome looks like (in user/business terms, not features)

- A developer can stand up **secure, self-hosted** email + password auth and basic profile
  management **quickly**, and trust it by default.
- An end user can **manage and delete their own account data** without contacting anyone, and stay
  logged in reliably across normal use.
- The auth flow is **correct where it is actually deployed**, not only in local development.
- Credentials and sessions **never leak** — not in API responses, not in logs, not to client-side
  JavaScript.
- A learner can **read the whole thing and explain it** — what each piece is for and how to verify
  it works.

---

## 5. Constraints & non-negotiables (business level)

- **Self-hostable and data-owning** — no hard dependency on a third-party auth provider.
- **Secure by default** — the safe choice should be the default choice, not an opt-in.
- **Small and legible** — favour a codebase a newcomer can fully understand over one that's
  maximally featureful.
- **JavaScript end-to-end** — a single-language stack so a learner can move front-to-back without a
  context switch.

---

## 6. Explicitly NOT our problem (for now)

Naming these keeps scope honest; raising them here does not commit us to solving them.

- Enterprise concerns: SSO, organizations/teams, roles & permissions, admin consoles.
- Billing, subscriptions, or anything commerce-related.
- Social / OAuth login.
- High-scale or multi-region operational concerns.

---

## 7. Tensions to resolve

- **Realistic vs. small (P5 vs. P1–P4):** a truly "real" auth baseline arguably needs email
  verification, password reset, and rate limiting — but each one makes the learning surface larger.
  Where is the line for an honest MVP?
- **Own-your-data vs. effort (P2):** self-hosting auth is the whole point, but it also means *we*
  carry the security burden that a provider would otherwise carry. Is the baseline we ship
  responsible enough to recommend?

---

## 8. Assumptions (to be challenged)

- Email + password is an acceptable primary auth method for the target users.
- A single-user-owns-only-their-own-data model is sufficient — no sharing, no delegation.
- The product is web-only for now (no native mobile client).
- A reliable session that survives page refreshes is more important than advanced session features
  (multi-device management, revocation).

---

## 9. Open questions (challenge these before writing the PRD)

- Is the auth baseline credibly "secure self-hosted auth" **without** email verification and
  password reset — or are those table stakes rather than future work?
- Does it need **rate limiting / brute-force protection** to be honestly recommendable, given P1 is
  about *not* shipping insecure auth?
- Is **split-domain deployment** (frontend and backend on different domains) the recommended
  default, or merely *supported*? P4 suggests the same-domain setup should perhaps be the headline
  recommendation.
- For P3, is an embedded list of addresses on the user record enough, or will "manage my data"
  expectations grow beyond what that model handles cleanly?
- Who is the **primary** audience — real builders shipping a product, or learners practising
  engineering? When P5 conflicts with P1–P4, which one wins?
