---
title: The Local Estimator Doctrine
tags: [doctrine, honesty, modeling]
---

# The Local Estimator Doctrine

Every build ships a `mockRun(inputs)` — a small, deterministic function that
computes the domain outcome locally, in the browser, with no backend.

## Why it exists

Without it, an infographic with no backend is dead: the sliders move and nothing
happens. The estimator means **the page is fully interactive on day one**, before
any endpoint is deployed, before the GPT's Action is configured. You can hand the
file to someone and it works offline.

It is also the *only* place in a build where real domain thinking happens. The
machinery is generic; the estimator is not. Writing it forces you to state, in
executable form, what you actually believe about the domain.

## The three requirements

**Deterministic.** Same inputs, same output, every time. No `Math.random()` in the
output path. Where randomness is needed (generating a sequence), seed a PRNG from
the inputs so the construct is reproducible.

**Transparent.** A reader should be able to open the source and see the model.
Weighted logistic, Poisson grid, Hill equation — legible, small, arguable.

**Labeled.** This is the non-negotiable one. The UI must say *local estimate* and
must point at the GPT as the authoritative source. An estimator presented as the
GPT's answer is a lie with a chart on it.

## The line that must not be crossed

> The estimator makes the interface work. It does not make the interface right.

When the real backend lands, `mockRun` becomes a fallback for network failure —
not a competitor to the model. If your estimator is *good enough to ship as the
answer*, then it isn't an estimator, it's the model, and it belongs behind `/run`
where the GPT can reach it too.

## Validate it outside the browser

Run the estimator in `node` across edge cases before shipping. Check monotonicity:
does tightening a constraint move the outcome in the direction it should?
A model that is subtly non-monotonic will produce a panel that looks fine and
teaches the reader something false.

Related: [[03 - The Action Schema Bridge]], [[11 - The Validation Gate]]
