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
  `sizings`). Types: `cEV`, `ICM` (equal stacks) and `ICM-covered` /
  `ICM-covering` for asymmetric stack configs — they share the position's
  rfi.json and surface as separate solution types in the panel toggle;
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
`history_spot` = decision-node ordinal: 1 UTG, 6 BTN, 8 BB; the preflop
line's open size is the RFI response's raise code — the walk derives it,
no guessing).

## Fetching from GTO Wizard (autonomous)

Prefer fetching over asking the user to paste. The pipeline drives the
user's logged-in debug Chrome (CDP, port 9222, profile at
`.scratch/gw-chrome-profile`) — the app itself makes every authed/signed
request and the response is captured off the wire. NEVER call
api.gtowizard.com directly, not even via `fetch()` from the page (the app
signs every request; a plain fetch returns 401). Never bulk-scrape: one
spot per request, driven by an actual user ask.

### Solutions library awareness (what exists)

The app's own `/v4/game-modes/` response is the solutions library catalog —
1101 gametypes, each with its exact depth/stack configs. `fetch_browser.py`
captures it on page load and caches it at
`straddle-solutions/catalog.json` (tracked in the private repo). Every fetch is
validated against it BEFORE navigating, because for a nonexistent spot the
app silently falls back to an unrelated solution:

