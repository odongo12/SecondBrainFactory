---
title: The Retarget Invariant
tags: [doctrine, architecture]
---

# The Retarget Invariant

> **Change `CFG`. Change the theme. Change the panel *selection*.
> Never change the Bus, the panel contract, or the download layer.**

This one rule is the difference between a factory and a folder of one-off pages.

## What varies

| Varies per build | Never varies |
|---|---|
| `CFG.gpt` — name, url, action_base_url | the Bus |
| `CFG.inputs` — the input contract | the panel contract (`mount/render/export`) |
| `CFG.mockRun` — the domain model | the download layer |
| `CFG.promptTemplate` | the core's live/deep-link dual mode |
| the theme (palette, type) | the grid → single-column collapse |
| *which* panels from the library | *how* panels are wired |

## The proof

Three builds exist. They look nothing alike — a forest-green regulatory
instrument, a navy trading terminal, a white-and-blue research poster. Diff their
machinery and it is byte-identical. Diff their `CFG` and they share almost
nothing.

That is the invariant holding.

## Why the theme must change

Two builds that look alike defeat the purpose. An infographic's job is to be
*this* subject's interface, and a subject's world — its instruments, its
vernacular, its materials — is where a distinctive palette comes from. Shipping
the same template skin twice is the visual equivalent of skipping the analyzer.

Specifically: avoid the default AI-design tells — cream background, high-contrast
serif, terracotta accent. They appear regardless of subject, which is exactly the
problem.

Related: [[02 - Core, Ring, and Bus]], [[04 - The Morphic Panel Contract]]
