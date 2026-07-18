# Build: GPT Portfolio Dashboard

A new archetype: **`portfolio-dashboard`** — not a single-GPT executable
infographic, but a meta-directory over every GPT the user owns. Each card
is independent: it pings its own backend (if it has one), deep-links to the
real hosted GPT, and links out to that GPT's own dedicated `app.html` (built
separately via the normal Six-Stage Pipeline, one per GPT).

## Why this doesn't reuse the Bus/panel/download machinery

Every other build in this factory shares one GPT's input/output contract
across its panels (`07-RETARGET.md`'s invariant: change CFG, theme, and
panel selection, never the Bus). A portfolio dashboard has no single
contract to share — **RNAi Precision Crop Designer OS** answers `dsRNA
design / off-target screening / simulate / vault.*` while **Vector Trial
Governance Navigator** answers `run / chat`. Forcing both into one shared
input bus would misrepresent both GPTs. So this build is deliberately
simpler: independent cards, no shared state, each linking out to its own
already-correct interface rather than reimplementing it.

## The four cards, as of this build

| GPT | Status | Backend | Own interface |
|---|---|---|---|
| Vector Trial Governance Navigator | **live** | `localhost:8766` (local FastAPI, tested this session — auth, tunnel, everything) | `builds/vector-trial-governance-navigator/app.html` |
| RNAi Precision Crop Designer OS | **live** | `https://rnai-crop-designer-latest.onrender.com` (confirmed reachable via curl — `HTTP 200` on `/healthz` and `/openapi.json` during this build) | `builds/rnai-precision-crop-designer/app.html` |
| ACI-GPT | not connected | none found in this workspace | none found |
| ForensicAI GPT | not connected | none found (two HF Spaces referenced in project history but no live URL located) | none found |

All four `gpt_url` fields are placeholders (`PASTE_YOUR_CHATGPT_G_URL_HERE`)
— I don't fabricate URLs I haven't confirmed. Paste each GPT's real
`chatgpt.com/g/g-...` URL into the `GPTS` array near the bottom of
`app.html` once you have it; the "Open in ChatGPT" button activates
automatically (checks for that exact placeholder string).

## Live-status ping — a real CORS finding, not a cosmetic choice

Checked via `curl -I` during this build: the RNAi backend does **not** send
`Access-Control-Allow-Origin`. A strict `fetch(url, {mode:"cors"})` from this
`file://` page would throw for that reason alone — reporting a perfectly
live server as OFFLINE. Fixed by pinging with `{mode:"no-cors"}` instead: the
response is opaque (status unreadable), but a *resolved* promise still
reliably means something answered, while a *rejected* one (DNS failure,
connection refused, timeout) means genuinely unreachable. That distinction
is what each card's badge is actually based on.

Note: a static screenshot taken immediately on page load will likely show
"CHECKING…" for both live cards — the ping resolves in under a second in an
actual browser session, this is just a timing artifact of headless
screenshot tooling used to validate layout, not a real delay.

## Adding a fifth GPT

Append one object to the `GPTS` array in `app.html` — `name`, `description`,
`healthz_url` (or `null` if it has no live backend yet), `own_app` (relative
path to its dedicated `app.html`, or `null`), `gpt_url`, `note`. No schema,
no Bus wiring, no shared contract required.

## Next steps for the user
1. Open `app.html` locally (double-click).
2. Paste real `chatgpt.com/g/...` URLs into the `GPTS` array for any card
   that has one now.
3. If ACI-GPT or ForensicAI GPT get a real live backend later, add their
   `healthz_url` and `own_app` (build them their own dedicated infographic
   first, the normal way, then link it here).
