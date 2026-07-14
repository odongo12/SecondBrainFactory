---
title: The Design Law
tags: [doctrine, principle]
---

# The Design Law

> **Never embed the simulation, model, or GPT inside the image. Make the infographic a visual interface that links to interactive experiences.**

A PNG or JPEG is static. That is not a defect to be engineered around — it is the
correct role. The image's job is to be the **entry point**, not the container.

## Why this matters more than it sounds

The tempting failure is to try to cram interactivity into the artifact: animated
GIFs, embedded video of a simulation, a screenshot of a chart with a caption
saying "interactive version available." Each of these degrades the thing it
imitates and teaches the reader that the interactivity is decorative.

The inversion: build the **live app first** (`app.html`), and let the static
image be an *export* of it. The poster is downstream of the interface, not
upstream. A QR code or a link on the poster routes back to the live thing.

## The test

Point at any element of the infographic and ask: *if I click this, does something
happen?* If the honest answer is "no, that's a picture of a button," the design
law has been violated — and the reader will find out, which is worse than never
having promised.

See [[09 - Case Study — RNAi Precision Crop Designer]] for what this looks like
when a static poster is put through the factory.

## Consequences
- The deliverable is `app.html`, not a raster file.
- The poster PNG is generated *from* the app.
- Every affordance in the layout is wired or removed. No exceptions.

Related: [[02 - Core, Ring, and Bus]], [[11 - The Validation Gate]]
