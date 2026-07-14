---
title: The Morphic Panel Contract
tags: [architecture, components]
---

# The Morphic Panel Contract

Every panel — a gauge, a dose curve, a heatmap, a sequence track — implements the
same four-member interface. This is what makes the download layer and the bus
wiring *identical across every build*.

```js
{
  id:      "verdict-gauge",        // unique; also the export filename
  accepts: ["result", "gc"],       // bus keys it reads
  mount(el, cfg) { … },            // build DOM once
  render(state)  { … },            // called on EVERY bus change
  export()       { … }             // → {png?, csv?, json?, html?}
}
```

## Why a contract and not just "write some charts"

Without it, every build reinvents its gauge, its download button, its wiring —
and each reinvention is a fresh opportunity for drift. With it:

- **The bus wiring never changes.** `PANELS.forEach(p => Bus.subscribe(p.render))`.
- **The download layer never changes.** One `downloadPanel(p)` serves all of them.
- **Panels compound.** A panel written for one build is available to the next.

That compounding is the whole economic argument for the factory. Build three, and
the fourth is nearly free.

## The library

Implemented and validated: `param-sliders`, `verdict-gauge`, `factor-bars`,
`threshold-slider-curve`, `distribution-curve`, `dose-curve`, `sensitivity-heat`,
`outcome-table`, `before-after`, `stage-stepper`, `stage-wheel`, `sequence-track`,
`decay-curve`.

Described but not yet written: `map-canvas`, `route-list`, `diff-view`,
`token-meter`, `concept-graph`, `progress-meter`, `timeline-canvas`.

## The discipline

**Reuse before you write.** Before adding a panel, check the library. A reused
panel is already validated; a new one is a new liability. When a genuinely new
view is needed, write it *to the contract*, add it to the library, and log it in
the ledger — so the next build inherits it.

## Downloadable by construction

"The transform interfaces are downloadable" is not a feature bolted on at the
end. It is the `export()` member of the contract. A panel that cannot export its
state has not implemented the interface.

Related: [[02 - Core, Ring, and Bus]], [[07 - The Retarget Invariant]]
