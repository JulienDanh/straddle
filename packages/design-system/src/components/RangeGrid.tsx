import { useMemo, useState } from 'react'
// 13x13 grid layout: A-high at top-left, pairs on the diagonal, suited above,
// offsuit below.
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const
const HAND_GRID: { hand: string }[][] = RANKS.map((row, ri) =>
  RANKS.map((col, ci) => {
    if (row === col) return { hand: `${row}${col}` }
    const idx1 = RANKS.indexOf(row), idx2 = RANKS.indexOf(col)
    const [hi, lo] = idx1 < idx2 ? [row, col] : [col, row]
    return { hand: ci > ri ? `${hi}${lo}s` : `${hi}${lo}o` }
  })
)

// RangeGrid — 13x13 hand grid with fixed action props.
//
// Each action is a named combo-data string (Pio/GTO Wizard export format,
// 0-1 scale: "Ac2c:1,Ac4d:0.0006,KcTd:0.2073,...\"). Pass an empty string
// for actions that don't apply to this spot. Colors are fixed per action.
//
// Interactive: click a legend action to solo it (grid shows only that
// strategy), click a cell for a per-hand breakdown (action bars + the
// combos behind them).
//
// Usage:
//   <RangeGrid
//     title="BB vs UTG RFI · 20bb"
//     raise="Ac2c:1,7d7c:1,..."
//     call="5d5c:0.037,KcTd:0.2073,..."
//     fold="72o:0,..."
//   />

// Fixed color per action.
const COLORS = {
  fold: '#2f2f4a',
  call: '#00f0ff',
  raise: '#ff5470',
  allIn: '#b44cff',
  check: '#39ff88',
  bet: '#ff5470',
} as const

// Order for the legend and gradient segments (fold first = bottom).
const ACTION_ORDER = ['fold', 'call', 'raise', 'allIn', 'check', 'bet'] as const

type Actions = Partial<Record<(typeof ACTION_ORDER)[number], string>>

const RANK_ORDER = 'AKQJT98765432'

// Total combos in a deck: 169 hand classes = 13 pairs x 6 + 78 suited x 4 +
// 78 offsuit x 12 = 1326. Action shares are weighted by these counts.
const TOTAL_COMBOS = 1326

function comboToHandClass(combo: string): string | null {
  if (combo.length !== 4) return null
  const r1 = combo[0].toUpperCase(), s1 = combo[1].toLowerCase()
  const r2 = combo[2].toUpperCase(), s2 = combo[3].toLowerCase()
  if (!RANK_ORDER.includes(r1) || !RANK_ORDER.includes(r2)) return null
  if (!'shdc'.includes(s1) || !'shdc'.includes(s2)) return null
  if (r1 === r2) return `${r1}${r2}`
  const hi = RANK_ORDER.indexOf(r1) < RANK_ORDER.indexOf(r2) ? r1 : r2
  const lo = hi === r1 ? r2 : r1
  return `${hi}${lo}${s1 === s2 ? 's' : 'o'}`
}

function parseComboData(raw: string): Record<string, number> {
  const out: Record<string, number> = {}
  const sums: Record<string, number> = {}
  const counts: Record<string, number> = {}
  for (const entry of raw.split(',')) {
    const parts = entry.trim().split(':')
    if (parts.length !== 2) continue
    const hc = comboToHandClass(parts[0].trim())
    const freq = parseFloat(parts[1].trim())
    if (!hc || isNaN(freq)) continue
    sums[hc] = (sums[hc] || 0) + freq
    counts[hc] = (counts[hc] || 0) + 1
  }
  for (const hc of Object.keys(sums)) out[hc] = sums[hc] / counts[hc]
  return out
}

