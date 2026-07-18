---
title: Second Brain — Executable Infographic Factory (MOC)
tags: [moc, second-brain, custom-gpt, infographic]
status: living
---

# Second Brain — Executable Infographic Factory

> **The one sentence.** Give the system a Custom GPT's name, description, and URL; get back an infographic that *runs*: the GPT wired in the centre, morphic simulation panels around it, everything downloadable.

This is the map of content. Each note below is a single idea that stands on its own. Follow the links.

## The doctrine
- [[01 - The Design Law]] — never embed the simulation in the image
- [[06 - The Local Estimator Doctrine]] — why every build ships a `mockRun`
- [[07 - The Retarget Invariant]] — what may change, what may never change

## The architecture
- [[02 - Core, Ring, and Bus]] — the three-part anatomy
- [[03 - The Action Schema Bridge]] — one contract, two front-ends
- [[04 - The Morphic Panel Contract]] — the interface every panel implements
- [[05 - The Archetype Taxonomy]] — how a GPT description becomes a panel set

## The practice
- [[08 - The Six-Stage Pipeline]] — what Claude Code actually executes
- [[11 - The Validation Gate]] — what must pass before a build ships
- [[10 - Deployment Paths]] — local, GitHub Pages, HF Space

## The evidence
- [[09 - Case Study — RNAi Precision Crop Designer]] — a static poster, executed
- [[12 - Open Threads]] — what is not solved yet

## Provenance
Built July 2026. Reference builds: a regulatory risk screener, a football
odds model, the RNAi crop designer, and Vector Trial Governance Navigator
(the first build with a real, tested live backend — local FastAPI + a
Cloudflare tunnel + shared-secret auth, called simultaneously by the local
infographic and the actual hosted ChatGPT GPT's Action). All share identical
core machinery — that is the claim this vault exists to defend. One build
breaks it on purpose: `builds/portfolio-dashboard/` is a directory over
every GPT the user owns, not a single-GPT infographic — see [[05 - The Archetype Taxonomy]]'s
note on why it doesn't use the shared Bus.
