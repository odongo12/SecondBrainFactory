---
name: 03-EMBEDDER
role: stage-3
read_order: 4
consumes: build.spec.json, action.schema.json
produces: center-core config injected into app.html
---

# STAGE 3 — EMBEDDER (the center core)

The center is the Custom GPT's presence on the page. It is NOT an iframe of the
GPT (blocked by X-Frame-Options). It is a control surface with two modes,
resolved at build time from whether `action_base_url` exists.

## Mode A — Live bridge (action_base_url present)

The center renders the input contract as controls. On submit it calls the GPT's
backend directly:

```js
async function runGPT(inputs) {
  const res = await fetch(`${CFG.action_base_url}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputs)
  });
  if (!res.ok) throw new Error(`backend ${res.status}`);
  return res.json(); // conforms to RunOutput
}
```

The returned `RunOutput` is (1) rendered in the center as the GPT's answer and
(2) pushed onto the input bus as `result.*` so panels can visualize the real
output, not just the inputs. A "Open full GPT ↗" link to `gpt_url` is always
present for the full conversational experience.

## Mode B — Deep-link + local estimator (no backend)

The center still renders the controls and a prominent "Open in ChatGPT ↗"
button that deep-links to `gpt_url` with inputs pre-filled where possible:

```js
// ChatGPT supports a ?q= style prefill on some entry points; when unsupported,
// copy a formatted prompt to clipboard and open the GPT.
function openGPT(inputs) {
  const prompt = CFG.promptTemplate(inputs);
  navigator.clipboard?.writeText(prompt);
  window.open(CFG.gpt_url, "_blank", "noopener");
}
```

For inline responsiveness without a backend, the center calls a deterministic
`mockRun(inputs)` — a small local function the ANALYZER derives from the
archetype (e.g. a logistic estimator for risk-screeners). Clearly label panels
as "local estimate" so the user knows the authoritative answer is in the GPT.

## The input bus (shared state — "reflected in the interfaces")

```js
const Bus = (() => {
  const state = {}; const subs = [];
  return {
    set(patch){ Object.assign(state, patch); subs.forEach(fn => fn(state)); },
    get(){ return {...state}; },
    subscribe(fn){ subs.push(fn); fn(state); }
  };
})();
```

Center writes to the bus on every input change (debounced) AND on every result.
Every morphic panel subscribes. This single mechanism is what makes the
surrounding graphics transform with user input.

## Config object handed to the template

```js
const CFG = {
  gpt_url, action_base_url, mode /* "live" | "deeplink" */,
  inputs, outputs, promptTemplate, mockRun
};
```

Proceed to `04-MORPHIC-PANELS.md`.