// Per-combo frequencies (0-1), summed over duplicate entries.
function parseComboFreqs(raw: string): Record<string, number> {
  const out: Record<string, number> = {}
  for (const entry of raw.split(',')) {
    const parts = entry.trim().split(':')
    if (parts.length !== 2) continue
    const f = parseFloat(parts[1].trim())
    if (isNaN(f)) continue
    out[parts[0].trim()] = (out[parts[0].trim()] || 0) + f
  }
  return out
}

// Weighted share of an action's combo string: of all 1326 combos by default,
// or of the base range when given (postflop children are conditional on the
// open, so shares read as "of range"). denomCombos is the union of all
// displayed actions' combos — the child's combo set (open minus board).
function actionShare(freqs: Record<string, number>, base: string, denomCombos: Set<string>): number {
  if (!base) {
    const total = Object.values(freqs).reduce((s, v) => s + v, 0)
    return (total / TOTAL_COMBOS) * 100
  }
  const bw = parseComboFreqs(base)
  let total = 0
  for (const c of denomCombos) total += bw[c] ?? 1
  let num = 0
  for (const [c, f] of Object.entries(freqs)) num += (bw[c] ?? 1) * f
  return total > 0 ? (num / total) * 100 : 0
}

/** Share (%, 0-100) of hands playing any non-fold action — "opens 15.2%" /
 *  "defends 8.4%" preflop, or "c-bets 58%" of the base range postflop. */
export function strategyShare(actions: Actions, base = ''): number {
  const active = ACTION_ORDER.filter(a => a !== 'fold' && actions[a])
  const freqs = active.map(a => parseComboFreqs(actions[a]!))
  const denom = new Set<string>()
  for (const f of freqs) for (const c of Object.keys(f)) denom.add(c)
  return freqs.reduce((s, f) => s + actionShare(f, base, denom), 0)
}

/** Per-action shares (%, 0-100) of the base range — e.g. { bet: 89, check: 11 }
 *  for a c-bet child weighted by the parent open. All actions share one
 *  denominator (the union of their combos, i.e. the parent open minus the
 *  board), so the shares sum to the strategy share. */
export function actionShares(actions: Actions, base = ''): Partial<Record<(typeof ACTION_ORDER)[number], number>> {
  const active = ACTION_ORDER.filter(a => actions[a])
  const freqs = active.map(a => parseComboFreqs(actions[a]!))
  const denom = new Set<string>()
  for (const f of freqs) for (const c of Object.keys(f)) denom.add(c)
  const out: Partial<Record<(typeof ACTION_ORDER)[number], number>> = {}
  active.forEach((a, i) => { out[a] = actionShare(freqs[i], base, denom) })
  return out
}

// Build a multi-color horizontal gradient for a cell. Each action fills its
// raw frequency share of the cell width (a 40% raise = 40% fill); unfilled
// width shows the cell background.
function cellGradient(freqs: number[], colors: string[]): string {
  const total = freqs.reduce((s, v) => s + v, 0)
  if (total <= 0) return ''
  let pos = 0
  const stops: string[] = []
  for (let i = 0; i < freqs.length; i++) {
    if (freqs[i] <= 0) continue
    const pct = Math.min(freqs[i], 100 - pos)
    if (pct <= 0) break
    const color = colors[i] || '#666'
    stops.push(`${color} ${pos.toFixed(1)}%`)
    pos += pct
    stops.push(`${color} ${pos.toFixed(1)}%`)
  }
  // Gradients extend the last stop's color to 100%, so cap the fill with an
  // explicit transparent tail — otherwise a 40% fill paints the whole cell.
  if (pos < 100) {
    stops.push(`transparent ${pos.toFixed(1)}%`)
    stops.push('transparent 100%')
  }
  return `linear-gradient(to right, ${stops.join(', ')})`
}

// Cell text is white with a dark halo — readable over both the unfilled
// panel background and bright action fills. Hands at 0 are greyed out.

