import { useMemo } from 'react'
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
// 0-1 scale: "Ac2c:1,Ac4d:0.0006,KcTd:0.2073,..."). Pass an empty string
// for actions that don't apply to this spot. Colors are fixed per action.
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
  fold: '#3a4453',
  call: '#5fd0a8',
  raise: '#ff5c5c',
  allIn: '#a855f7',
  check: '#5fd0a8',
  bet: '#ff5c5c',
} as const

// Order for the legend and gradient segments (fold first = bottom).
const ACTION_ORDER = ['fold', 'call', 'raise', 'allIn', 'check', 'bet'] as const

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

// Build a multi-color horizontal gradient for a cell. Each action fills its
// raw frequency share of the cell width (a 40% raise = 40% fill), like
// GTO Wizard; unfilled width shows the cell background.
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
  // is conditional on — a postflop child's parent open. When set, legend
  // percentages become weighted shares of this range (sum(base*freq) /
  // sum(base)) instead of shares of all 1326 combos, so a pure c-bet reads 100%.
  base?: string
  // compact: small grid for inline use in course content — no numbers, no
  // legend, no click-to-lock panel. Just colored cells.
  compact?: boolean
}

// Human label for an action, annotating the size when provided.
function actionLabel(a: string, sizing?: number): string {
  if (a === 'allIn') return 'All-in'
  const base = a.charAt(0).toUpperCase() + a.slice(1)
  return sizing !== undefined ? `${base} ${sizing}bb` : base
}

export function RangeGrid({ title, subtitle, fold = '', call = '', raise = '', allIn = '', check = '', bet = '', sizings, base = '', compact = false }: RangeGridProps) {
  const { perHand, activeActions, colors, actionPcts } = useMemo(() => {
    const data: Record<string, string> = { fold, call, raise, allIn, check, bet }
    const active = ACTION_ORDER.filter(a => data[a].length > 0)
    const parsed = active.map(a => parseComboData(data[a]))
    const cols = active.map(a => COLORS[a])

    // Per-combo frequencies per action.
    const actionCombos: Record<string, number>[] = active.map(a => {
      const out: Record<string, number> = {}
      for (const entry of data[a].split(',')) {
        const parts = entry.trim().split(':')
        if (parts.length !== 2) continue
        const f = parseFloat(parts[1].trim())
        if (!isNaN(f)) out[parts[0].trim()] = f
      }
      return out
    })

    // Legend share per action. Default: share of all 1326 combos, combo-
    // weighted. With a base range: weighted share of that range — postflop
    // strategies are conditional on the open, so board-blocked combos are
    // excluded from the denominator (the child's combo set is the open minus
    // the board) and a pure strategy reads 100%.
    const baseWeights: Record<string, number> = {}
    for (const entry of base.split(',')) {
      const parts = entry.trim().split(':')
      if (parts.length !== 2) continue
      const f = parseFloat(parts[1].trim())
      if (!isNaN(f)) baseWeights[parts[0].trim()] = (baseWeights[parts[0].trim()] || 0) + f
    }
    const denomCombos = new Set<string>()
    for (const ac of actionCombos) for (const c of Object.keys(ac)) denomCombos.add(c)
    const baseTotal = [...denomCombos].reduce((s, c) => s + (baseWeights[c] ?? 1), 0)
    const pcts = actionCombos.map(ac => {
      if (base) {
        let num = 0
        for (const [c, f] of Object.entries(ac)) num += (baseWeights[c] ?? 1) * f
        return baseTotal > 0 ? (num / baseTotal) * 100 : 0
      }
      return (Object.values(ac).reduce((s, v) => s + v, 0) / TOTAL_COMBOS) * 100
    })

    const handFreqs: Record<string, number[]> = {}
    for (const row of HAND_GRID) {
      for (const cell of row) {
        handFreqs[cell.hand] = active.map((_, i) => (parsed[i][cell.hand] ?? 0) * 100)
      }
    }
    return { perHand: handFreqs, activeActions: active, colors: cols, actionPcts: pcts }
  }, [fold, call, raise, allIn, check, bet, base])

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
                  const total = freqs.reduce((s, v) => s + v, 0)
                  return (
                    <td key={ci}
                      className={`rv-cell ${total > 0 ? 'in-range' : ''}`}
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
    <div className="rv-content">
      <div className="rv-grid-area">
        {(title || subtitle) && (
          <div className="rv-grid-header">
            {title && <span className="rv-grid-spot">{title}</span>}
            {subtitle && <span className="rv-grid-sol">{subtitle}</span>}
          </div>
        )}
        <div className="rv-grid-wrap">
          <table className="rv-grid">
            <tbody>
              {HAND_GRID.map((rowCells, ri) => (
                <tr key={ri}>
                  {rowCells.map((cell, ci) => {
                    const freqs = perHand[cell.hand] ?? []
                    const total = freqs.reduce((s, v) => s + v, 0)
                    return (
                      <td key={ci}
                        className={`rv-cell ${total > 0 ? 'in-range' : ''}`}
                        style={{
                          background: cellGradient(freqs, colors),
                          color: total > 0 ? '#fff' : '#8499b5',
                          ...(total > 0 ? { textShadow: '0 1px 2px rgba(12,17,23,0.7)' } : null),
                          fontWeight: total > 50 ? 700 : 400,
                        }}
                        title={`${cell.hand}: ${activeActions.map((a, i) => `${a} ${freqs[i].toFixed(1)}%`).join(' · ')}`}>
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
            <span key={a} className="rv-legend-item">
              <span className="rv-legend-dot" style={{ background: colors[i] }} />
              {actionLabel(a, sizings?.[a])}
              <span className="rv-legend-pct">{actionPcts[i].toFixed(1)}%</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RangeGrid
