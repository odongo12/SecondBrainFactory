---
title: Case Study — RNAi Precision Crop Designer
tags: [case-study, rnai, biosafety]
---

# Case Study — RNAi Precision Crop Designer

A static poster went into the factory. An executable infographic came out. This
note records what changed, because the delta *is* the argument.

## The delta

| In the poster | In the build |
|---|---|
| 7-stage wheel is an illustration | seven clickable, keyboard-focusable stages; the methodology list drives the same wheel |
| four **Launch** buttons | four simulators already running, re-deriving on every input |
| **96.3%** printed as text | live silencing prediction from the current construct |
| QR codes are drawn squares | real scannable QR to the paper, the GPT, and the live app |
| **Run Full Workflow Simulation** | animates the wheel through all seven stages, then runs the model |
| one static image | one shared bus; six inputs feed everything |

## The input contract

GC content · construct length · applied dose · BLAST stringency · field
temperature · host crop. Six inputs, one bus, four panels plus the wheel plus the
predictive-model readout all subscribing.

## The four morphic panels

1. **dsRNA design** — a PRNG seeded from GC + length, so the same inputs always
   produce the *same* construct. Reproducible, not decorative. A sliding-window GC
   track plots beneath the sequence.
2. **Off-target** — BLAST hit count against stringency, with the current
   stringency marked. Exports the whole curve.
3. **Efficacy** — dose–response gated by stability, specificity, and a temperature
   factor peaking near 26 °C. EC50 marked.
4. **Environmental impact** — soil persistence decay over 21 days, banded
   LOW / MODERATE / HIGH by non-target exposure.

## Validation (run in node, before shipping)

| case | silencing | off-target hits | specificity | stability | persistence |
|---|---|---|---|---|---|
| defaults | 49.0% | 6 | 50% | 93% | 5.2 d |
| stringency 45% | 41.9% | 18 | 25% | 93% | 5.2 d |
| stringency 95% | 63.3% | 0 | 100% | 93% | 5.2 d |
| GC 70 / 800 bp | 19.1% | 12 | 33% | 21% | 5.2 d |
| dose 120, tight | 87.0% | 0 | 100% | 100% | 4.5 d |
| field 10 °C | 41.8% | 1 | 86% | 100% | 12.4 d |

Monotonic in every direction it should be: tightening stringency raises efficacy
and collapses hits; a bad GC on an over-long construct craters stability; a cold
field triples soil persistence.

## The honest caveat

The efficacy model here is a **placeholder estimator**, labeled as such in the UI.
The real model — the one behind the poster's 96.3% — belongs behind `/run`, where
both the GPT and the infographic can reach it. See
[[06 - The Local Estimator Doctrine]] and [[03 - The Action Schema Bridge]].

## What it contributed back

A new archetype (`pipeline-designer`) and three new library panels
(`stage-wheel`, `sequence-track`, `decay-curve`). The next staged-workflow GPT
gets them free.