export interface RangeGridProps {
  title?: string
  subtitle?: string
  fold?: string
  call?: string
  raise?: string
  allIn?: string
  check?: string
  bet?: string
  // Bet/raise sizes in bb per action — shown in the legend and hand panel
  // (e.g. sizings={{ raise: 2.2 }} renders "Raise 2.2bb").
  sizings?: Partial<Record<(typeof ACTION_ORDER)[number], number>>
  // Base range (combo:freq line, several may be joined) the displayed strategy
  // is conditional on — a postflop child's parent reach (the open, call or
  // preflop check line). When set: legend percentages become weighted shares
  // of this range (sum(base*freq) / sum(base)) so a pure c-bet reads 100%,
  // AND the cell fills are scaled by each hand class's weight in the base —
  // a hand the hero rarely reaches shows as a thin fill, not a full box (the
  // same weighted display preflop ranges use).
  base?: string
  // compact: small grid for inline use in course content — no numbers, no
  // legend, no click-to-lock panel. Just colored cells.
  compact?: boolean
  // fill: stretch the grid to the container's height instead of fixed
  // 44px cells — for full-viewport panels (Live) with no page scroll.
  fill?: boolean
}

// Human label for an action, annotating the size when provided.
function actionLabel(a: string, sizing?: number): string {
  if (a === 'allIn') return 'All-in'
  const base = a.charAt(0).toUpperCase() + a.slice(1)
  return sizing !== undefined ? `${base} ${sizing}bb` : base
}

// PioSOLVER UPI (Universal Poker Interface) canonical hand order: all
// 1326 combos, deck order (ranks 2..A, suits c d h s), later card first in
// each pair — matching Pio's documented sequence "2d2c 2h2c 2h2d ..." and
// the combo order of the stored GTO Wizard captures. set_range over UPI
// expects 1326 weights in exactly this order (scripts should still verify
// once against the solver's own show_hand_order).
const UPI_HANDS: readonly string[] = (() => {
  const deck: string[] = []
  for (const r of '23456789TJQKA') for (const s of 'cdhs') deck.push(r + s)
  const out: string[] = []
  for (let i = 1; i < 52; i++)
    for (let j = 0; j < i; j++) out.push(deck[i] + deck[j])
  return out
})()

// clipboard write for non-secure contexts (execCommand is deprecated but
// still the only fallback over plain http)
function fallbackCopy(text: string) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy') } catch { /* nothing to do */ }
  document.body.removeChild(ta)
}

