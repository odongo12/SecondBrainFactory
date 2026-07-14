---
name: 07-RETARGET
role: reference
read_order: 8
---

# RETARGETING — how one OS serves any Custom GPT

Two reference builds exist. They share **100% of the machinery** and differ only
in `CFG` + panel selection + theme. Read both before building a third.

| | `dsrna-biopesticide-screener` | `fixture-true-odds-modeler` |
|---|---|---|
| archetype | risk-screener | quant-model |
| inputs | 3 sliders + 1 enum | 4 sliders |
| mockRun | weighted logistic → score/band | Poisson bivariate → 1X2 probabilities |
| panels | verdict-gauge, factor-bars, threshold-slider-curve, case-table | param-sliders, distribution-curve, sensitivity-heat, outcome-table |
| theme | molecular-bio instrument (forest/teal) | trading terminal (navy/sodium amber) |
| shared | Bus, panel contract, download layer, core (live+deep-link), grid | same |

## Retarget checklist

1. **Do NOT write new panel code first.** Open `10-TEMPLATES/panels.lib.js` and
   check the registry. Reuse beats reinvent — a reused panel is already
   validated. Only write a new panel if the archetype genuinely needs a view the
   library lacks, and then append it to the library + log it in the ledger.
2. Write `CFG` only: `gpt{name,url,action_base_url}`, `inputs[]`, `mockRun()`,
   `promptTemplate()`. Everything else is machinery — leave it alone.
3. `mockRun` is the one piece of real domain thinking per build. It must be
   **deterministic, transparent, and labeled as a local estimate**. It exists so
   the app is fully interactive before any backend exists. It is never presented
   as the GPT's authoritative answer.
4. Pick a theme from the domain. Two builds must not look alike — that's the
   point of an infographic. Never ship the generic cream/serif/terracotta look.
5. Run `06-VALIDATE.md`. Log the build in `panel-ledger.md`.

## The invariant

> Change `CFG`. Change the theme. Change the panel *selection*.
> Never change the Bus, the panel contract, or the download layer.

That invariant is what makes this a factory rather than a pile of one-off pages.
