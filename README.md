# Executable Infographic Factory

> Give the system a Custom GPT's **name, description, and URL**.
> Get back an infographic that **runs**: the GPT wired in the centre, morphic
> simulation panels around it, everything downloadable.

**The design law:** never embed the simulation or the GPT inside the image. The
infographic is a *visual interface that links to interactive experiences.* A PNG
is static — so it becomes the **entry point**, not the container.

## Live builds

| Build | Archetype | Open |
|---|---|---|
| RNAi Precision Crop Designer | `pipeline-designer` | [`docs/index.html`](docs/index.html) |
| dsRNA Biopesticide Screener | `risk-screener` | [`docs/dsrna-screener.html`](docs/dsrna-screener.html) |
| Fixture True-Odds Modeler | `quant-model` | [`docs/true-odds.html`](docs/true-odds.html) |

Each is a single self-contained file. Double-click it; no build step, no server.

## Architecture

```
        ┌─────────────────────────────────────────┐
        │  MORPHIC PANEL        MORPHIC PANEL      │  ← THE RING
        │          ┌──────────────────┐            │    simulations that
        │          │   THE CORE       │            │    transform with input
        │          │   Custom GPT     │            │    and export their state
        │          │   + controls     │            │
        │          └──────────────────┘            │
        │  MORPHIC PANEL        MORPHIC PANEL      │
        └─────────────────────────────────────────┘
                      ↑ ONE SHARED INPUT BUS ↑
```

**Custom GPTs cannot be iframed** (`X-Frame-Options: DENY`). So the core doesn't
embed the GPT — it embeds *the contract the GPT uses*: the OpenAPI Action schema.
One schema, two front-ends. The GPT and the infographic call the same `/run`
endpoint. See [`knowledge/03 - The Action Schema Bridge.md`](knowledge/03%20-%20The%20Action%20Schema%20Bridge.md).

## Repository layout

```
knowledge/   13 Obsidian notes — the doctrine. Start at "00 - Second Brain MOC".
src/system/  the OS Claude Code reads, in order. Boot from OS.md.
src/templates/  app skeleton, panel library, OpenAPI template, FastAPI stub.
builds/      generated apps + their action schemas + build specs.
docs/        GitHub Pages — the live builds and the knowledge PDF.
```

## Run the factory

1. Open this repo as an **Obsidian vault** and as a **VSCode workspace** with Claude Code.
2. Edit `src/intake.md` — three fields.
3. Tell Claude Code: *"Read src/system/OS.md and build the infographic from the intake note."*
4. It runs six stages and writes `builds/<slug>/app.html`.

## The invariant

> Change `CFG`. Change the theme. Change the panel *selection*.
> Never change the Bus, the panel contract, or the download layer.

That rule is the difference between a factory and a folder of one-off pages.

## Knowledge base (PDF)

[`docs/Second-Brain-Executable-Infographic-Factory.pdf`](docs/Second-Brain-Executable-Infographic-Factory.pdf) — the full doctrine, 10 pages.

## Status

Three builds shipped. Honest accounting of what is *not* solved lives in
[`knowledge/12 - Open Threads.md`](knowledge/12%20-%20Open%20Threads.md) — notably
`map-canvas` (blocking any `geo-ops` build) and multi-GPT infographics.
