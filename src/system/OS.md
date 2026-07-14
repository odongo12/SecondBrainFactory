---
name: OS
role: master-router
read_order: 1
audience: Claude Code (VSCode agent)
---

# SECOND BRAIN FACTORY — OBSIDIAN OPERATING SYSTEM

You are Claude Code operating inside this Obsidian vault. This file is your
**boot sequence**. When the user asks you to "build an infographic" or points
you at an intake note, execute the pipeline below in order. Do not improvise the
order; each stage consumes the previous stage's output.

## The one thing the user supplies

The user edits exactly ONE file: `90-INTAKE/intake.md`. They fill in three fields:

```yaml
gpt_name:        # e.g. "dsRNA Biopesticide Dossier Screener"
gpt_description: # 1–3 sentences, pasted from the GPT config
gpt_url:         # https://chatgpt.com/g/g-XXXX-...
# OPTIONAL — only if the GPT has a live Action backend:
action_base_url: # e.g. https://josephodongo-screener.hf.space
```

Everything else is inferred. The user never writes schema, HTML, or JS.

## Core design law (do not violate)

> **Never embed the simulation or the GPT inside the image.**
> The infographic is a *visual interface that links to interactive experiences.*
> A PNG/JPEG is static; it becomes the **entry point** to simulations.

Concretely this means the deliverable is an **HTML application** (`app.html`)
whose visual skin is an infographic, plus an optional exported **poster PNG**
that is only a preview/launcher. Three zones:

```
        ┌───────────────────────────────────────────┐
        │  MORPHIC PANEL          MORPHIC PANEL       │   <- surround:
        │  (simulation A)         (model B)           │      polymorphic
        │                                             │      sim/model
        │            ┌─────────────────┐              │      interfaces
        │            │   CORE: CUSTOM  │              │      that TRANSFORM
        │            │   GPT INTERFACE │  <- center:  │      on input +
        │            │  (action schema │     the GPT  │      are DOWNLOADABLE
        │            │   wired to real │              │
        │            │   backend)      │              │
        │            └─────────────────┘              │
        │  MORPHIC PANEL          MORPHIC PANEL       │
        │  (chart C)              (map/canvas D)      │
        └───────────────────────────────────────────┘
```

The center takes input. A shared **input bus** broadcasts that input to every
surrounding panel, which re-renders ("morphs"). Each panel exports its current
state (PNG / CSV / JSON / standalone HTML).

## Why not iframe the GPT

OpenAI Custom GPTs send `X-Frame-Options: DENY` — they **cannot** be iframed.
So the center does two things instead:
1. **Deep-links** out to `gpt_url` (opens the real GPT in a new tab), and
2. If `action_base_url` is present, **calls the GPT's own Action backend
   directly** from the page, so inputs typed into the infographic get real
   answers inline — the same endpoint the GPT's action schema calls.
This is what "embedded via action schema" means in practice: the infographic
and the GPT share one backend contract.

## PIPELINE (run in order)

| Stage | File | Produces |
|-------|------|----------|
| 0 | `90-INTAKE/intake.md` | the 3 user fields |
| 1 | `01-ANALYZER.md` | `build.spec.json` — inferred domain, inputs, outputs, panel picks |
| 2 | `02-SCHEMA-FORGE.md` | `action.schema.json` — OpenAPI action schema |
| 3 | `03-EMBEDDER.md` | the center-core config (deep-link + action bridge) |
| 4 | `04-MORPHIC-PANELS.md` | selected panels wired to the input bus |
| 5 | `05-BUILD.md` | `20-BUILDS/<slug>/app.html` + `poster.png` |
| 6 | `06-VALIDATE.md` | pass/fail report |

**Before Stage 4, read `10-TEMPLATES/panels.lib.js`.** It is the real, working
implementation of the panel registry. Reuse panels from it; do not rewrite them.
**Before any second build, read `07-RETARGET.md`** — it states the invariant:
change CFG, theme, and panel selection only; never touch the Bus, the panel
contract, or the download layer.

After Stage 5, write a short build note to `20-BUILDS/<slug>/README.md` and,
if the vault has a memory/garden loop, log the panel picks so future builds
reuse proven panels.

## Slug rule

`<slug>` = kebab-case of `gpt_name`, deduped. All artifacts for one GPT live in
`20-BUILDS/<slug>/`.

## Start

Read `90-INTAKE/intake.md`. If any of the 3 required fields is blank, stop and
ask the user only for the missing field. Otherwise proceed to `01-ANALYZER.md`.
