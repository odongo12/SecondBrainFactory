# Build: RNAi Precision Crop Designer

Generated from a static poster mockup — the poster is the brief; this is the
executable version of it. Archetype: `pipeline-designer` (new).

## What changed from the poster
| Poster | This build |
|---|---|
| 7-stage wheel is a picture | 7 clickable/keyboard-focusable stages; the methodology list drives it too |
| "Launch" buttons | four simulators that are always running and re-derive on every input |
| "96.3%" printed | live silencing prediction from the current construct |
| QR codes drawn | real scannable QR (segno) to the paper, the GPT, and the live app |
| "Run Full Workflow Simulation" | animates the wheel through all seven stages, then runs the model |
| static image | one shared input bus; six inputs feed everything |

## The six inputs
GC content · construct length · applied dose · BLAST stringency · field
temperature · host crop. All six write to the bus; the wheel, the predictive
model, and all four simulators subscribe.

## The four morphic simulators
1. **dsRNA design** — deterministic PRNG seeded from GC+length yields the same
   construct for the same inputs; sliding-window GC track plots underneath.
2. **Off-target** — BLAST hit count vs stringency curve, with your current
   stringency marked. Exports the whole curve as CSV.
3. **Efficacy** — dose–response gated by stability, specificity, and a
   temperature factor peaking near 26 °C. EC50 marked.
4. **Environmental impact** — soil persistence decay over 21 days, banded
   LOW/MODERATE/HIGH by non-target exposure.

## Validation (node, outside the browser)
| case | silencing | hits | specificity | stability | persistence |
|---|---|---|---|---|---|
| defaults | 49.0% | 6 | 50% | 93% | 5.2 d |
| stringency 45% | 41.9% | 18 | 25% | 93% | 5.2 d |
| stringency 95% | 63.3% | 0 | 100% | 93% | 5.2 d |
| GC 70 / 800 bp | 19.1% | 12 | 33% | 21% | 5.2 d |
| dose 120, tight | 87.0% | 0 | 100% | 100% | 4.5 d |
| field 10 °C | 41.8% | 1 | 86% | 100% | 12.4 d |

Monotonic in every expected direction.

## Going live
`mockRun` is a transparent local estimate, labeled as such in the UI. To make
the GPT authoritative inline: implement `/run` per `action.schema.json`, set
`CFG.gpt.action_base_url`, and paste the schema into the GPT's Actions config.
