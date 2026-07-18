# Build: Vector Trial Governance Navigator

Executable infographic for the **Vector Trial Governance Navigator** Custom
GPT — a static-knowledge assistant grounded in the Oxitec/MosquitoMate
2009-2020 US regulatory and public-engagement precedent record (Schairer et
al. 2021, *Pathogens and Global Health*). Archetype: `pipeline-designer`
(regulatory pipeline shape for the layout) straddled with `risk-screener`
panels (controversy-risk gauge/factor-bars), per `01-ANALYZER.md`'s explicit
straddling rule.

## Mode: deep-link only (no live backend)

This GPT is deliberately a static-knowledge assistant — it answers from an
uploaded `distillate.pdf` knowledge file, not a live API. So `action_base_url`
is `null` and the center runs in **deep-link mode**: it deep-links to the
real GPT (`CFG.gpt.url`) and copies a formatted prompt to the clipboard, and
for inline responsiveness it uses the deterministic local historical-pattern
estimator in `CFG.mockRun()` — clearly labeled as a local estimate, never
presented as the GPT's authoritative answer, per the Local Estimator
Doctrine.

**Before using this**: paste your real ChatGPT GPT URL into `CFG.gpt.url`
near the bottom of `app.html` (search for `PASTE_YOUR_CHATGPT_G_URL_HERE`).
Until then, a visible amber warning banner in the app tells you so, and
"Open in ChatGPT" is a placeholder link.

## The four inputs

Product mechanism framing (pesticide-like vs. drug-like) · population effect
(suppression vs. self-propagating gene drive) · planned public engagement
mode (informational-only vs. designated input channel vs. deliberative
survey) · anticipated local opposition signal (0-100%). All four write to
the shared input bus; every panel reads `result` (derived from `mockRun`)
and re-renders.

## The five morphic panels (all reused from `src/templates/panels.lib.js`, none newly invented)

1. **Regulatory pipeline** (`stage-wheel`) — a 4-stage clickable wheel
   (jurisdiction determination → federal review → public comment & local
   engagement → field-trial authorization) that every historical filing
   passed through in some form. Independent of the four main inputs —
   explore it by clicking; it reads/writes its own `stage` bus key.
2. **Controversy-risk gauge** (`verdict-gauge`) — 0-1 score, LOW/MODERATE/
   HIGH band.
3. **Risk factor contributions** (`factor-bars`) — the four weighted inputs
   driving the score.
4. **Years-to-resolution decay** (`decay-curve`) — retargeted via
   `timelineYears` as the decay rate field, banded by the controversy band.
5. **Matched precedent case detail** (`outcome-table`) — real historical
   fields (dates, comment counts, referendum, outcome) for whichever
   precedent (MosquitoMate/Debug Fresno or Oxitec/OX513A) the current inputs
   most resemble. Data is the actual documented record, not invented.

## mockRun — the one piece of real domain thinking

Deterministic, transparent, linear-weighted. Pesticide-like framing → EPA
direct pathway, ~6yr baseline (mirrors MosquitoMate); drug-like framing →
USDA→FDA→EPA bounce risk, ~9yr baseline (mirrors OX513A). Informational-only
engagement and self-propagating gene-drive status both add time and
controversy-risk. See the function in `app.html` (search `mockRun`) for the
exact weights. **This is a historical-pattern match, not a regulatory
prediction** — the app states this explicitly in its answer text and in the
footer.

## Bugs caught and fixed during Stage 6 validation (via real headless-Chromium screenshots, not just code review)

1. **verdict-gauge arc direction** — the copied reference implementation's
   angle math (`Math.PI - (i/180)*Math.PI`) swept the semicircle through the
   *downward* canvas direction instead of upward, since canvas angle
   convention is clockwise with +y down. With the gauge's pivot near the
   bottom of its canvas, almost the entire arc rendered off-canvas — only
   thin end-caps at the left/right were visible. Fixed by sweeping from `PI`
   to `2PI` instead of `PI` to `0` (same fix applied to the needle angle).
   This is worth flagging back to the shared `panels.lib.js`/template if a
   future build hits the same geometry.
