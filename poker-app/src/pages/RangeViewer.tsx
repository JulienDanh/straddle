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
  'rfi': 'RFI',
  'lfi': 'LFI',
  'general': 'vs Open',
  '3bet': 'vs 3-Bet',
  'all-in': 'vs All-in',
  'iso': 'vs ISO',
}

function posName(hero: string): string {
  return hero.split('|')[0]
}

// Normalize position names to display
function normalizePos(name: string): string {
  if (name === 'BU') return 'BTN'
  return name
}

// ---- Spot key: position + spot name (the unique identifier) ----
interface SpotKey {
  pos: string       // normalized position: "BTN", "UTG", etc.
  spotName: string  // raw spot name: "BU RFI 40.81%", "vs UTG RFI", etc.
  group: string
  label: string     // display label: "BTN · RFI"
}

// ---- Grid component ----
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

export function RangeViewerPage() {
  const [data, setData] = useState<SolutionsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // The selected spot key: "pos||spotName"
  const [activeSpotKey, setActiveSpotKey] = useState<string>('')
  // The selected solution to display
  const [activeSolutionId, setActiveSolutionId] = useState<string>('')
  const [lockedHand, setLockedHand] = useState<string | null>(null)
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}solutions.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((d: SolutionsData) => setData(d))
      .catch((e) => setError(e.message))
  }, [])

  // ---- Build the master list of unique spots across all solutions ----
  // Key: "pos||spotName", deduplicated
  const allSpots = useMemo(() => {
    if (!data) return [] as SpotKey[]
    const seen = new Set<string>()
    const spots: SpotKey[] = []
    for (const sol of data.solutions) {
      for (const pos of sol.positions) {
        const pn = normalizePos(posName(pos.hero))
        for (const spot of pos.spots) {
          const key = `${pn}||${spot.name}`
          if (!seen.has(key)) {
            seen.add(key)
            // Build a clean label: "POS · GroupLabel" or "POS · spotName"
            const groupLabel = GROUP_LABELS[spot.group] || spot.group
            spots.push({
              pos: pn,
              spotName: spot.name,
              group: spot.group,
              label: `${pn} · ${groupLabel}`,
            })
          }
        }
      }
    }
    // Sort: by position order (BB, SB, BTN, CO, HJ, LJ, MP, UTG), then by group
    const posOrder = ['BB', 'SB', 'BTN', 'CO', 'HJ', 'LJ', 'MP', 'UTG']
    const groupOrder = ['rfi', 'lfi', 'general', '3bet', 'all-in', 'iso']
    spots.sort((a, b) => {
      const pa = posOrder.indexOf(a.pos)
      const pb = posOrder.indexOf(b.pos)
      if (pa !== pb) return pa - pb
      const ga = groupOrder.indexOf(a.group)
      const gb = groupOrder.indexOf(b.group)
      if (ga !== gb) return ga - gb
      return a.spotName.localeCompare(b.spotName)
    })
    return spots
  }, [data])

  // ---- Filter spots by text ----
  const filteredSpots = useMemo(() => {
    if (!filterText.trim()) return allSpots
    const q = filterText.toLowerCase()
    return allSpots.filter((s) =>
      s.label.toLowerCase().includes(q) ||
      s.pos.toLowerCase().includes(q) ||
      s.spotName.toLowerCase().includes(q) ||
      (GROUP_LABELS[s.group] || s.group).toLowerCase().includes(q)
    )
  }, [allSpots, filterText])

  // ---- For the selected spot, find all solutions that have it ----
  const matchingSolutions = useMemo(() => {
    if (!data || !activeSpotKey) return [] as { solution: Solution; spot: Spot }[]
    const [pos, spotName] = activeSpotKey.split('||')
    const matches: { solution: Solution; spot: Spot }[] = []
    for (const sol of data.solutions) {
      for (const p of sol.positions) {
        if (normalizePos(posName(p.hero)) !== pos) continue
        const spot = p.spots.find((s) => s.name === spotName)
        if (spot) {
          matches.push({ solution: sol, spot })
          break
        }
      }
    }
    return matches
  }, [data, activeSpotKey])

  // ---- The active spot being displayed ----
  const activeEntry = matchingSolutions.find((m) => m.solution.id === activeSolutionId) ?? matchingSolutions[0] ?? null

  // Auto-select first spot when data loads
  useEffect(() => {
    if (allSpots.length > 0 && !activeSpotKey) {
      // Default to first RFI spot
      const firstRfi = allSpots.find((s) => s.group === 'rfi') ?? allSpots[0]
      setActiveSpotKey(`${firstRfi.pos}||${firstRfi.spotName}`)
    }
  }, [allSpots, activeSpotKey])

  // Auto-select first solution when spot changes
  useEffect(() => {
    if (matchingSolutions.length > 0 && !matchingSolutions.some((m) => m.solution.id === activeSolutionId)) {
      setActiveSolutionId(matchingSolutions[0].solution.id)
    }
  }, [matchingSolutions, activeSolutionId])

  if (error) return <Section title="Range Viewer"><p className="muted">Error loading: {error}</p></Section>
  if (!data) return <Section title="Range Viewer"><p className="muted">Loading solutions...</p></Section>

  const activeSpotKeyParsed = activeSpotKey ? allSpots.find((s) => `${s.pos}||${s.spotName}` === activeSpotKey) : null

  return (
    <>
      <Section title="Range Viewer">
        <p>Pick a spot, then flip through solutions to compare ranges across stack depths and ICM stages.</p>
        <Callout><strong>{data.solutions.length} solutions</strong> · {allSpots.length} unique spots. Data lazy-loaded from <code>solutions.json</code>.</Callout>
      </Section>

      {/* Spot selector with filter */}
      <Section title="Spot">
        <input
          className="rv-filter"
          type="text"
          placeholder="Filter: e.g. BTN RFI, vs 3bet, UTG..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <div className="rv-spot-grid">
          {filteredSpots.map((s) => {
            const key = `${s.pos}||${s.spotName}`
            return (
              <button
                key={key}
                className={`rv-spot-pick ${key === activeSpotKey ? 'active' : ''}`}
                onClick={() => { setActiveSpotKey(key); setLockedHand(null) }}
              >
                <span className="rv-spot-pick-pos">{s.pos}</span>
                <span className="rv-spot-pick-group">{GROUP_LABELS[s.group] || s.group}</span>
                <span className="rv-spot-pick-name">{s.spotName}</span>
              </button>
            )
          })}
        </div>
      </Section>

      {/* Solution flip row */}
      {matchingSolutions.length > 0 && (
        <Section title={`${activeSpotKeyParsed?.label ?? ''} · ${matchingSolutions.length} solutions`}>
          <div className="rv-cmp-sol-row">
            {matchingSolutions.map(({ solution }) => (
              <button
                key={solution.id}
                className={`rv-cmp-sol-btn ${solution.id === (activeEntry?.solution.id ?? '') ? 'active' : ''}`}
                onClick={() => { setActiveSolutionId(solution.id); setLockedHand(null) }}
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
      {activeEntry && (
        <Section title={`${activeEntry.spot.name} · ${activeSpotKeyParsed?.pos} · ${activeEntry.solution.label}`}>
          <RangeGrid spot={activeEntry.spot} lockedHand={lockedHand} setLockedHand={setLockedHand} />
        </Section>
      )}

      {/* Hand detail */}
      {lockedHand && activeEntry && (
        <Section title={`Hand Detail · ${lockedHand}`}>
          <div className="rv-hand-detail">
            <h3>{lockedHand}</h3>
            <p className="muted">{activeEntry.spot.name} · {activeSpotKeyParsed?.pos} · {activeEntry.solution.label}</p>
            <div className="rv-actions">
              {activeEntry.spot.actions.map((action, i) => (
                <div key={i} className="rv-action-row">
                  <span className="rv-action-label">{action}</span>
                  <div className="rv-action-bar">
                    <div className="rv-action-fill" style={{ width: `${activeEntry.spot.hands[lockedHand][i] || 0}%` }} />
                  </div>
                  <span className="rv-action-pct">{(activeEntry.spot.hands[lockedHand][i] || 0).toFixed(1)}%</span>
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
