---
title: Core, Ring, and Bus
tags: [architecture]
---

# Core, Ring, and Bus

Every build has the same anatomy. Three parts, one mechanism connecting them.

```
        ┌─────────────────────────────────────────┐
        │  MORPHIC PANEL        MORPHIC PANEL      │  ← THE RING
        │                                          │    simulation and model
        │          ┌──────────────────┐            │    interfaces that
        │          │   THE CORE       │            │    transform with input
        │          │   Custom GPT     │            │    and export their state
        │          │   + input        │            │
        │          │     controls     │            │
        │          └──────────────────┘            │
        │  MORPHIC PANEL        MORPHIC PANEL      │
        └─────────────────────────────────────────┘
                      ↑ THE BUS connects all of it ↑
```

## The core
The Custom GPT's presence on the page. It renders the input contract as controls
and holds two routes to the GPT: a live call to its Action backend, and a
deep-link to the full conversational GPT. See [[03 - The Action Schema Bridge]].

## The ring
Three to five **morphic panels** — simulations, charts, models. Not decoration.
Each one subscribes to the bus and re-renders on every change. Each exports its
current state. See [[04 - The Morphic Panel Contract]].

## The bus
The whole system in twelve lines. One shared state object, a subscriber list, and
a `set` that notifies everyone.

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

This is why "user inserts inputs, which is reflected in the interfaces" is true
rather than aspirational. There is exactly one source of truth. A panel cannot
drift out of sync with the core because it has no state of its own to drift with.

## The rule that keeps it honest
**Every panel must read at least one bus key.** A panel that renders the same
thing regardless of input is a picture, and pictures belong in [[01 - The Design Law]]'s
list of failures. The validation gate rejects them.

Related: [[04 - The Morphic Panel Contract]], [[07 - The Retarget Invariant]]