2. **stage-wheel label overlap** — the default `title.split(" ").slice(0,2)`
   truncation produced long two-word labels ("Jurisdiction determination",
   "Field-trial authorization") that overflowed their wedge at the shared
   font size. Added an explicit 4th tuple field (short label) per stage
   rather than relying on generic truncation.
3. **factor-bars left-label clipping** — two of the four factor names
   ("Informational-only meeting mismatch", "Self-propagating reversibility
   question") were long enough to clip against the canvas's left edge at
   the original 132px label margin. Shortened the factor names and widened
   the margin (132px → 157px, font 11px → 10.5px).

All three were caught by actually rendering the page with headless Edge
(`msedge --headless --disable-gpu --screenshot`) and inspecting the output,
not by code review alone — the code was syntactically valid and would have
shipped visibly broken otherwise.

## Mobile / narrow-viewport note

The available headless-Chromium tooling in this environment floors its
effective viewport at ~504px regardless of the requested `--window-size`
(a known headless quirk, not a page bug) — confirmed via a `scrollWidth`
vs. `innerWidth` measurement injected into the page, not just a screenshot
(a screenshot alone cannot distinguish real overflow from a wide-but-
correctly-fitting layout at a fixed capture size). At that ~504px width the
layout is confirmed non-overflowing (`scrollWidth` 489 ≤ `innerWidth` 504)
and correctly single-column with the core first. Defensive CSS
(`min-width:0` on grid items, `flex-wrap` on the core header, 100%-width
form controls) is in place for narrower real devices, but true sub-500px
behavior wasn't independently confirmed by this tooling — worth a manual
phone check if you have one handy.

## Live backend + chat (implemented)

`backend/app.py` is a small FastAPI service implementing `POST /run` (the
same `RunInput`/`RunOutput` contract as `action.schema.json`) and a new
`POST /chat` for free-text conversation — both grounded in the same
`gpt-config.md` instructions + `distillate.md` knowledge the actual GPT
uses, via a direct call to the Anthropic API.

**Important honesty note**: there is no public API to invoke a specific
ChatGPT Custom GPT programmatically — OpenAI only exposes Custom GPTs
through the ChatGPT UI. This backend calls Claude directly with the GPT's
own instructions + knowledge file as its system prompt, which behaves
equivalently but is technically a separate model call, not literally the
hosted GPT object. `CFG.gpt.action_base_url` is now set to
`http://localhost:8766`, so the app runs in **live mode**: the "Estimate"
button calls `/run` for real (falling back to the local `mockRun` estimate
only if the backend errors), and the new chat box at the bottom of the core
card calls `/chat`.

### Setup
1. `cd backend && pip install -r requirements.txt` (already done in this
   session's environment).
2. `copy .env.example .env` and put a real `ANTHROPIC_API_KEY` in it.
3. `start-backend.bat` (or `uvicorn app:app --host 127.0.0.1 --port 8766`)
   — refuses to start without a `.env` file present, as a reminder.
4. Open `app.html` — the mode badge reads "LIVE · ACTION"; a red banner
   appears if the backend isn't reachable or has no key configured (tested:
   confirmed via direct `curl` that `/healthz`, `/run`, and `/chat` all
   respond correctly, `/run`/`/chat` fail cleanly with a clear message
   rather than crashing when no key is set — full LLM-quality output
   wasn't independently verified in this session since no real API key was
   available to test with).

### Wiring the real ChatGPT GPT to this same backend (done — needs one manual step from you)

The infographic reaches `localhost:8766` because it runs in *your* browser,
but OpenAI's Actions infrastructure runs in the cloud and cannot reach your
localhost. So the backend is now also exposed publicly via a **Cloudflare
quick tunnel** (`cloudflared`, installed to `C:\Users\HP\bin\cloudflared.exe`
— no account needed for this quick-tunnel mode).

**Tested end-to-end**: `https://<random>.trycloudflare.com/healthz` and
`/run` both confirmed reaching the local backend through the tunnel, with
the shared-secret auth (see below) correctly enforced at every hop.

Two scripts in `backend/`:
- **`start-tunnel.bat`** — starts the tunnel (run this *after*
  `start-backend.bat` is already up) and prints a URL like
  `https://random-words.trycloudflare.com`.
- This URL is **temporary and changes every restart** (quick tunnels
  don't need a Cloudflare account, but don't get a stable custom domain
  either). Whenever you restart it, update `action.schema.json`'s
  `servers[0].url` and repeat the manual step below.

**The one step I cannot do for you**: there is no API for editing a Custom
GPT's configuration — pasting the Action schema into the ChatGPT builder is
a manual, UI-only step:
1. In ChatGPT, open your GPT → **Configure** → **Create new action**.
2. Paste the contents of `action.schema.json` into the schema box.
3. Authentication → **API Key** → Auth Type **Custom** → Header name
   `X-Navigator-Secret` → value = the same `NAVIGATOR_SHARED_SECRET` in
   `backend/.env`.
4. Save. The real hosted GPT can now call `/run` and `/chat` on your local
   backend through the tunnel, at the same time the local infographic calls
   it directly — one backend, two simultaneous callers.

### Security: the shared secret

`backend/.env`'s `NAVIGATOR_SHARED_SECRET` gates `/run` and `/chat` (not
`/healthz`) behind an `X-Navigator-Secret` header — required once the
backend is reachable from the public internet, so random traffic can't spend
your Anthropic API key. **Tested**: requests without the header get a clean
401; requests with the correct header pass through (confirmed both directly
against `localhost:8766` and through the public tunnel URL). The local
`app.html` already sends this header automatically (`CFG.gpt.shared_secret`).
If you regenerate the secret, update it in three places: `backend/.env`,
`app.html`'s `CFG.gpt.shared_secret`, and the GPT's Actions auth config.

