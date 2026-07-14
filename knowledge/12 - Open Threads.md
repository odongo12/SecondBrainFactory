---
title: Open Threads
tags: [roadmap, unsolved]
---

# Open Threads

Honest accounting of what is not solved.

## Panels described but not written
`map-canvas`, `route-list` — the biggest hole. A `geo-ops` build (border
management, route planning) is blocked on these. `diff-view`, `token-meter`,
`concept-graph`, `progress-meter`, `timeline-canvas` are also outstanding.

## Poster export is browser-limited
Rasterizing the full app container to PNG via `foreignObject` is fragile across
browsers. Current fallback: tell the user to screenshot. A real fix likely means
drawing the poster layout directly to canvas rather than serializing the DOM —
which means the poster becomes its own render target, not a snapshot. Arguably
that is the more honest architecture anyway.

## Prompt prefill into ChatGPT is unreliable
Deep-link mode copies a formatted prompt to the clipboard and opens the GPT. There
is no dependable URL-prefill for Custom GPTs. The clipboard hop is a papercut and
the user may not notice the copy happened. Needs a visible confirmation.

## Multi-GPT builds
The original brief allowed *multiple* GPTs as input. Every build so far has one.
A two-GPT infographic — one designing, one screening — would need a core that
routes inputs to the right backend and a bus that namespaces results. Not hard;
not yet done.

## The estimator/model boundary needs enforcement
Nothing currently *stops* someone shipping a `mockRun` presented as the real
model. The doctrine ([[06 - The Local Estimator Doctrine]]) is a norm, not a
mechanism. A lint rule — "if `action_base_url` is null, the answer element must
contain the string 'local estimate'" — would make it structural.

## Accessibility beyond the floor
Keyboard focus and reduced motion are handled. Screen-reader narration of a canvas
panel that just morphed is not. A live region announcing "silencing efficiency now
63 percent" would matter for the educational use case this is aimed at.
