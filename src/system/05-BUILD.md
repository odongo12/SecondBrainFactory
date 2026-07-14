---
name: 05-BUILD
role: stage-5
read_order: 6
consumes: build.spec.json, action.schema.json, center config, panels
produces: 20-BUILDS/<slug>/app.html, poster.png, README.md
---

# STAGE 5 — BUILD (assembly)

Assemble one **self-contained** `app.html` — no build step, no external runtime
deps except optional CDNs you inline or vendor. It must open by double-click.

## Procedure

1. Copy `10-TEMPLATES/infographic.template.html` to `20-BUILDS/<slug>/app.html`.
2. Inject the `CFG` object built in Stage 3 (inputs, outputs, urls, mode,
   `mockRun`, `promptTemplate`) into the `<script id="cfg">` block.
3. From the registry (Stage 4), paste ONLY the selected panels' implementations
   into the `PANELS` array. Delete unused panel code — keep the file lean.
4. Layout: center-core in the middle grid cell; selected panels fill the ring in
   reading order. Use CSS grid `grid-template-areas` so it degrades to a single
   column on mobile (< 720px) with the core first.
5. Theme: derive tokens from `theme_hint`. Do NOT ship the generic cream+serif+
   terracotta default. Pick a palette that belongs to the domain (see the
   frontend-design law in the vault README).
6. Wire the bus: center `onInput` -> `Bus.set(inputs)`; each panel
   `Bus.subscribe(panel.render)`; center `onResult` -> `Bus.set({result})`.
7. Wire downloads: per-panel button -> `downloadPanel`; global "Download all" and
   "Save poster (PNG)".
8. Accessibility floor: keyboard focus visible, `prefers-reduced-motion`
   respected, all controls labeled.

## Poster export

Provide a "Save poster (PNG)" that rasterizes the app container to canvas so the
user gets the *static entry-point image* the brief describes — the PNG that
"becomes the entry point to simulations." Embed the `gpt_url` as a caption/QR so
the flat image still routes back to the live app + GPT.

## Emit README.md

Write `20-BUILDS/<slug>/README.md`:
- what the GPT does, the archetype, the chosen panels and why
- mode (live vs deep-link) and the `action_base_url`
- how to host (open locally, or drop on GitHub Pages / HF Static Space)
- the paste-ready `action.schema.json` reminder for the GPT's Actions config

Proceed to `06-VALIDATE.md`.
