---
name: 01-ANALYZER
role: stage-1
read_order: 2
consumes: src/intake.md
produces: builds/<slug>/build.spec.json
---

# STAGE 1 — ANALYZER

Turn `{name, description, url}` into a structured `build.spec.json`. You are
reverse-engineering what the GPT *does* so the surrounding panels can simulate/
visualize the same domain.

## Step 1 — Classify the domain

Read the description. Match to the closest **domain archetype** (extend freely):

| Archetype | Signals in description | Native input | Native output |
|-----------|------------------------|--------------|---------------|
| `risk-screener` | screen, assess, dossier, compliance, flag, refuse | a case/record | verdict + score + rationale |
| `quant-model` | predict, odds, probability, forecast, model, Poisson | numeric params | distribution / number |
| `dose-response` | dose, concentration, EC50, exposure, toxicity | dose vector | response curve |
| `pipeline-designer` | pipeline, stages, workflow, design → validate, steps | construct/build params | staged result |
| `geo-ops` | border, route, location, region, map, coordinates | places | map + route |
| `text-transform` | rewrite, summarize, translate, extract, classify | text | text |
| `designer` | generate, layout, plan, itinerary, schedule | constraints | structured plan |
| `explainer` | teach, explain, tutor, walk through | topic + level | staged explanation |

If nothing fits, set `archetype: "generic"` and use the generic panel set.

A GPT can straddle two archetypes (e.g. a `pipeline-designer` with a `dose-response`
panel embedded in one stage — see `builds/rnai-precision-crop-designer/`). When
that happens, take the pipeline's *shape* for the layout and borrow the other
archetype's panels for that stage. The archetype decides the layout; the
input/output contract decides the panels.

## Step 2 — Extract the input contract

From the description, list the inputs a user would give the GPT. For each:
`{ id, label, type (number|text|enum|slider|vector), default, min, max, unit }`.
When the description is vague, infer 2–4 sensible inputs from the archetype's
"native input". These inputs become the **shared input bus** — the single source
of truth every panel reads.

## Step 3 — Extract the output contract

What does the GPT return? `{ id, label, type (scalar|label|series|table|geojson|markdown) }`.
This decides how the center renders the answer and what the panels visualize.

## Step 4 — Pick morphic panels (the polymorphic surround)

Select 3–5 panels from `04-MORPHIC-PANELS.md`'s registry whose `accepts` match
the input/output contract. Rule: **every panel must read at least one bus input
and re-render when it changes.** Panels that can't morph on input are decoration
— reject them. Map archetype → default panel set:

- `risk-screener` → `verdict-gauge`, `factor-bars`, `threshold-slider-curve`, `case-table`
- `quant-model` → `distribution-curve`, `param-sliders`, `sensitivity-heat`, `outcome-table`
- `dose-response` → `dose-curve`, `param-sliders`, `threshold-marker`, `series-table`
- `pipeline-designer` → `stage-wheel`, `sequence-track`, `dose-curve`, `decay-curve` (pick per-stage panels that fit the pipeline's actual domain)
- `geo-ops` → `map-canvas`, `route-list`, `param-sliders`
- `text-transform` → `before-after`, `token-meter`, `diff-view`
- `designer` → `timeline-canvas`, `param-sliders`, `plan-table`
- `explainer` → `stage-stepper`, `concept-graph`, `progress-meter`
- `generic` → `param-sliders`, `series-chart`, `outcome-table`

## Step 5 — Emit build.spec.json

```json
{
  "slug": "kebab-name",
  "gpt": { "name": "...", "description": "...", "url": "...", "action_base_url": null },
  "archetype": "risk-screener",
  "inputs": [ { "id": "gc_content", "label": "dsRNA GC %", "type": "slider", "default": 48, "min": 20, "max": 70, "unit": "%" } ],
  "outputs": [ { "id": "verdict", "label": "Screen verdict", "type": "label" } ],
  "panels": ["verdict-gauge", "factor-bars", "threshold-slider-curve", "case-table"],
  "theme_hint": "derive from domain: bio->clinical greens, quant->cool slate, geo->earth"
}
```

Write it to `builds/<slug>/build.spec.json`, then proceed to `02-SCHEMA-FORGE.md`.
