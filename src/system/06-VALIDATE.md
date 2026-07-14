---
name: 06-VALIDATE
role: stage-6
read_order: 7
consumes: app.html
produces: pass/fail report
---

# STAGE 6 — VALIDATE

Run these checks before declaring the build done. Report each as PASS/FAIL with a
one-line reason. Do not ship a build with any FAIL in the "must" set.

## Must pass
1. **Opens offline** — `app.html` renders by double-click, no console errors.
2. **Bus propagation** — changing any center input visibly re-renders ≥2 panels.
3. **Morph, not decorate** — every panel reads ≥1 bus key; none are static.
4. **Center wired correctly** — live mode calls `/run` and renders `RunOutput`;
   deep-link mode opens `gpt_url` and copies the prompt.
5. **Downloads work** — each panel export produces a non-empty file; "Save
   poster" produces a PNG.
6. **Schema round-trips** — `action.schema.json` is valid OpenAPI 3.1 and its
   `RunInput` matches the center's request body exactly.
7. **Mobile** — single-column at <720px, core first, no horizontal scroll.

## Should pass
8. Reduced-motion honored; keyboard focus visible; controls labeled.
9. Theme is domain-specific, not the generic default.
10. Poster PNG contains a route back to the live app/GPT (link or QR).

## Log
Append the panel picks + any new panel you invented to
`00-SYSTEM/panel-ledger.md` so the next build reuses proven components (the
vault gardening loop). Then tell the user the build path and the 3 things they
can do next: open locally, host it, or paste the schema into the GPT.
