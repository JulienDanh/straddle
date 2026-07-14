# straddle frontend — agent guide

## Run

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Layout

- `src/` — all source code
  - `src/api.ts` — API client for solver backend
  - `src/components/` — React components
    - `ConfigForm.tsx` — new solver form
    - `HandGrid.tsx` — 13x13 hand matrix visualization
    - `PlayingCard.tsx` — card component + utils
    - `SolverView.tsx` — main solver UI
  - `src/App.tsx` — root component
  - `src/main.tsx` — entry point
  - `src/index.css` — global styles
- `index.html` — entry HTML
- `vite.config.ts` — Vite config with proxy to backend

## Key patterns

### Hand parsing

- Hand string format: `{rank1}{suit1}{rank2}{suit2}` (4 chars, e.g. `AhKh`)
- Suited: `hand[1] === hand[3]`
- Combos: `getHandCombination(r1, r2, suited)` → `"AKs"` or `"AKo"`

### Action colors

| Action      | Color      |
|-------------|------------|
| Fold        | `#6b6b7a`  |
| Check       | `#22c55e`  |
| Call        | `#14b8a6`  |
| Bet/AllIn   | `#60a5fa` → `#1d4ed8` (darker for larger sizes)

### View modes

- `strategy` — horizontal stacked action bars (color-coded)
- `equity` — green-to-red gradient
- `ev` — blue-to-red gradient (negative to positive)
- `range` — blue opacity (percentage)

### Navigation

- Action path bar: clickable breadcrumb pills
- Back buttons: `◀` (one step), `⌂` (root)
- Chance nodes: card picker

### Locking

- Paste strategy JSON: `{hand: {action: freq}}`
- `Fill Current` button: auto-fill with current strategy
- Locked indicator: green badge

## Gotchas

- Vite proxy: `/api` → `http://localhost:8000` (backend)
- Player toggle: strategy only for acting player; equity/EV/range for both via `?player=` query param
- Chance nodes: only show card picker when `node_type === "chance"`
- Terminal nodes: show "Hand complete" message
- Error handling: show toast at top of solver view
- Progress chart: live exploitability via SSE