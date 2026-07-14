---
title: The Validation Gate
tags: [process, quality]
---

# The Validation Gate

Nothing ships with a failure in the **must** set.

## Must pass

1. **Opens offline.** Double-click `app.html`; it renders; no console errors.
2. **Bus propagation.** Changing any core input visibly re-renders at least two panels.
3. **Morph, not decorate.** Every panel reads ≥1 bus key. A static panel is a picture — cut it. (See [[01 - The Design Law]].)
4. **Core wired correctly.** Live mode calls `/run` and renders `RunOutput`; deep-link mode opens the GPT and copies the prompt.
5. **Downloads work.** Every panel's export produces a non-empty file.
6. **Schema round-trips.** `action.schema.json` is valid OpenAPI 3.1 and its `RunInput` matches the core's request body exactly.
7. **Model is monotonic.** Run `mockRun` in node across edge cases. Constraints must move outcomes in the direction they should.
8. **Mobile.** Single column below ~860px, core first, no horizontal scroll.

## Should pass

9. Reduced motion honored; keyboard focus visible; every control labeled.
10. Theme is domain-specific, not the generic default. (See [[07 - The Retarget Invariant]].)
11. The exported poster contains a route back to the live app.

## The check that catches the most

**#3.** It is easy to add a panel that looks like data and is in fact a constant.
It renders, it exports, it passes every other test — and it teaches the reader
that the interactivity is theatre. Grep every panel for a bus key. If it doesn't
read one, it doesn't ship.

## Then log it

Append to the panel ledger: which panels were used, which were invented. This is
how the library compounds instead of forking.

Related: [[08 - The Six-Stage Pipeline]], [[06 - The Local Estimator Doctrine]]
