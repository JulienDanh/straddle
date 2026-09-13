---
name: add-range
description: Load when the user pastes a GTO Wizard range (range-view copy) or asks to add/update a solved flop or preflop stack entry in the range store (packages/ranges/data). Also when reviewing or asking how stored ranges are formatted.
---

# Add Range

Store a GTO Wizard paste into the range store. The store holds the raw paste
verbatim — all conversion happens in the app at load time. Never store
conditional frequencies, divided values, or solver output.

## Data model

- Store files are grouped: shared `title`/`position` once at the top, then
  `stacks`: one entry per depth (`type`, `subtitle`, `stack`, `actions`,
  `sizings`).
- Postflop children nest under their preflop stack entry's `postflop` array
  in the same file (e.g. `packages/ranges/data/utg/rfi.json`, stack 40),
  matched by `id` = board ranks lowercased (Kh8h3c -> "k83").
- Child fields are minimal: `id`, `label` (board with suits), `line` (e.g.
  "Cbet vs BB call"), `actions`, `sizings` (bet size in bb).
  title/subtitle/type/stack/position and the Wizard link are NOT stored —
  the app derives them at load (`materializeChild`: c-bet title from the
  parent position, texture subtitle from the label; `flopUrl` builds the
  link from the board texture and the parent open size).
- `actions` hold the raw Wizard range-view copy verbatim (open-weight-scaled:
  open weight x conditional strategy). Keep the pasted frequencies as copied;
  normalize only whitespace ("combo:freq,combo:freq").
- The app converts at load (`toConditional` in design-system
  `src/data/ranges/types.ts`): divides by the parent's `actions.raise`
  weights, rounds to 4dp, clamps >= 0.9995 to 1, and synthesizes the missing
  bet/check complement — so a bet-only paste is fine.

## Flop procedure

Ask for the bet size in bb if not given (pastes do not carry their size).
Then, with python3 (run via bash):

1. Load `utg/rfi.json`, find the stack-40 entry in `stacks`, parse
   `actions.raise` into per-combo weights.
2. Expected combos = raise combos minus combos blocked by the board (any
   combo containing a board card cannot exist). Paste must cover exactly —
   refuse on missing/extra. Extra combos suggest the BB's flop-decision
   paste; the UTG c-bet node is needed.
3. Weighted-format check: multi-action pastes sum to the open weight per
   combo (+-0.002); single-action values must not exceed it. Refuse
   conditional strategies (sums ~1) — they would be double-converted.
4. Store verbatim; children carry only id/label/line/actions/sizings (the
   Wizard link is built at load — never store it); `sizings` = {"bet": <bb>}.
5. Write with `json.dumps(indent=2, ensure_ascii=True) + "\n"` so re-running
   is a byte-identical no-op.
6. Report the weighted shares for page takeaways:
   sum(weight x conditional) / sum(weight) over the pasted combos, where
   conditional = paste/weight (clamped >= 0.9995 to 1). NOT the share of 1326.

The Wizard link is built at load (flopUrl) — the URL pattern is
`...MTTGeneral_8m&depth=40.125&stacks=40.125 x8&...&history_spot=9&preflop_actions=<open>-F x6-C&flop_actions=X&repfloptab=<tab>&board=<board>`.
Tab: `swv_high_cards` for unpaired non-monotone T-high+ boards, else
`swv_flops`. URLs are pattern-inferred — flag new ones for click-verification
by the user.

## Preflop procedure

One entry per stack in the `stacks` array of `utg/rfi.json`, `btn/rfi.json`,
`bb/vs-utg.json`, `bb/vs-btn.json`: `type` "cEV", `subtitle` ("ChipEV"),
`stack`, `actions` (open weights as pasted — these are NOT divided),
`sizings` {"raise": open or 3-bet size in bb}. The shared `title`/`position`
live at the top of the file — never repeat them per entry. Wizard links are
built at load (preflopUrl: depth = stack + 0.125, equal stacks x8,
`history_spot` 1 for UTG RFI, 6 for BTN RFI (after F-F-F-F-F), 8 for BB
(after the line's preflop actions: `R2-F-F-F-F-F-F` vs a UTG open,
`F-F-F-F-F-R<open size>-F` vs a BTN open — 2.1 at 40bb, 2 otherwise)).

## After storing

- Run `npm run build` to verify.
- Update the S1 example (betPct/checkPct, takeaway, sizing note) with the
  weighted shares, and the provenance comment in design-system
  `src/data/ranges/s1-flops.ts` ("Source: GTO Wizard (MTT 8-max, 40bb),
  <size> pot c-bet (<bb>bb), imported from a range-view paste").
- Save the raw paste to `packages/ranges/imports/` (gitignored, licensed
  data). BB flop-node pastes are exploration only — never enter the store.