export function RangeGrid({ title, subtitle, fold = '', call = '', raise = '', allIn = '', check = '', bet = '', sizings, base = '', compact = false, fill = false }: RangeGridProps) {
  const { perHand, activeActions, colors, actionPcts, actionCombos, baseByCombo } = useMemo(() => {
    const data: Record<string, string> = { fold, call, raise, allIn, check, bet }
    const active = ACTION_ORDER.filter(a => data[a].length > 0)
    const parsed = active.map(a => parseComboData(data[a]))
    const cols = active.map(a => COLORS[a])

    // Per-combo frequencies per action (0-1), for the hand detail panel.
    const combos = active.map(a => parseComboFreqs(data[a]))

    // Per-class weight in the base range — the hero's reach share of the
    // class (averaged over ALL the class's combos; combos absent from the
    // base are 0). No base = full weight (preflop / standalone grids).
    const classWeights: Record<string, number> = {}
    const baseByCombo: Record<string, number> = {}
    if (base) {
      const bw = parseComboFreqs(base)
      const sizes: Record<string, number> = {}
      const sums: Record<string, number> = {}
      for (const row of HAND_GRID) for (const cell of row) {
        sizes[cell.hand] = cell.hand.length === 2 ? 6 : cell.hand.endsWith('s') ? 4 : 12
      }
      for (const [combo, w] of Object.entries(bw)) {
        const hc = comboToHandClass(combo)
        if (hc) { sums[hc] = (sums[hc] ?? 0) + w; baseByCombo[combo] = w }
      }
      for (const [hc, n] of Object.entries(sizes)) classWeights[hc] = (sums[hc] ?? 0) / n
    }

    // Legend share per action: of all 1326 combos by default, weighted share
    // of the base range when given (see actionShare).
    const denomCombos = new Set<string>()
    for (const ac of combos) for (const c of Object.keys(ac)) denomCombos.add(c)
    const pcts = combos.map(ac => actionShare(ac, base, denomCombos))

    const handFreqs: Record<string, number[]> = {}
    for (const row of HAND_GRID) {
      for (const cell of row) {
        const w = classWeights[cell.hand] ?? 1
        handFreqs[cell.hand] = active.map((_, i) => (parsed[i][cell.hand] ?? 0) * 100 * w)
      }
    }
    return { perHand: handFreqs, activeActions: active, colors: cols, actionPcts: pcts, actionCombos: combos, baseByCombo }
  }, [fold, call, raise, allIn, check, bet, base])

  // Legend action solo: click to view a single strategy; grid fills only
  // that action's share. Derived so a stale pick (actions changed) clears.
  const [soloPick, setSoloPick] = useState<string | null>(null)
  const solo = activeActions.includes(soloPick as never) ? soloPick : null

  // Copy an action's strategy, in two formats:
  // - gui (class:freq, e.g. "AA:1,AKs:0.35") — PioViewer's paste-range box
  // - upi (1326 space-separated weights) — PioSOLVER's set_range over the
  //   Universal Poker Interface, in Pio's canonical hand order
  const [copied, setCopied] = useState<string | null>(null)
  const rawOf = (a: string) =>
    ({ fold, call, raise, allIn, check, bet } as Record<string, string>)[a] ?? ''
  const writeClipboard = (text: string, key: string) => {
    const done = () => {
      setCopied(key)
      window.setTimeout(() => setCopied(c => (c === key ? null : c)), 1300)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => {
        fallbackCopy(text)
        done()
      })
    } else {
      fallbackCopy(text)
      done()
    }
  }
  const copyAction = (a: string) => {
    const perClass = parseComboData(rawOf(a))
    const text = Object.entries(perClass)
      .filter(([, f]) => f > 0.00005)
      .map(([c, f]) => `${c}:${Math.round(f * 10000) / 10000}`)
      .join(',')
    writeClipboard(text, `gui:${a}`)
  }
  const copyUpi = (a: string) => {
    const freqs = parseComboFreqs(rawOf(a))
    const text = UPI_HANDS.map(h => Math.round((freqs[h] ?? 0) * 10000) / 10000).join(' ')
    writeClipboard(text, `upi:${a}`)
  }

  // Clicked cell → per-hand breakdown panel.
  const [selected, setSelected] = useState<string | null>(null)
  // Hovered cell → floating strategy tooltip (exact mixes at a glance).
  const [hover, setHover] = useState<{ hand: string; x: number; y: number } | null>(null)

  // Combos behind the selected hand class, with their per-action frequencies
  // (%, same scale as the cells).
  const comboDetail = useMemo(() => {
    if (!selected) return []
    const rows: { combo: string; freqs: number[] }[] = []
    const byCombo = new Map<string, { combo: string; freqs: number[] }>()
    activeActions.forEach((_, i) => {
      for (const [combo, f] of Object.entries(actionCombos[i])) {
        if (comboToHandClass(combo) !== selected) continue
        let row = byCombo.get(combo)
        if (!row) {
          row = { combo, freqs: activeActions.map(() => 0) }
          byCombo.set(combo, row)
          rows.push(row)
        }
        row.freqs[i] = f * 100 * (baseByCombo[combo] ?? 1)
      }
    })
    return rows.sort((a, b) =>
      Math.max(...b.freqs) - Math.max(...a.freqs) || a.combo.localeCompare(b.combo))
  }, [selected, activeActions, actionCombos])

  // Compact mode: small inline grid, no numbers, no legend, no panel.
  if (compact) {
    return (
      <div className="rv-grid-wrap rv-compact">
        <table className="rv-grid rv-grid-sm">
          <thead><tr><th></th>{RANKS.map(r => <th key={r}>{r}</th>)}</tr></thead>
          <tbody>
            {HAND_GRID.map((rowCells, ri) => (
              <tr key={ri}>
                <th className="rv-rowhead">{RANKS[ri]}</th>
                {rowCells.map((cell, ci) => {
                  const freqs = perHand[cell.hand] ?? []
                  return (
                    <td key={ci}
                      className={`rv-cell ${freqs.reduce((s, v) => s + v, 0) > 0 ? 'in-range' : ''}`}
                      style={{ background: cellGradient(freqs, colors) }}
                      title={`${cell.hand}: ${activeActions.map((a, i) => `${a} ${freqs[i].toFixed(0)}%`).join(' · ')}`} />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={fill ? 'rv-content rv-content-fill' : 'rv-content'}>
      <div className={fill ? 'rv-grid-area rv-grid-area-fill' : 'rv-grid-area'}>
        {(title || subtitle) && (
          <div className="rv-grid-header">
            {title && <span className="rv-grid-spot">{title}</span>}
            {subtitle && <span className="rv-grid-sol">{subtitle}</span>}
          </div>
        )}
        <div className={fill ? 'rv-grid-wrap rv-grid-fill' : 'rv-grid-wrap'}>
          <table className="rv-grid">
            <thead>
              <tr><th></th>{RANKS.map(r => <th key={r}>{r}</th>)}</tr>
            </thead>
            <tbody>
              {HAND_GRID.map((rowCells, ri) => (
                <tr key={ri}>
                  <th className="rv-rowhead">{RANKS[ri]}</th>
                  {rowCells.map((cell, ci) => {
                    const freqs = perHand[cell.hand] ?? []
                    const view = solo ? freqs.map((f, i) => (activeActions[i] === solo ? f : 0)) : freqs
                    const total = view.reduce((s, v) => s + v, 0)
                    return (
                      <td key={ci}
                        className={`rv-cell ${total > 0 ? 'in-range' : ''} cursor-pointer ${selected === cell.hand ? 'outline outline-2 outline-accent -outline-offset-2' : ''} ${hover?.hand === cell.hand ? 'ring-1 ring-white/60' : ''}`}
                        style={{
                          background: cellGradient(view, colors),
                          color: total > 0 ? '#fff' : '#8080a4',
                          ...(total > 0 ? { textShadow: '0 1px 2px rgba(6,6,14,0.7)' } : null),
                          fontWeight: total > 50 ? 700 : 400,
                        }}
                        onMouseMove={e => setHover({ hand: cell.hand, x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setHover(h => (h?.hand === cell.hand ? null : h))}
                        onClick={() => setSelected(selected === cell.hand ? null : cell.hand)}
                      >
                        <span className="rv-cell-hand">{cell.hand}</span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rv-legend">
          {activeActions.map((a, i) => (
            <div key={a} className="flex items-center">
              <button
                onClick={() => setSoloPick(solo === a ? null : a)}
                className={`rv-legend-item cursor-pointer transition-colors ${solo === a ? 'text-txt' : ''}`}
                title={solo === a ? 'Show all actions' : `Show only ${actionLabel(a, sizings?.[a])}`}
              >
                <span className="rv-legend-dot" style={{ background: colors[i] }} />
                {actionLabel(a, sizings?.[a])}
                <span className="rv-legend-pct">{actionPcts[i].toFixed(1)}%</span>
              </button>
              <span className="pl-1.5 ml-0.5 flex gap-0.5">
                <button
                  onClick={() => copyAction(a)}
                  className="px-1.5 py-px border border-line bg-panel2/50 rounded text-[10px] font-semibold text-muted hover:text-txt hover:border-accent/60 cursor-pointer transition-colors select-none"
                  title={`Copy ${actionLabel(a, sizings?.[a])} range as class:freq text (PioViewer paste format)`}
                >
                  {copied === `gui:${a}` ? 'copied' : 'copy'}
                </button>
                <button
                  onClick={() => copyUpi(a)}
                  className="px-1.5 py-px border border-line bg-panel2/50 rounded text-[10px] font-semibold text-muted hover:text-txt hover:border-accent/60 cursor-pointer transition-colors select-none"
                  title={`Copy ${actionLabel(a, sizings?.[a])} range as 1326 weights for PioSOLVER UPI set_range`}
                >
                  {copied === `upi:${a}` ? 'copied' : 'upi'}
                </button>
              </span>
            </div>
          ))}
        </div>
        <div className="rv-comp" aria-hidden={true}>
          {activeActions.map((a, i) => actionPcts[i] > 0.05 && (
            <span
              key={a}
              className="rv-comp-seg"
              style={{ width: `${Math.min(100, actionPcts[i])}%`, background: colors[i] }}
              title={`${actionLabel(a, sizings?.[a])} ${actionPcts[i].toFixed(1)}%`}
            />
          ))}
        </div>
        {selected && (
          <div className="mt-3 rounded-lg border border-line bg-panel2 px-4 py-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-bold text-txt">{selected}</span>
              <button onClick={() => setSelected(null)} className="text-[11px] text-muted cursor-pointer hover:text-txt">close</button>
            </div>
            <div className="flex flex-col gap-1.5">
              {activeActions.map((a, i) => {
                const f = perHand[selected]?.[i] ?? 0
                return (
                  <div key={a} className="flex items-center gap-2.5">
                    <span className="w-20 shrink-0 text-[11px] font-semibold text-muted truncate">{actionLabel(a, sizings?.[a])}</span>
                    <div className="flex-1 h-2 rounded-full bg-dark overflow-hidden border border-line/50">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, f)}%`, background: colors[i] }} />
                    </div>
                    <span className="w-12 text-right text-[11px] font-bold tabular-nums" style={{ color: colors[i] }}>{f.toFixed(1)}%</span>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-line/60">
              {comboDetail.length === 0 && (
                <span className="text-[11px] text-muted">Not in range.</span>
              )}
              {comboDetail.map(({ combo, freqs }) => {
                const topIdx = freqs.reduce((best, v, i) => (v > freqs[best] ? i : best), 0)
                const top = freqs[topIdx]
                return (
                  <span
                    key={combo}
                    className="text-[10.5px] font-mono px-1.5 py-0.5 rounded border-l-2 bg-dark tabular-nums text-txt"
                    style={{ borderLeftColor: colors[topIdx] }}
                    title={activeActions.map((a, i) => `${actionLabel(a, sizings?.[a])} ${freqs[i].toFixed(1)}%`).join(' · ')}
                  >
                    {combo} {top < 0.05 ? '~0' : top.toFixed(0) + '%'}
                  </span>
                )
              })}
            </div>
          </div>
        )}
        {hover && (() => {
          const freqs = perHand[hover.hand] ?? []
          const W = 210
          const left = Math.min(hover.x + 16, window.innerWidth - W - 10)
          const top = Math.min(hover.y + 18, window.innerHeight - 40 - activeActions.length * 16)
          return (
            <div
              className="fixed z-50 pointer-events-none rounded-lg border border-line bg-dark/95 backdrop-blur px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
              style={{ left, top, width: W }}
            >
              <div className="text-[12.5px] font-bold text-txt mb-1">{hover.hand}</div>
              {activeActions.map((a, i) => (
                <div key={a} className="flex items-center gap-2 py-px">
                  <span className="w-2 h-2.5 rounded-[2px] shrink-0" style={{ background: colors[i] }} />
                  <span className="flex-1 text-[10.5px] text-muted truncate">{actionLabel(a, sizings?.[a])}</span>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: colors[i] }}>{freqs[i].toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default RangeGrid
