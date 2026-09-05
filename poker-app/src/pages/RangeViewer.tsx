import { useState, useEffect, useMemo } from 'react'
import { Section, Callout } from '../components/ui'

// ---- Types ----
interface Spot {
  name: string
  group: string
  actions: string[]
  hands: Record<string, number[]>
}
interface Position {
  hero: string
  spots: Spot[]
}
interface Solution {
  id: string
  label: string
  product: string
  depth: string
  columns: string[]
  positions: Position[]
}
interface SolutionsData {
  solutions: Solution[]
}

// ---- Hand grid helpers ----
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const

function buildGrid(): { hand: string }[][] {
  return RANKS.map((row, ri) =>
    RANKS.map((col, ci) => {
      if (row === col) return { hand: `${row}${col}` }
      const idx1 = RANKS.indexOf(row), idx2 = RANKS.indexOf(col)
      const [hi, lo] = idx1 < idx2 ? [row, col] : [col, row]
      return { hand: ci > ri ? `${hi}${lo}s` : `${hi}${lo}o` }
    })
  )
}
const GRID = buildGrid()

function raiseFreq(spot: Spot, hand: string): number {
  const freqs = spot.hands[hand]
  if (!freqs) return 0
  return freqs.slice(1).reduce((s, f) => s + f, 0)
}

function cellStyle(spot: Spot, hand: string): React.CSSProperties {
  const freq = raiseFreq(spot, hand)
  if (freq <= 0) return {}
  const opacity = 0.15 + (freq / 100) * 0.85
  return {
    background: `rgba(95, 208, 168, ${opacity.toFixed(3)})`,
    color: freq > 50 ? '#0c1117' : '#d8e2ee',
    fontWeight: freq > 50 ? 700 : 400,
  }
}

// Group label for spot
const GROUP_LABELS: Record<string, string> = {
  'rfi': 'RFI (Open)',
  'lfi': 'LFI (Limp)',
  'general': 'vs Open',
  '3bet': 'vs 3-Bet',
  'all-in': 'vs All-in',
  'iso': 'vs ISO',
}

