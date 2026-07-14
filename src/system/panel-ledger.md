---
name: panel-ledger
role: memory
---
# PANEL LEDGER
Proven panels, reused across builds. Claude Code appends a row after each build.
Before writing a new panel, check this table and `src/templates/panels.lib.js`.

| build slug | archetype | panels used | new panels added to library |
|------------|-----------|-------------|------------------------------|
| dsrna-biopesticide-screener | risk-screener | verdict-gauge, factor-bars, threshold-slider-curve, case-table | verdict-gauge, factor-bars, threshold-slider-curve |
| fixture-true-odds-modeler | quant-model | param-sliders, distribution-curve, sensitivity-heat, outcome-table | distribution-curve, sensitivity-heat, outcome-table, param-sliders |
| rnai-precision-crop-designer | pipeline-designer (new) | stage-wheel, sequence-track, threshold-slider-curve, dose-curve, decay-curve | stage-wheel, sequence-track, decay-curve |

## Library status
Implemented and validated in `src/templates/panels.lib.js`: param-sliders,
verdict-gauge, factor-bars, threshold-slider-curve, distribution-curve,
dose-curve, sensitivity-heat, outcome-table, before-after, stage-stepper,
stage-wheel, sequence-track, decay-curve.

Described but not yet implemented (write to the contract, then log here):
map-canvas, route-list, diff-view, token-meter, concept-graph, progress-meter,
timeline-canvas. `geo-ops` builds are blocked until `map-canvas`/`route-list`
exist — see `knowledge/12 - Open Threads.md`.

## New archetype
`pipeline-designer` — a staged workflow (N stages) with a clickable wheel as the
centre, N-stage animation, and one simulator per instrumented stage. Use when the
GPT's description reads as a *pipeline* rather than a single question. Reference:
`builds/rnai-precision-crop-designer/`.
