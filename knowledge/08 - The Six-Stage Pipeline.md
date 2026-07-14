---
title: The Six-Stage Pipeline
tags: [process, claude-code]
---

# The Six-Stage Pipeline

What Claude Code executes when pointed at an intake note. Each stage consumes the
previous stage's output. The order is not negotiable.

| Stage | Reads | Emits |
|---|---|---|
| **0 · Intake** | the user's 3 fields | — |
| **1 · Analyzer** | intake | `build.spec.json` — archetype, inputs, outputs, panel picks |
| **2 · Schema forge** | build.spec | `action.schema.json` — OpenAPI 3.1 |
| **3 · Embedder** | build.spec + schema | the core config: bus, live/deep-link modes |
| **4 · Morphic panels** | build.spec | selected panels, wired to the bus |
| **5 · Build** | everything | `app.html` + `README.md` |
| **6 · Validate** | app.html | pass/fail report + ledger entry |

## The user supplies three fields

```yaml
gpt_name:        "…"
gpt_description: "…"
gpt_url:         "https://chatgpt.com/g/…"
action_base_url: ""   # optional
```

That is the entire input surface. No schema, no HTML, no JS. Everything else is
inferred — which is the point: the analyzer's inference *is* the product.

## Where the thinking actually goes

Stages 2–5 are largely mechanical once Stage 1 has decided the archetype and the
input contract. The intellectual work is concentrated in:
- **Stage 1**, choosing the archetype and the input contract, and
- the `mockRun` written during Stage 3 (see [[06 - The Local Estimator Doctrine]]).

Get those two right and the rest assembles.

## Write it down

Stage 6 appends to the **panel ledger**: which panels this build used, which new
ones it added to the library. Without the ledger, the library does not compound —
the next build reinvents rather than inherits.

Related: [[05 - The Archetype Taxonomy]], [[11 - The Validation Gate]]
