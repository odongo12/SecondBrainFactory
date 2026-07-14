---
name: 04-MORPHIC-PANELS
role: stage-4
read_order: 5
consumes: build.spec.json
produces: panel instances wired into app.html
---

# STAGE 4 — MORPHIC PANEL REGISTRY

The "polymorphic infographic" is really a **registry of panel components**. The
analyzer picks 3–5; each subscribes to the input bus, re-renders on change
("morphs"), and exports its state. Every panel implements the same interface:

```js
// interface Panel {
//   id: string
//   accepts: string[]        // bus keys it reads
//   mount(el, cfg): void     // build DOM once
//   render(state): void      // called on every bus change
//   export(): {png?, csv?, json?, html?}  // downloadable state
// }
```

Below are the canonical panels. Implement the ones selected; keep the interface
identical so the download layer and bus wiring are uniform.

## Registry

### `param-sliders`
Renders bus inputs as labeled sliders/number fields. Writes back to the bus.
This is the primary "user input" panel when the center is deep-link-only.
Export: JSON of current inputs.

### `distribution-curve`
Canvas line chart of a probability distribution derived from inputs (Poisson,
normal, logistic per archetype). Morphs shape as params change.
Export: PNG (canvas), CSV of (x, p).

### `verdict-gauge`
Radial gauge showing a 0–1 score / PASS-FLAG-FAIL band. Reads `result.score` or
a `mockRun` estimate. Color band morphs with value.
Export: PNG, JSON {score, band}.

### `factor-bars`
Horizontal bars of the factors driving the verdict (each input's contribution).
Recomputes weights on input change.
Export: PNG, CSV.

### `threshold-slider-curve`
A response curve with a draggable threshold marker; area past threshold
highlights and reports % flagged. Dragging the threshold is itself an input that
propagates to `verdict-gauge`.
Export: PNG, CSV.

### `dose-curve`
Sigmoid dose–response with EC50 marker; recomputes from dose vector + Hill slope.
Export: PNG, CSV.

### `sensitivity-heat`
2-param heatmap of outcome across a grid; recolors on other inputs.
Export: PNG, CSV.

### `series-chart` / `outcome-table` / `case-table` / `series-table`
Generic chart + tabular renderers of `result.series` / `result.table`.
Export: PNG (chart), CSV (table).

### `map-canvas` / `route-list`
Lightweight SVG map (no external tiles) plotting `result.geojson` points/route.
Morphs markers on input.
Export: SVG->PNG, GeoJSON.

### `before-after` / `diff-view` / `token-meter`
Text-transform panels: input text vs GPT output, word-level diff, token/length
meter that updates as text changes.
Export: HTML snapshot, TXT.

### `stage-stepper` / `concept-graph` / `progress-meter`
Explainer panels: stepper through GPT-returned stages, a small node graph of
concepts, a progress meter tied to `state.level`.
Export: PNG, JSON.

### `stage-wheel`
The `pipeline-designer` core visual: a clickable/keyboard-focusable N-stage
SVG wheel driven by `cfg.stages` (`[title, desc, color]` per stage). Writes
`stage` to the bus so every other panel and the methodology list can
highlight the active stage together.
Export: JSON (stage list + current index).

### `sequence-track`
Deterministic PRNG-seeded sequence generator (same inputs → same construct,
every time) plus a sliding-window composition chart. Retarget via
`cfg.sequenceTrack = { compositionId, lengthId, label, alphabetHigh, alphabetLow }`
— defaults match the biology case (GC%/length) it was first built for, but any
two-symbol composition-over-length domain retargets by config alone.
Export: PNG, CSV, JSON (full sequence).

### `decay-curve`
Exponential decay of a `result` field (e.g. persistence, half-life) over N
days/steps, banded by a risk/verdict field. Retarget via
`cfg.decayCurve = { rateField, bandField, days, label }`.
Export: PNG, CSV.

## Download layer (shared)

One toolbar function serves all panels:

```js
function downloadPanel(panel){
  const out = panel.export();
  if (out.png)  saveBlob(out.png, `${panel.id}.png`);
  if (out.csv)  saveBlob(new Blob([out.csv],{type:"text/csv"}), `${panel.id}.csv`);
  if (out.json) saveBlob(new Blob([JSON.stringify(out.json,null,2)],{type:"application/json"}), `${panel.id}.json`);
  if (out.html) saveBlob(new Blob([out.html],{type:"text/html"}), `${panel.id}.html`);
}
// "Download everything" bundles all panels + the poster into one .html snapshot
// and (optionally) a .zip if JSZip is inlined.
```

Also emit a **poster export**: `html2canvas`-free approach — draw the whole
layout into an offscreen canvas OR just provide a "Save poster (PNG)" that
snapshots the app container. The poster is the *static launcher image*; opening
`app.html` is the live experience.

Proceed to `05-BUILD.md`.
