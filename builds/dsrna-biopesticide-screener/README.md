# Build: dsRNA Biopesticide Dossier Screener (reference)

**Archetype:** risk-screener
**Mode:** deep-link (no backend yet). Set `CFG.gpt.action_base_url` to go live.
**Panels:** verdict-gauge, factor-bars, threshold-slider-curve, case-table —
each reads the shared input bus and re-renders on change.

## Files
- `app.html` — the executable infographic (open by double-click).
- `action.schema.json` — paste into the GPT's *Actions* config once a backend exists.
- `build.spec.json` — the analyzer output that generated this build.

## Go live in 3 steps
1. Deploy `../../10-TEMPLATES/backend.stub.py` on a HuggingFace Space; implement
   `/run` to return `{score, band, factors}`.
2. Put that URL in the schema `servers[0].url` AND in `app.html` `CFG.gpt.action_base_url`.
3. Paste `action.schema.json` into the Custom GPT → Actions. Now the GPT and the
   infographic call the same endpoint — one contract, two front-ends.

## Host the infographic
Open locally, or push `app.html` to GitHub Pages / a HuggingFace **Static** Space.
The exported `poster.png` is the flat launcher image; `app.html` is the live app.
