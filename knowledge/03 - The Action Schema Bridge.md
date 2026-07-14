---
title: The Action Schema Bridge
tags: [architecture, custom-gpt, openapi]
---

# The Action Schema Bridge

## The constraint nobody mentions

OpenAI Custom GPTs serve `X-Frame-Options: DENY`. **You cannot iframe a Custom
GPT.** Any design that assumes "embed the GPT in the middle of the page" is dead
on arrival, and discovering this after building the layout is expensive.

## The move

Don't embed the GPT. Embed *the contract the GPT uses*.

A Custom GPT with an Action calls a backend — a plain HTTP endpoint described by
an OpenAPI schema. That schema is a public, reusable artifact. So:

```
                    ┌──────────────────┐
   Custom GPT ─────►│                  │
   (Actions config) │  POST /run       │
                    │  RunInput →      │
   Infographic ────►│  RunOutput       │
   (fetch in JS)    │                  │
                    └──────────────────┘
```

**One schema. Two front-ends.** The GPT and the infographic call the same
endpoint with the same body and get the same shape back. The infographic is not
*pretending* to be connected to the GPT — it is connected to the GPT's brain.

## The two modes

**Live mode** (`action_base_url` is set). The core `fetch`es `/run` and renders
`RunOutput` inline. The panels visualize the *real* model output.

**Deep-link mode** (no backend yet). The core runs the local estimator
(see [[06 - The Local Estimator Doctrine]]), copies a formatted prompt to the
clipboard, and opens the real GPT in a new tab. The page is fully interactive
before any backend exists — which means you can ship the infographic on day one
and wire the backend on day thirty.

## The schema is the deliverable

Every build emits `action.schema.json`. Two consumers:
1. Paste it into the Custom GPT's **Actions** config.
2. It is the request/response contract the infographic's `fetch` obeys.

Keep the property `description` fields precise — units, ranges, enums. The GPT
reads them to decide *when and how* to call the action. Vague descriptions
produce a GPT that calls the action wrongly or not at all.

## CORS

The infographic is served from a different origin than the backend. The backend
**must** send permissive CORS headers on `/run` or the browser will refuse the
call. This is the single most common reason a live-mode build silently falls back
to the estimator.

Related: [[02 - Core, Ring, and Bus]], [[10 - Deployment Paths]]