export function RangeViewerPage() {
  const [data, setData] = useState<SolutionsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeSolutionId, setActiveSolutionId] = useState<string>('')
  const [activePosIdx, setActivePosIdx] = useState<number>(-1)
  const [activeSpotIdx, setActiveSpotIdx] = useState<number>(-1)
  const [lockedHand, setLockedHand] = useState<string | null>(null)

  // Lazy-load solutions.json via fetch
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}solutions.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((d: SolutionsData) => {
        setData(d)
        if (d.solutions.length > 0) setActiveSolutionId(d.solutions[0].id)
      })
      .catch((e) => setError(e.message))
  }, [])

  const activeSolution = useMemo(
    () => data?.solutions.find((s) => s.id === activeSolutionId) ?? null,
    [data, activeSolutionId]
  )

  const activePosition = activeSolution && activePosIdx >= 0 ? activeSolution.positions[activePosIdx] : null
  const activeSpot = activePosition && activeSpotIdx >= 0 ? activePosition.spots[activeSpotIdx] : null
  const lockedFreqs = lockedHand && activeSpot ? activeSpot.hands[lockedHand] : null

  // Count spots per group for a position
  const spotCountByGroup = (pos: Position) => {
    const counts: Record<string, number> = {}
    for (const s of pos.spots) {
      counts[s.group] = (counts[s.group] || 0) + 1
    }
    return counts
  }

  if (error) return <Section title="Range Viewer"><p className="muted">Error loading: {error}</p></Section>
  if (!data) return <Section title="Range Viewer"><p className="muted">Loading solutions...</p></Section>

  return (
    <>
      <Section title="Range Viewer">
        <p>Browse real solver solutions. Pick a solution, then a hero position, then a spot to see the 13x13 action-frequency grid.</p>
        <Callout><strong>{data.solutions.length} solutions</strong> · {data.solutions.reduce((n, s) => n + s.positions.reduce((m, p) => m + p.spots.length, 0), 0)} spots total. Data lazy-loaded from <code>solutions.json</code>.</Callout>
      </Section>

      {/* Solution selector */}
      <Section title="Solutions">
        <div className="rv-solution-list">
          {data.solutions.map((sol) => (
            <button
              key={sol.id}
              className={`rv-scenario-btn ${sol.id === activeSolutionId ? 'active' : ''}`}
              onClick={() => { setActiveSolutionId(sol.id); setActivePosIdx(-1); setActiveSpotIdx(-1); setLockedHand(null) }}
            >
              <span className="rv-sol-product">{sol.product}</span>
              <span className="rv-sol-label">{sol.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Position selector */}
      {activeSolution && (
        <Section title={`Positions · ${activeSolution.label}`}>
          <div className="rv-pos-list">
            {activeSolution.positions.map((pos, pi) => {
              const counts = spotCountByGroup(pos)
              const groupSummary = Object.entries(counts).map(([g, n]) => `${GROUP_LABELS[g] || g}: ${n}`).join(' · ')
              return (
                <button
                  key={pi}
                  className={`rv-pos-btn ${pi === activePosIdx ? 'active' : ''}`}
                  onClick={() => { setActivePosIdx(pi); setActiveSpotIdx(-1); setLockedHand(null) }}
                >
                  <span className="rv-pos-hero">{pos.hero}</span>
                  <span className="rv-pos-count">{pos.spots.length} spots</span>
                  <span className="rv-pos-groups">{groupSummary}</span>
                </button>
              )
            })}
          </div>
        </Section>
      )}

      {/* Spot selector */}
      {activePosition && (
        <Section title={`Spots · ${activePosition.hero}`}>
          <div className="rv-spot-list">
            {activePosition.spots.map((spot, si) => (
              <button
                key={si}
                className={`rv-spot-btn ${si === activeSpotIdx ? 'active' : ''}`}
                onClick={() => { setActiveSpotIdx(si); setLockedHand(null) }}
              >
                <span className="rv-spot-group">{GROUP_LABELS[spot.group] || spot.group}</span>
                <span className="rv-spot-name">{spot.name}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Grid */}
      {activeSpot && (
        <Section title={`${activeSpot.name} · ${activePosition!.hero}`}>
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
                      const freq = raiseFreq(activeSpot, cell.hand)
                      const isLocked = lockedHand === cell.hand
                      return (
                        <td
                          key={ci}
                          className={`rv-cell ${freq > 0 ? 'in-range' : ''} ${isLocked ? 'locked' : ''}`}
                          style={cellStyle(activeSpot, cell.hand)}
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
            <span className="rv-legend-item"><span className="rv-swatch" style={{ background: 'rgba(95, 208, 168, 0.15)' }} /> 0%</span>
            <span className="rv-legend-item"><span className="rv-swatch" style={{ background: 'rgba(95, 208, 168, 0.5)' }} /> 50%</span>
            <span className="rv-legend-item"><span className="rv-swatch" style={{ background: 'rgba(95, 208, 168, 1)' }} /> 100%</span>
          </div>
        </Section>
      )}

      {/* Hand detail */}
      {lockedHand && lockedFreqs && activeSpot && (
        <Section title={`Hand Detail · ${lockedHand}`}>
          <div className="rv-hand-detail">
            <h3>{lockedHand}</h3>
            <p className="muted">{activeSpot.name} · {activePosition!.hero}</p>
            <div className="rv-actions">
              {activeSpot.actions.map((action, i) => (
                <div key={i} className="rv-action-row">
                  <span className="rv-action-label">{action}</span>
                  <div className="rv-action-bar">
                    <div className="rv-action-fill" style={{ width: `${lockedFreqs[i] || 0}%` }} />
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
