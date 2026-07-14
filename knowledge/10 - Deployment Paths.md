---
title: Deployment Paths
tags: [deployment, ops]
---

# Deployment Paths

`app.html` is a single self-contained file with no build step. That constraint
buys a lot of deployment freedom.

## The infographic

| Path | How | Good for |
|---|---|---|
| **Local** | double-click the file | review, offline demo, air-gapped settings |
| **GitHub Pages** | commit to `/docs` or `gh-pages`, enable Pages | free, versioned, public |
| **HF Static Space** | create a Static Space, push `app.html` as `index.html` | free, sits next to the backend |
| **Own domain** | drop the file anywhere that serves static assets | branding, permanent QR targets |

## The backend (only for live mode)

A FastAPI app exposing `POST /run`, validating against `RunInput`, returning
`RunOutput`. Deploy on a HuggingFace Docker Space or any host.

**Two things that will bite you:**
1. **CORS.** The infographic is a different origin. Without permissive CORS on
   `/run`, the browser blocks the call and the build silently falls back to the
   estimator. Set it explicitly.
2. **The same URL goes in two places** — the GPT's Actions config *and*
   `CFG.gpt.action_base_url`. Update one, forget the other, and the GPT and the
   infographic quietly disagree about reality.

## The QR codes

Generate them at build time (`segno`, pure Python, inline SVG data-URI — no CDN,
no network at render time). Point them at the *live app*, not at the poster. A QR
code that leads back to a picture is a joke the reader will get.

## Versioning

The infographic is a document *and* a program. Tag releases. A reader who scans a
QR in a printed poster next year should land on something that still runs — which
means the deployed `app.html` needs a stable URL and the backend needs a stable
contract. Breaking `RunInput` breaks every poster ever printed.

Related: [[03 - The Action Schema Bridge]], [[01 - The Design Law]]
