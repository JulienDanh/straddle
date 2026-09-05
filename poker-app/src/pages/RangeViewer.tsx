import { useState, useMemo } from 'react'
import { Section, Callout } from '../components/ui'
import rangesData from '../data/ranges.json'

// ---- Hand grid helpers ----
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const

// Build the 13x13 grid cells (row = first rank, col = second rank)
// Upper triangle (col > row) = suited, diagonal = pairs, lower = offsuit
function buildGrid(): { hand: string }[][] {
  return RANKS.map((row, ri) =>
    RANKS.map((col, ci) => {
      if (row === col) return { hand: `${row}${col}` }
      const idx1 = RANKS.indexOf(row), idx2 = RANKS.indexOf(col)
      const [hi, lo] = idx1 < idx2 ? [row, col] : [col, row]
      const hand = ci > ri ? `${hi}${lo}s` : `${hi}${lo}o`
      return { hand }
    })
  )
}

const GRID = buildGrid()

// ---- Types ----
interface RangeScenario {
  id: string
  label: string
  category: string
  description: string
  position: string
  spot: string
  actions: string[]
  hands: Record<string, number[]>
}

const SCENARIOS: RangeScenario[] = (rangesData as { scenarios: RangeScenario[] }).scenarios

// Cell color: intensity based on the raise frequency (sum of non-fold action freqs)
function raiseFreq(scenario: RangeScenario, hand: string): number {
  const freqs = scenario.hands[hand]
  if (!freqs) return 0
  return freqs.slice(1).reduce((s, f) => s + f, 0)
}

function cellStyle(scenario: RangeScenario, hand: string): React.CSSProperties {
  const freq = raiseFreq(scenario, hand)
  if (freq <= 0) return {}
  const opacity = 0.15 + (freq / 100) * 0.85
  return {
    background: `rgba(95, 208, 168, ${opacity.toFixed(3)})`,
    color: freq > 50 ? '#0c1117' : '#d8e2ee',
    fontWeight: freq > 50 ? 700 : 400,
  }
}

export function RangeViewerPage() {
  const categories = useMemo(
    () => Array.from(new Set(SCENARIOS.map((s) => s.category))),
    []
  )

  const [activeId, setActiveId] = useState(SCENARIOS[0].id)
  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0]

  const [lockedHand, setLockedHand] = useState<string | null>(null)
  const lockedFreqs = lockedHand ? active.hands[lockedHand] : null

  const inRangeCount = useMemo(
    () => Object.entries(active.hands).filter(([, freqs]) => freqs.slice(1).reduce((s, f) => s + f, 0) > 0).length,
    [active]
  )

  return (
    <>
      <Section title="Range Viewer">
        <p>Interactive preflop range grid with real solver data. Select a scenario to see action frequencies for all 169 hands. Click a hand to lock its detail.</p>
        <Callout><strong>Real data.</strong> Ranges extracted from BBZ solver solutions. {SCENARIOS.length} scenarios across ChipEV and ICM (bubble).</Callout>
      </Section>

      <Section title="Scenarios">
        <div className="rv-scenarios">
          {categories.map((cat) => (
            <div key={cat} className="rv-category">
              <div className="rv-cat-label">{cat}</div>
              {SCENARIOS.filter((s) => s.category === cat).map((s) => (
                <button
                  key={s.id}
                  className={`rv-scenario-btn ${s.id === activeId ? 'active' : ''}`}
                  onClick={() => { setActiveId(s.id); setLockedHand(null) }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="rv-active-desc">
          <h3>{active.label}</h3>
          <p className="muted">{active.description}</p>
          <p className="rv-count">{active.spot} · {inRangeCount} hands in range</p>
        </div>
      </Section>

      <Section title="Hand Grid">
        <div className="rv-grid-wrap">
          <table className="rv-grid">
            <thead>
              <tr>
                <th></th>
                {RANKS.map((r) => <th key={r}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {GRID.map((rowCells, ri) => (
                <tr key={ri}>
                  <th className="rv-rowhead">{RANKS[ri]}</th>
                  {rowCells.map((cell, ci) => {
                    const freq = raiseFreq(active, cell.hand)
                    const isLocked = lockedHand === cell.hand
                    return (
                      <td
                        key={ci}
                        className={`rv-cell ${freq > 0 ? 'in-range' : ''} ${isLocked ? 'locked' : ''}`}
                        style={cellStyle(active, cell.hand)}
                        title={cell.hand}
                        onClick={() => setLockedHand(isLocked ? null : cell.hand)}
                      >
                        {cell.hand}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rv-legend">
          <span className="rv-legend-item">
            <span className="rv-swatch" style={{ background: 'rgba(95, 208, 168, 0.15)' }} /> 0%
          </span>
          <span className="rv-legend-item">
            <span className="rv-swatch" style={{ background: 'rgba(95, 208, 168, 0.5)' }} /> 50%
          </span>
          <span className="rv-legend-item">
            <span className="rv-swatch" style={{ background: 'rgba(95, 208, 168, 1)' }} /> 100%
          </span>
        </div>
      </Section>

      {lockedHand && lockedFreqs && (
        <Section title={`Hand Detail · ${lockedHand}`}>
          <div className="rv-hand-detail">
            <h3>{lockedHand}</h3>
            <p className="muted">{active.label} · {active.spot}</p>
            <div className="rv-actions">
              {active.actions.map((action, i) => (
                <div key={i} className="rv-action-row">
                  <span className="rv-action-label">{action}</span>
                  <div className="rv-action-bar">
                    <div
                      className="rv-action-fill"
                      style={{ width: `${lockedFreqs[i] || 0}%` }}
                    />
                  </div>
                  <span className="rv-action-pct">{(lockedFreqs[i] || 0).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  )
}

export default RangeViewerPage