- gametype must exist in the catalog
- depth is normalized (`40` -> `40.125`, the app's stack+0.125-ante format)
- the EXACT stack config must exist: ICM bubble
  (MTTGeneral_ICM8m200PTBUBBLEMID) has only symmetric 20/25/30/40 —
  anything else is refused with a list of what does exist, no request made

Query the cached catalog locally (no network):
`python3 straddle-solutions/scripts/gw_catalog.py gametypes mtt | depths <gametype> | configs <gametype> [--all]`
Refresh it: `fetch_browser.py --refresh-catalog` (auto-refreshes after 14
days). Asymmetric configs (e.g. ICM) are fetched with
`--stacks 40.125-35.125-...` (8 dash-joined values).

### Walk modes (preferred over manual URLs)

Lines are derived from real node responses — open sizes are never guessed:

- `fetch_browser.py --rfi BTN --depth 30` — BTN's RFI node
- `fetch_browser.py --bb-vs UTG --depth 40` — UTG's RFI node, then BB's
  defend node (the open code R2/R2.1/... is read from the RFI response)
- `fetch_browser.py --rfi UTG --board Kh8h3c --cbet` — continue to the
  opener's flop c-bet node (line = open + folds + C, spot 9)
- `--gametype MTTGeneral_ICM8m200PTBUBBLEMID` for ICM (archives land under
  `icm/`); `--refetch` bypasses the archive cache

Fetches REUSE already-archived captures instead of re-fetching
(solver spots are static). Every capture prints the actions available at
that node with exact sizes (e.g. `BB @ preflop: F / C / R8.92 (8.92bb,
120% pot) / RAI`, or `UTG @ Kh8h3c: X / R1.1 (1.1bb, 20% pot)`) — that is
the available-betsizes awareness for the spot. Manual mode
(`--history-spot N --preflop-actions ... --board ...`) still exists for
one-off nodes not covered by a walk; params mirror the app's share URLs.

Every capture is archived automatically (full payload: strategy,
per-combo EVs, hand categories, blockers) under
`straddle-solutions/solutions/<gametype>/<stacks>/<category>/`
(private submodule, licensed data):

```
solutions/cev/40/rfi/btn.json                      position RFI
solutions/cev/40/vs-open/btn-bb.json              BB defending vs an open
solutions/cev/40/flops/r2-f-f-f-f-f-f-c/kh8h3c-x.json   c-bet node
solutions/icm-8m-200ptbubblemid/40/rfi/btn.json   one dir per gametype
```

- `<gametype>` dir is unique per gametype (`cev` = MTTGeneral_8m, each ICM
  structure its own `icm-...` dir — never one shared `icm/`).
- `<stacks>` is the bare depth when symmetric, all stacks when asymmetric.
- Node categories: `rfi/<position>`, `vs-open/<opener>-<defender>`,
  `flops/<preflop-line>/<board>-<flop-actions>`. A node is fully
  determined by (gametype, stacks, line, board, flop history), so multiway
  lines (longer dirs), turn/river (longer boards) and facing-bet nodes
  (flop history in the name) all file naturally. Node types with no
  naming yet (preflop overcalls, facing 3-bets, non-8-max preflop) are
  REFUSED loudly — never misfiled.

The archive is checked and reused before re-fetching a spot (`--refetch`
bypasses).

2. Convert:
   `python3 straddle-solutions/scripts/gw_to_store.py flop straddle-solutions/solutions/cev/40/flops/r2-f-f-f-f-f-f-c/kh8h3c-x.json --parent utg/rfi.json --stack 40`
   (or `preflop <archive>.json`) — prints actions lines, the betsize and
   the weighted stats.
3. Validate and store per the procedures above (coverage, weighted lines
   verbatim — same as a paste). The response's betsize is authoritative:
   the "20% pot" line is 1.1bb (MTT pots include antes, pot = 5.5bb), the
   "73% pot" line is 4bb.
4. `npm run build`.

Orders (`gw_order.py`, derived and anchor-verified): flop strategies are
per-combo over a 1326 order (deck ranks 2..A, suits c,d,h,s; index
i*(i-1)/2+j); preflop strategies are per-class over the 169 classes
ASCII-sorted by name. Preflop class values are copied to every combo of
the class (display-equivalent).

Debug Chrome session — if it is not running, relaunch:
`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 --user-data-dir=/Users/nsyt/bbz/.scratch/gw-chrome-profile https://app.gtowizard.com/`
The profile stays logged in; if the session expires the user logs in again
in that window. Browser-based retrieval is the ONLY path — it is maximally
stealth (the real app, real session, real signatures); never call
api.gtowizard.com directly. The CDP client needs `websocket-client`
(`python3 -m pip install --user --break-system-packages websocket-client`).

## Postflop node encoding (empirically verified against the app)

Action codes: `F` fold, `R<size>` raise, `C` call (of a raise), `RAI`
all-in — preflop. `X` (check) is POSTFLOP ONLY (except BB's option vs a
SB limp, which the app codes X) — a preflop line containing X otherwise
is invalid; never build one. If the app lands on such a URL, its state
is broken — reload before the next capture.

After a 3-bet the seats between opener and 3-bettor act FIRST (cold-4bet
decisions) — the opener only decides once it folds back around. Vs-3bet
lines are therefore the full fold-back-around sequences at spot 9, e.g.
UTG vs a HJ 3-bet: `R2-F-F-R5.5-F-F-F-F`; the 3-bet size in the line
varies with depth (read it from the captured defender node — at 50bb:
HJ 6, BTN 6.5, BB 9). The app canonicalizes board card order (suits
s,h,d,c within rank groups): fetch `KhKd3c`/`Jh6s6d`, never `KdKh3c`.

`flop_actions` are REAL actions, not placeholders: the `X` in the c-bet
URL is the BB's CHECK — the BB is out of position and acts first on every
postflop street (UTG's open is in position). The line reads: BB checks
(X), UTG bets (R1.1), BB calls (C), and the turn node is BB's
check-or-donk decision (the AI sims DO donk: K83+2s shows X / R8.7).

- Node ordinal: `spot = 1 + preflop actions + max(0, flop actions - 1)`
  (X -> 9, X-R1.1 -> 10, X-R1.1-C -> 11 on the 8-action UTG-vs-BB line).
  `flop_node_spot()` in fetch_browser computes it.
- Turn/river: the BOARD param grows to 4/5 cards (Kh8h3c2s) and
  flop_actions keeps the whole flop history — no separate turn param is
  needed in the app URL (the API carries an empty turn_actions).
- NEVER lowercase the board in the URL: `kh8h3c2s` silently falls back to
  an unrelated node; `Kh8h3c2s` resolves. Archive FILE names are
  lowercase; URLs are not.
- check_capture verifies the board — a capture with the wrong board means
  the URL didn't resolve (the app fell back). Trust its refusals.
- To learn an encoding that isn't documented here, drive the app's own
  UI: navigate to the parent spot with a full page reload, then trusted-
  click the action in the last `hspot-card` (CDP Input.dispatchMouseEvent
  at the element's center; synthetic DOM clicks are ignored). The app
  builds the next URL itself — read location.href for the encoding.
  Advancing streets opens a card-picker dialog (`brdpckr` cards) — click
  the turn card the same way.

## Archive contents (straddle-solutions/solutions/)

Raw spot-solution payloads, organized
`solutions/<gametype>/<stacks>/<category>/<name>.json` (see the layout
tree above). Each has: `game` (spot
definition), `action_solutions` (per action: strategy, per-combo EVs,
equity/hand/draw category aggregates), and per-combo
`hand_categories_range` / `draw_categories_range` / `blocker_rate` /
`unblocker_rate` (1326 arrays, gw_order order). Covered so far:
cEV RFI for UTG/UTG+1/LJ/HJ/CO/BTN at 40/30/20/10 (UTG/BTN also 15/8/6),
BB-vs-UTG 40/30/20/15/10, BB-vs-BTN 40/20/15/10, BB-vs-LJ and BB-vs-CO at
40, UTG c-bet K83/AJ5/AK2 at 40 plus K83's BB-facing-bet node
(kh8h3c-x-r1.1) and 2s-turn donk node (kh8h3c2s-x-r1.1-c), BTN c-bet
A72-mono/A95/K93/K84-mono/963 at 40 (S2's buckets);
ICM bubble RFI for all six positions + SB first-in (limp node) and all
SB/BB defenses at 40/30/25/20 (the ICM gametype's symmetric depths —
and it is preflop-only, no ICM postflop exists), plus three asymmetric
ICM configs (BM2 covered opens: BTN 13 into BB 75, BTN 12 into BB 16,
CO 10 into HJ 50/BB 40). cEV ladders include 25bb everywhere and 30bb for
the defense sets. The per-combo EVs are the
interesting unused data (EV annotations for the S1 examples need no extra
fetching).

## After storing

- Run `npm run build` to verify.
- Update the S1 example (betPct/checkPct, takeaway, sizing note) with the
  weighted shares, and the provenance comment in design-system
  `src/data/ranges/s1-flops.ts` ("Source: GTO Wizard (MTT 8-max, 40bb),
  <size> pot c-bet (<bb>bb), imported from a range-view paste").
- Save the raw paste to `straddle-solutions/imports/` (private submodule,
  licensed data). BB flop-node pastes are exploration only — never enter the store.
