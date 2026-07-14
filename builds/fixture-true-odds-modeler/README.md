# Build: Fixture True-Odds Modeler (retarget proof)

**Archetype:** quant-model. **Mode:** deep-link.
**Panels:** param-sliders, distribution-curve, sensitivity-heat, outcome-table —
all pulled unchanged from `10-TEMPLATES/panels.lib.js`.

Demonstrates the OS invariant: only `CFG`, the theme, and the panel *selection*
changed from the dsRNA build. Bus, panel contract, core, and download layer are
byte-identical machinery.

`mockRun` runs a bivariate Poisson over a 10x10 scoreline grid, normalizes to
1X2, and reports fair vs post-vig decimal odds. Validated numerically:
at defaults λ_home=1.77, λ_away=1.02 → P(H)=.550 P(D)=.233 P(A)=.217 (sums to 1).
