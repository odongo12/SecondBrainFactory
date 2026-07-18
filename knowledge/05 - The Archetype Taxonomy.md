---
title: The Archetype Taxonomy
tags: [analysis, taxonomy]
---

# The Archetype Taxonomy

The analyzer's job: read a GPT's description and decide *what kind of thing it is*,
because that determines which panels can possibly morph.

| Archetype | Signals in the description | Native input | Native output | Default panels |
|---|---|---|---|---|
| `risk-screener` | screen, assess, dossier, flag, comply | a case | verdict + score | verdict-gauge, factor-bars, threshold-slider-curve, case-table |
| `quant-model` | predict, odds, probability, forecast | numeric params | distribution | distribution-curve, param-sliders, sensitivity-heat, outcome-table |
| `dose-response` | dose, EC50, exposure, toxicity | dose vector | response curve | dose-curve, param-sliders, threshold-marker |
| `pipeline-designer` | pipeline, stages, workflow, design → validate | construct params | staged result | stage-wheel, sequence-track, dose-curve, decay-curve |
| `geo-ops` | border, route, region, map | places | map + route | map-canvas, route-list, param-sliders |
| `text-transform` | rewrite, summarize, extract, classify | text | text | before-after, diff-view, token-meter |
| `explainer` | teach, explain, tutor | topic + level | staged explanation | stage-stepper, concept-graph, progress-meter |
| `generic` | (nothing matched) | — | — | param-sliders, series-chart, outcome-table |
| `portfolio-dashboard` | a *directory over multiple GPTs*, not a single GPT's description | N/A — meta-level, one entry per owned GPT | live/offline status + links out | none of the above — see note below |

## The judgement call

The taxonomy is a starting point, not a cage. A GPT can straddle two archetypes —
the RNAi designer is a `pipeline-designer` with a `dose-response` panel embedded
in it. When that happens, take the pipeline's *shape* and borrow the other's
*panels*. The archetype decides the **layout**; the input/output contract decides
the **panels**.

## When nothing fits

Add an archetype. `pipeline-designer` did not exist until a staged workflow needed
it; it now exists, with a wheel component, for every staged GPT that follows. The
taxonomy is supposed to grow. What it must never do is get *skipped* — an
unclassified build has no principled basis for its panel selection, and it shows.

## The one archetype that breaks the Bus contract on purpose

`portfolio-dashboard` is a special case: it doesn't describe a single GPT at
all, so [[02 - Core, Ring, and Bus]]'s shared input bus across morphic
panels simply doesn't apply — there is no one input/output contract N
different GPTs could share without misrepresenting at least N-1 of them.
Each card independently pings its own backend and links out to that GPT's
own already-built dedicated infographic rather than reimplementing it.
Build once, as the top-level index over every other build, not per-GPT.
Reference: `builds/portfolio-dashboard/`.

Related: [[04 - The Morphic Panel Contract]], [[08 - The Six-Stage Pipeline]]