### Local server + backend together

Both pieces auto-manage their own lifecycle so nothing needs to run
permanently: the static file server (`serve.py`) idle-shuts-down after 15
minutes; the backend (`start-backend.bat`) you start/stop manually since
it's something you'd deliberately spin up to test live chat, not something
meant to run passively.

## The GPT linking back to this app (localhost, idle-auto-shutdown)

A Custom GPT runs in OpenAI's cloud — it cannot start, stop, or detect
anything on your machine. What it *can* do is put a plain link in its reply
(`http://localhost:8765/app.html`); since you read that reply in a browser
on your own computer, clicking it opens *your* localhost, no cloud
involvement required. The only thing that can't be automatic is the local
server already running when you click it.

To approximate "only active while you're using the GPT" without needing the
GPT to control anything:

- **`serve.py`** — a small static server for this folder on port 8765 that
  **auto-shuts-down after 15 minutes of no requests** (configurable: `python
  serve.py 1800` for 30 min). Verified: it correctly stops accepting
  connections and releases the port once idle.
- **`start-navigator.bat`** — double-click to start the server and open
  `app.html` in your browser.
- **`stop-navigator.bat`** — stops it immediately instead of waiting for
  the idle timeout.

The GPT's instructions (`ArbitrageVault/gpts/vector-trial-governance-navigator/gpt-config.md`)
now include a line letting it offer this link once per conversation,
explicitly phrased as something that only works if you've started the
server yourself — it never claims the GPT can do that for you.

## Next steps for the user

1. Open `app.html` locally (double-click — no build step).
2. Once you've created the GPT in ChatGPT's builder (name/description/
   instructions/knowledge-file/logo already handed off separately), paste
   its `https://chatgpt.com/g/g-...` URL into `CFG.gpt.url`.
3. Host it if you want a shareable link: GitHub Pages or an HF Static Space
   both work for a single self-contained HTML file — see
   `knowledge/10 - Deployment Paths.md`.
