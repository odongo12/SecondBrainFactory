---
name: 02-SCHEMA-FORGE
role: stage-2
read_order: 3
consumes: build.spec.json
produces: builds/<slug>/action.schema.json
---

# STAGE 2 — SCHEMA FORGE

Produce the **OpenAPI 3.1 Action schema** that (a) can be pasted into the Custom
GPT's *Actions* config so the GPT calls a real backend, and (b) is the exact
contract the infographic's center uses to call that same backend. One schema,
two consumers — this is the bridge that makes "embedded via action schema" true.

## Inputs → request body, Outputs → response

Map `build.spec.json.inputs` to a single POST `/run` operation. Each input
becomes a typed property (respect min/max/enum/unit). Map `outputs` to the
response schema.

## Template

```json
{
  "openapi": "3.1.0",
  "info": { "title": "<gpt_name> Action", "version": "1.0.0" },
  "servers": [ { "url": "<action_base_url>" } ],
  "paths": {
    "/run": {
      "post": {
        "operationId": "run<Slug>",
        "summary": "<one line from description>",
        "requestBody": {
          "required": true,
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/RunInput" } } }
        },
        "responses": {
          "200": {
            "description": "Result",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/RunOutput" } } }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "RunInput":  { "type": "object", "required": [ "..." ], "properties": { } },
      "RunOutput": { "type": "object", "properties": { } }
    }
  }
}
```

## Rules

1. `operationId` must be unique and camelCase.
2. Every property gets a `description` — the GPT uses these to decide when/how to
   call the action; be precise about units and ranges.
3. If `action_base_url` is null, still emit the schema but mark
   `"x-backend": "not-provisioned"` and set `servers[0].url` to a placeholder.
   The center will run in **deep-link-only mode** (button to the GPT) and the
   panels will use the local `mockRun()` estimator instead of a live call.
4. Constrain outputs tightly (enums for verdicts, numeric bounds for scores) so
   the infographic can render them deterministically. This mirrors the vault's
   schema-constrained-generation principle.

Write `action.schema.json`, then proceed to `03-EMBEDDER.md`.

## Backend note (for the user, not required to build the infographic)

If `action_base_url` is null and the user wants live inline answers, the minimal
backend is a FastAPI/HF Space exposing `POST /run` that validates against
`RunInput` (pydantic) and returns `RunOutput`. The same URL goes into both the
GPT's Actions config and `build.spec.json.gpt.action_base_url`. Point the user to
`src/templates/backend.stub.py`.
