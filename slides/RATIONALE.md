# Slide Deck Rationale — Agentic AI Coding on a MERN Codebase

Companion to [`slide-deck.html`](slide-deck.html). Explains why each slide exists, what job it
does, and how the deck flows. Pairs with the recording script in
`teaching-session-plan-neonauth.md` (local), whose `[▸ Slide N]` cues map 1:1 to the slides below.

Current deck: **19 slides**.

## The argument

The deck makes one argument: **agentic AI coding is powerful, but it only becomes *engineering*
when a human supplies context, judgment, and verification.** It proves the argument by doing it
live — adding one small feature (Default Address) to a real app (NEONAUTH) the disciplined way.

It moves through five movements plus a close:

1. **Frame** (1–2) — set the thesis: agent accelerates, human stays responsible.
2. **The concept** (3–5) — define agentic coding, then expose the risk (vague → broken).
3. **The codebase** (6–7) — ground it in a real app so the discipline is *necessary*, not theatrical.
4. **The task** (8–13) — turn a vague ask into an engineering-ready spec + invariant + edge cases.
5. **The workflow** (14–17) — run context → plan → verify on that spec.
6. **Close** (18–19) — compress it into a reusable loop and a memorable principle.

Two through-lines stitch it together:

- **The "exactly one default" invariant** — introduced in the spec (12), reviewed in the plan (16),
  confirmed in verification (17).
- **The human-responsibility thread** — stated on slide 2, paid off on every workflow slide and the
  ending.

## Slide-by-slide rationale

| # | Slide (style) | Rationale — the job it does |
|---|---|---|
| 1 | Cover | Names the topic; the byline ("one small feature, on an app that already works") sets expectation. Plain/descriptive, not salesy — signals an educational tone. |
| 2 | Guiding principle (idea) | States the thesis up front so everything after is read through it: agent accelerates, **we stay responsible**. Deliberately before the definition, as the lens. |

### Act 1 — The concept

| # | Slide (style) | Rationale |
|---|---|---|
| 3 | Divider "What is Agentic AI Coding?" | Poses the question; subtitle foreshadows the answer and hints at the stakes. |
| 4 | Definition (idea) | Answers slide 3: an agent that inspects/plans/edits/runs, *not* autocomplete. Ends on "judgment about what's correct stays with you" — re-seeds the responsibility thread. |
| 5 | Why discipline (idea) | The consequence: "an unclear task gives you unclear code," and on a working codebase that **breaks things**. Motivates the whole workflow. |

### Act 2 — The codebase

| # | Slide (style) | Rationale |
|---|---|---|
| 6 | Divider "A real app, already working" | Transition: we prove this on real code, not a toy. "Without breaking what's there" raises the stakes. |
| 7 | Meet NEONAUTH (duo) | *What the app is* (MERN auth+profile, existing patterns) vs *our job* (add Default Address). Establishes that inspect-before-change is genuinely required. |

### Act 3 — The task (vague → spec)

| # | Slide (style) | Rationale |
|---|---|---|
| 8 | Divider "From a vague ask to a clear spec" | Opens the heart of the lesson; previews the bad-ask → spec contrast. |
| 9 | The vague version (maplist) | The weak prompt + the 6 questions it leaves to guess. Makes "under-specified" tangible, not asserted. |
| 10 | Turn it into a spec (contrast) | Vague request → engineering-ready spec, side by side. Closing line: *a good spec isn't longer, it's explicit.* |
| 11 | What the spec makes explicit (trio) | Behaviour / Constraints / Acceptance — the anatomy of engineering thinking. |
| 12 | The invariant (idea) | Isolates the single rule, framed through the agentic lens: **you** name it and decide it belongs on the server — the judgment the agent can't take over. Keeps the point from becoming a generic full-stack lecture. |
| 13 | Edge cases (maplist) | first / switching / deleting default / deleting last. A real invariant must survive every path — the thoroughness a reviewer brings. |

### Act 4 — The workflow

| # | Slide (style) | Rationale |
|---|---|---|
| 14 | Divider "Now: with discipline" | Names the loop (context, plan, implement, verify, review) and the stance: agent proposes, human approves. |
| 15 | Context first (foundation tree) | Shows the repo foundation the agent reads (AGENTS.md + docs/). Teaches "context is the material" — the first discipline before any edit. |
| 16 | Plan, then review (maplist) | The 4 review checks (minimal model / invariant on server / edge cases / scope). The human exercising judgment over the agent's plan — the core agentic act. |
| 17 | Implement → verify (numlist) | Browser checklist + the direct-API check. Closing reframed to ownership: verifying yourself, not trusting the agent's "done," is what makes it engineering. |

### Close

| # | Slide (style) | Rationale |
|---|---|---|
| 18 | The reusable workflow (numlist) | Compresses the demo into a transferable 5-step loop ("works for any change, on any codebase"). Turns a demo into a mental model. |
| 19 | Ending (principles) | "Build faster. Build with control." + three takeaways (Spec over prompt · Plan before code · Verify the invariant). Leaves portable principles, not "that's the demo." |

## How it flows — strengths & the one seam

- **Question → answer → consequence** (3→4→5) is tight; the invariant thread (12 → 16 → 17) gives the
  back half a spine.
- **Layout rhythm** alternates idea / duo / contrast / trio / maplist / tree / numlist, so no two
  adjacent slides feel identical.
- **One seam to be aware of:** slide 2 (principle) sits *before* the definition (3–4), so the moral is
  asserted before the thing is defined. It works as a hook and matches the script, but it's the one
  place the logic runs slightly ahead of itself — worth knowing when narrating.
