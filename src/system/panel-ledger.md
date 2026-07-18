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
| vector-trial-governance-navigator | pipeline-designer + risk-screener (straddled) | stage-wheel, verdict-gauge, factor-bars, decay-curve, outcome-table | none — first build to reuse the full existing library with no new panel |
| portfolio-dashboard | portfolio-dashboard (new) | none — deliberately does not use the Bus/panel/download machinery, see below | none — new archetype, not a new panel |

## Library status
Implemented and validated in `src/templates/panels.lib.js`: param-sliders,
verdict-gauge, factor-bars, threshold-slider-curve, distribution-curve,
dose-curve, sensitivity-heat, outcome-table, before-after, stage-stepper,
stage-wheel, sequence-track, decay-curve.

**Bug fixed in `verdict-gauge`, both in `panels.lib.js` and
`infographic.template.html`'s inline copy, during the
vector-trial-governance-navigator build**: the arc sweep angle
`Math.PI-(i/180)*Math.PI` (and the matching needle angle
`Math.PI-out.score*Math.PI`) traced the semicircle through the *downward*
canvas direction instead of upward, because canvas angle convention is
clockwise with +y pointing down. With the gauge's pivot near the bottom of
its own canvas (as drawn), most of the arc rendered off-canvas — only thin
end-caps near the left/right were visible; the dome never appeared. Fixed at
the source (both files) by sweeping `Math.PI+(i/180)*Math.PI` (`PI` to
`2PI`) instead, so every build from now on inherits the corrected gauge.
Caught only by an actual rendered screenshot, not by code review — the
original code had no syntax error.

Described but not yet implemented (write to the contract, then log here):
map-canvas, route-list, diff-view, token-meter, concept-graph, progress-meter,
timeline-canvas. `geo-ops` builds are blocked until `map-canvas`/`route-list`
exist — see `knowledge/12 - Open Threads.md`.

## New archetypes
`pipeline-designer` — a staged workflow (N stages) with a clickable wheel as the
centre, N-stage animation, and one simulator per instrumented stage. Use when the
GPT's description reads as a *pipeline* rather than a single question. Reference:
`builds/rnai-precision-crop-designer/`.

`portfolio-dashboard` — a meta-directory over multiple GPTs the user owns,
each already built (or to be built) as its own single-GPT infographic.
Deliberately breaks the "one shared Bus/panel contract" invariant on
purpose: N different GPTs have N different input/output contracts, and
forcing them into one form would misrepresent all of them. Each card is
independent — pings its own `healthz_url` (with `{mode:"no-cors"}`, not
`{mode:"cors"}` — confirmed via curl that at least one real backend in this
portfolio, RNAi Precision Crop Designer OS, sends no CORS headers, so a
strict cors-mode fetch would falsely report a live server as offline),
deep-links to the real hosted GPT, and links out to that GPT's own
dedicated `app.html`. Use this archetype once, as the top-level index, not
per-GPT. Reference: `builds/portfolio-dashboard/`.
