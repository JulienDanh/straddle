import { useState, useMemo } from 'react'
import { RANKS, HAND_GRID } from '../pages/solutionParser'

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
  call: '#6aa6ff',
  raise: '#ef6f6f',
  allIn: '#c83838',
  check: '#5fd0a8',
} as const

// Order for the legend and gradient segments (fold first = bottom).
const ACTION_ORDER = ['fold', 'call', 'raise', 'allIn', 'check'] as const

const RANK_ORDER = 'AKQJT98765432'

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

// Build a multi-color vertical gradient for a cell.
function cellGradient(freqs: number[], colors: string[]): string {
  const total = freqs.reduce((s, v) => s + v, 0)
  if (total <= 0) return ''
  let pos = 0
  const stops: string[] = []
  for (let i = 0; i < freqs.length; i++) {
    if (freqs[i] <= 0) continue
    const pct = (freqs[i] / total) * 100
    const color = colors[i] || '#666'
    stops.push(`${color} ${pos.toFixed(1)}%`)
    pos += pct
    stops.push(`${color} ${pos.toFixed(1)}%`)
  }
  return `linear-gradient(to bottom, ${stops.join(', ')})`
}

function freqTextColor(freqs: number[]): string {
  const total = freqs.reduce((s, v) => s + v, 0)
  if (total <= 0) return '#8499b5'
  const foldPct = (freqs[0] || 0) / total
  return foldPct > 0.5 ? '#8499b5' : '#0c1117'
}

export interface RangeGridProps {
  title?: string
  subtitle?: string
  fold?: string
  call?: string
  raise?: string
  allIn?: string
  check?: string
  // compact: small grid for inline use in course content — no numbers, no
  // legend, no click-to-lock panel. Just colored cells.
  compact?: boolean
}

export function RangeGrid({ title, subtitle, fold = '', call = '', raise = '', allIn = '', check = '', compact = false }: RangeGridProps) {
  const [lockedHand, setLockedHand] = useState<string | null>(null)

  const { perHand, activeActions, colors } = useMemo(() => {
    const data: Record<string, string> = { fold, call, raise, allIn, check }
    const active = ACTION_ORDER.filter(a => data[a].length > 0)
    const parsed = active.map(a => parseComboData(data[a]))
    const cols = active.map(a => COLORS[a])

    const handFreqs: Record<string, number[]> = {}
    for (const row of HAND_GRID) {
      for (const cell of row) {
        handFreqs[cell.hand] = active.map((_, i) => (parsed[i][cell.hand] ?? 0) * 100)
      }
    }
    return { perHand: handFreqs, activeActions: active, colors: cols }
  }, [fold, call, raise, allIn, check])

  const lockedFreqs = lockedHand ? (perHand[lockedHand] ?? []) : null

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
            <thead><tr><th></th>{RANKS.map(r => <th key={r}>{r}</th>)}</tr></thead>
            <tbody>
              {HAND_GRID.map((rowCells, ri) => (
                <tr key={ri}>
                  <th className="rv-rowhead">{RANKS[ri]}</th>
                  {rowCells.map((cell, ci) => {
                    const freqs = perHand[cell.hand] ?? []
                    const total = freqs.reduce((s, v) => s + v, 0)
                    const isLocked = lockedHand === cell.hand
                    return (
                      <td key={ci}
                        className={`rv-cell ${total > 0 ? 'in-range' : ''} ${isLocked ? 'locked' : ''}`}
                        style={{
                          background: cellGradient(freqs, colors),
                          color: freqTextColor(freqs),
                          fontWeight: total > 50 ? 700 : 400,
                        }}
                        title={`${cell.hand}: ${activeActions.map((a, i) => `${a} ${freqs[i].toFixed(1)}%`).join(' · ')}`}
                        onClick={() => setLockedHand(isLocked ? null : cell.hand)}>
                        <span className="rv-cell-hand">{cell.hand}</span>
                        {total > 0 && <span className="rv-cell-freq">{Math.round(total)}</span>}
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
              {a === 'allIn' ? 'All-in' : a.charAt(0).toUpperCase() + a.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {lockedHand && lockedFreqs && (
        <div className="rv-hand-panel">
          <div className="rv-hand-panel-title">{lockedHand}</div>
          {subtitle && <div className="rv-hand-panel-context">{subtitle}</div>}
          <div className="rv-actions">
            {activeActions.map((a, i) => {
              const f = lockedFreqs[i] || 0
              return (
                <div key={a} className="rv-action-row">
                  <span className="rv-action-label" style={{ color: colors[i] }}>{a === 'allIn' ? 'All-in' : a.charAt(0).toUpperCase() + a.slice(1)}</span>
                  <div className="rv-action-bar">
                    <div className="rv-action-fill" style={{ width: `${f}%`, background: colors[i] }} />
                  </div>
                  <span className="rv-action-pct">{f.toFixed(1)}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default RangeGrid
