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

const GROUP_LABELS: Record<string, string> = {
  'rfi': 'RFI (Open)',
  'lfi': 'LFI (Limp)',
  'general': 'vs Open',
  '3bet': 'vs 3-Bet',
  'all-in': 'vs All-in',
  'iso': 'vs ISO',
}

// Extract position name (e.g. "BTN" from "BU|20")
function posName(hero: string): string {
  return hero.split('|')[0]
}

// ---- Grid component (shared) ----
function RangeGrid({ spot, lockedHand, setLockedHand }: { spot: Spot; lockedHand: string | null; setLockedHand: (h: string | null) => void }) {
  return (
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
                const freq = raiseFreq(spot, cell.hand)
                const isLocked = lockedHand === cell.hand
                return (
                  <td
                    key={ci}
                    className={`rv-cell ${freq > 0 ? 'in-range' : ''} ${isLocked ? 'locked' : ''}`}
                    style={cellStyle(spot, cell.hand)}
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
      <div className="rv-legend">
        <span className="rv-legend-item"><span className="rv-swatch" style={{ background: 'rgba(95, 208, 168, 0.15)' }} /> 0%</span>
        <span className="rv-legend-item"><span className="rv-swatch" style={{ background: 'rgba(95, 208, 168, 0.5)' }} /> 50%</span>
        <span className="rv-legend-item"><span className="rv-swatch" style={{ background: 'rgba(95, 208, 168, 1)' }} /> 100%</span>
      </div>
    </div>
  )
}

// ---- Hand detail component (shared) ----
function HandDetail({ hand, spot, context }: { hand: string; spot: Spot; context: string }) {
  const freqs = spot.hands[hand]
  return (
    <div className="rv-hand-detail">
      <h3>{hand}</h3>
      <p className="muted">{context}</p>
      <div className="rv-actions">
        {spot.actions.map((action, i) => (
          <div key={i} className="rv-action-row">
            <span className="rv-action-label">{action}</span>
            <div className="rv-action-bar">
              <div className="rv-action-fill" style={{ width: `${freqs[i] || 0}%` }} />
            </div>
            <span className="rv-action-pct">{(freqs[i] || 0).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RangeViewerPage() {
  const [data, setData] = useState<SolutionsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'browse' | 'compare'>('compare')

  // Browse mode state
  const [activeSolutionId, setActiveSolutionId] = useState<string>('')
  const [activePosIdx, setActivePosIdx] = useState<number>(-1)
  const [activeSpotIdx, setActiveSpotIdx] = useState<number>(-1)

  // Compare mode state
  const [cmpPos, setCmpPos] = useState<string>('')       // e.g. "BTN"
  const [cmpSpotName, setCmpSpotName] = useState<string>('') // e.g. "BU RFI 40.81%"
  const [cmpSolutionId, setCmpSolutionId] = useState<string>('')

  const [lockedHand, setLockedHand] = useState<string | null>(null)

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

  // ---- Browse mode derived state ----
  const activeSolution = useMemo(
    () => data?.solutions.find((s) => s.id === activeSolutionId) ?? null,
    [data, activeSolutionId]
  )
  const activePosition = activeSolution && activePosIdx >= 0 ? activeSolution.positions[activePosIdx] : null
  const activeSpot = activePosition && activeSpotIdx >= 0 ? activePosition.spots[activeSpotIdx] : null

  // ---- Compare mode: build the list of positions available across all solutions ----
  const allPositions = useMemo(() => {
    if (!data) return []
    const seen = new Set<string>()
    const positions: string[] = []
    for (const sol of data.solutions) {
      for (const pos of sol.positions) {
        const name = posName(pos.hero)
        if (!seen.has(name)) {
          seen.add(name)
          positions.push(name)
        }
      }
    }
    return positions
  }, [data])

  // ---- Compare mode: for the selected position, find all distinct spot names across solutions ----
  const cmpSpotNames = useMemo(() => {
    if (!data || !cmpPos) return []
    const seen = new Set<string>()
    const names: { name: string; group: string }[] = []
    for (const sol of data.solutions) {
      for (const pos of sol.positions) {
        if (posName(pos.hero) !== cmpPos) continue
        for (const spot of pos.spots) {
          if (!seen.has(spot.name)) {
            seen.add(spot.name)
            names.push({ name: spot.name, group: spot.group })
          }
        }
      }
    }
    return names
  }, [data, cmpPos])

  // ---- Compare mode: for the selected position + spot name, find all solutions that have it ----
  const cmpMatchingSolutions = useMemo(() => {
    if (!data || !cmpPos || !cmpSpotName) return []
    const matches: { solution: Solution; spot: Spot }[] = []
    for (const sol of data.solutions) {
      for (const pos of sol.positions) {
        if (posName(pos.hero) !== cmpPos) continue
        const spot = pos.spots.find((s) => s.name === cmpSpotName)
        if (spot) {
          matches.push({ solution: sol, spot })
          break
        }
      }
    }
    return matches
  }, [data, cmpPos, cmpSpotName])

  // ---- Compare mode: the active spot being displayed ----
  const cmpActive = cmpMatchingSolutions.find((m) => m.solution.id === cmpSolutionId) ?? cmpMatchingSolutions[0] ?? null

  // Auto-select first position and first spot when entering compare mode
  useEffect(() => {
    if (mode === 'compare' && !cmpPos && allPositions.length > 0) {
      setCmpPos(allPositions[0])
    }
  }, [mode, cmpPos, allPositions])

  useEffect(() => {
    if (cmpPos && cmpSpotNames.length > 0 && !cmpSpotNames.some((s) => s.name === cmpSpotName)) {
      setCmpSpotName(cmpSpotNames[0].name)
    }
  }, [cmpPos, cmpSpotNames, cmpSpotName])

  useEffect(() => {
    if (cmpMatchingSolutions.length > 0 && !cmpMatchingSolutions.some((m) => m.solution.id === cmpSolutionId)) {
      setCmpSolutionId(cmpMatchingSolutions[0].solution.id)
    }
  }, [cmpMatchingSolutions, cmpSolutionId])

  // ---- Spot count helper ----
  const spotCountByGroup = (pos: Position) => {
    const counts: Record<string, number> = {}
    for (const s of pos.spots) counts[s.group] = (counts[s.group] || 0) + 1
    return counts
  }

  if (error) return <Section title="Range Viewer"><p className="muted">Error loading: {error}</p></Section>
  if (!data) return <Section title="Range Viewer"><p className="muted">Loading solutions...</p></Section>

  const totalSpots = data.solutions.reduce((n, s) => n + s.positions.reduce((m, p) => m + p.spots.length, 0), 0)

  return (
    <>
      <Section title="Range Viewer">
        <p>Browse real solver solutions. Pick a solution, then a hero position, then a spot to see the 13x13 action-frequency grid.</p>
        <Callout><strong>{data.solutions.length} solutions</strong> · {totalSpots} spots total. Data lazy-loaded from <code>solutions.json</code>.</Callout>
      </Section>

      {/* Mode toggle */}
      <Section title="Mode">
        <div className="rv-mode-toggle">
          <button className={`rv-mode-btn ${mode === 'compare' ? 'active' : ''}`} onClick={() => setMode('compare')}>
            Compare
          </button>
          <button className={`rv-mode-btn ${mode === 'browse' ? 'active' : ''}`} onClick={() => setMode('browse')}>
            Browse
          </button>
        </div>
        {mode === 'compare' && (
          <p className="muted rv-mode-hint">Lock a position + spot, then flip through solutions to compare ranges.</p>
        )}
      </Section>

      {/* ==================== COMPARE MODE ==================== */}
      {mode === 'compare' && (
        <>
          {/* Position selector */}
          <Section title="Position">
            <div className="rv-cmp-pos-row">
              {allPositions.map((pos) => (
                <button
                  key={pos}
                  className={`rv-cmp-chip ${pos === cmpPos ? 'active' : ''}`}
                  onClick={() => { setCmpPos(pos); setLockedHand(null) }}
                >
                  {pos}
                </button>
              ))}
            </div>
          </Section>

          {/* Spot name selector */}
          {cmpSpotNames.length > 0 && (
            <Section title={`Spot · ${cmpPos}`}>
              <div className="rv-cmp-spot-row">
                {cmpSpotNames.map((s) => (
                  <button
                    key={s.name}
                    className={`rv-spot-btn ${s.name === cmpSpotName ? 'active' : ''}`}
                    onClick={() => { setCmpSpotName(s.name); setLockedHand(null) }}
                  >
                    <span className="rv-spot-group">{GROUP_LABELS[s.group] || s.group}</span>
                    <span className="rv-spot-name">{s.name}</span>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Solution selector — the quick-flip row */}
          {cmpMatchingSolutions.length > 0 && (
            <Section title="Solutions">
              <div className="rv-cmp-sol-row">
                {cmpMatchingSolutions.map(({ solution }) => (
                  <button
                    key={solution.id}
                    className={`rv-cmp-sol-btn ${solution.id === (cmpActive?.solution.id ?? '') ? 'active' : ''}`}
                    onClick={() => { setCmpSolutionId(solution.id); setLockedHand(null) }}
                  >
                    <span className="rv-cmp-sol-product">{solution.product}</span>
                    <span className="rv-cmp-sol-depth">{solution.depth}</span>
                    <span className="rv-cmp-sol-label">{solution.label.split('·')[1]?.trim() || solution.label}</span>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Grid */}
          {cmpActive && (
            <Section title={`${cmpActive.spot.name} · ${cmpPos}`}>
              <RangeGrid spot={cmpActive.spot} lockedHand={lockedHand} setLockedHand={setLockedHand} />
            </Section>
          )}

          {/* Hand detail */}
          {lockedHand && cmpActive && (
            <Section title={`Hand Detail · ${lockedHand}`}>
              <HandDetail hand={lockedHand} spot={cmpActive.spot} context={`${cmpActive.spot.name} · ${cmpPos} · ${cmpActive.solution.label}`} />
            </Section>
          )}
        </>
      )}

      {/* ==================== BROWSE MODE ==================== */}
      {mode === 'browse' && (
        <>
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
              <RangeGrid spot={activeSpot} lockedHand={lockedHand} setLockedHand={setLockedHand} />
            </Section>
          )}

          {/* Hand detail */}
          {lockedHand && activeSpot && (
            <Section title={`Hand Detail · ${lockedHand}`}>
              <HandDetail hand={lockedHand} spot={activeSpot} context={`${activeSpot.name} · ${activePosition!.hero}`} />
            </Section>
          )}
        </>
      )}
    </>
  )
}

export default RangeViewerPage
