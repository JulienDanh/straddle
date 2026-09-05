import { useState, useEffect, useMemo } from 'react'
import { Section, Callout } from '../components/ui'

// ---- Types for raw solution files ----
interface RawCell {
  name: string
  group: string
  nodeId: number
}
interface RawNode {
  ranges: Record<string, { freq: number[] }>[]
  percentages: { action: string }[]
}
interface RawSolution {
  columns: string[]
  table: Record<string, (RawCell | RawCell[])[]>
  nodes: Record<string, RawNode>
}

// ---- Manifest ----
interface ManifestEntry {
  id: string
  label: string
  product: string
  depth: string
  file: string
}

// ---- Parsed spot ----
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
interface ParsedSolution {
  id: string
  label: string
  product: string
  depth: string
  columns: string[]
  positions: Position[]
}

// ---- Grid helpers ----
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const

const HAND_GRID: { hand: string }[][] = RANKS.map((row, ri) =>
  RANKS.map((col, ci) => {
    if (row === col) return { hand: `${row}${col}` }
    const idx1 = RANKS.indexOf(row), idx2 = RANKS.indexOf(col)
    const [hi, lo] = idx1 < idx2 ? [row, col] : [col, row]
    return { hand: ci > ri ? `${hi}${lo}s` : `${hi}${lo}o` }
  })
)

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
  const name = hero.split('|')[0]
  return name === 'BU' ? 'BTN' : name
}

// Strip trailing percentage from spot names so the same spot aggregates
// across solutions (e.g. "SB RFI 85.57%" → "SB RFI", "vs UTG RFI" stays as-is)
function normalizeSpotName(name: string): string {
  return name.replace(/\s+\d+(\.\d+)?%$/, '').trim()
}

// ---- Parse a raw solution file into spots grouped by position ----
function parseSolution(raw: RawSolution, manifest: ManifestEntry): ParsedSolution {
  const columns = raw.columns
  const positions: Position[] = []

  for (let rowIdx = 1; rowIdx <= columns.length; rowIdx++) {
    const hero = columns[rowIdx - 1]
    const cells = raw.table[String(rowIdx)] || []
    const spots: Spot[] = []
    const seenNodeIds = new Set<number>()

    for (const cg of cells) {
      const items = Array.isArray(cg) ? cg : [cg]
      for (const cell of items) {
        if (typeof cell.nodeId !== 'number') continue
        if (seenNodeIds.has(cell.nodeId)) continue
        seenNodeIds.add(cell.nodeId)
        const node = raw.nodes[String(cell.nodeId)]
        if (!node) continue

        const hands: Record<string, number[]> = {}
        for (let ri = 0; ri < (node.ranges || []).length; ri++) {
          for (let ci = 0; ci < Object.keys(node.ranges[ri] || {}).length; ci++) {
            const key = Object.keys(node.ranges[ri])[ci]
            const val = node.ranges[ri][key]
            const hand = HAND_GRID[ri][ci].hand
            hands[hand] = (val?.freq || []).map(Number)
          }
        }

        const actions = (node.percentages || []).map((p) => p.action)
        spots.push({
          name: normalizeSpotName(cell.name),
          group: cell.group,
          actions,
          hands,
        })
      }
    }
    if (spots.length > 0) positions.push({ hero, spots })
  }

  return {
    id: manifest.id,
    label: manifest.label,
    product: manifest.product,
    depth: manifest.depth,
    columns,
    positions,
  }
}

// ---- Build unique spot keys across all loaded solutions ----
interface SpotKey {
  pos: string
  spotName: string
  group: string
  label: string
}

function buildSpotKeys(solutions: ParsedSolution[]): SpotKey[] {
  const seen = new Set<string>()
  const spots: SpotKey[] = []
  for (const sol of solutions) {
    for (const pos of sol.positions) {
      const pn = posName(pos.hero)
      for (const spot of pos.spots) {
        const key = `${pn}||${spot.name}`
        if (!seen.has(key)) {
          seen.add(key)
          const gl = GROUP_LABELS[spot.group] || spot.group
          spots.push({ pos: pn, spotName: spot.name, group: spot.group, label: `${pn} · ${gl}` })
        }
      }
    }
  }
  const posOrder = ['BB', 'SB', 'BTN', 'CO', 'HJ', 'LJ', 'MP', 'UTG']
  const groupOrder = ['rfi', 'lfi', 'general', '3bet', 'all-in', 'iso']
  spots.sort((a, b) => {
    const pa = posOrder.indexOf(a.pos), pb = posOrder.indexOf(b.pos)
    if (pa !== pb) return pa - pb
    const ga = groupOrder.indexOf(a.group), gb = groupOrder.indexOf(b.group)
    if (ga !== gb) return ga - gb
    return a.spotName.localeCompare(b.spotName)
  })
  return spots
}

export function RangeViewerPage() {
  const [manifest, setManifest] = useState<ManifestEntry[]>([])
  const [solutions, setSolutions] = useState<Map<string, ParsedSolution>>(new Map())
  const [loadingCount, setLoadingCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const [activeSpotKey, setActiveSpotKey] = useState('')
  const [activeSolutionId, setActiveSolutionId] = useState('')
  const [lockedHand, setLockedHand] = useState<string | null>(null)
  const [filterText, setFilterText] = useState('')

  // Load manifest, then fetch all raw solution files in parallel
  useEffect(() => {
    const base = import.meta.env.BASE_URL
    fetch(`${base}data/manifest.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(async (entries: ManifestEntry[]) => {
        setManifest(entries)
        setTotalCount(entries.length)
        const map = new Map<string, ParsedSolution>()
        let loaded = 0
        await Promise.all(entries.map(async (entry) => {
          const res = await fetch(`${base}data/${entry.file}`)
          if (!res.ok) throw new Error(`Failed to load ${entry.file}`)
          const raw: RawSolution = await res.json()
          const parsed = parseSolution(raw, entry)
          map.set(entry.id, parsed)
          loaded++
          setLoadingCount(loaded)
        }))
        setSolutions(map)
      })
      .catch((e) => setError(e.message))
  }, [])

  // All spot keys across all solutions
  const allSpots = useMemo(() => buildSpotKeys(Array.from(solutions.values())), [solutions])

  const filteredSpots = useMemo(() => {
    if (!filterText.trim()) return allSpots
    const q = filterText.toLowerCase()
    return allSpots.filter((s) =>
      s.label.toLowerCase().includes(q) ||
      s.pos.toLowerCase().includes(q) ||
      s.spotName.toLowerCase().includes(q)
    )
  }, [allSpots, filterText])

  // Solutions that have the selected spot
  const matchingSolutions = useMemo(() => {
    if (!activeSpotKey || solutions.size === 0) return [] as { solution: ParsedSolution; spot: Spot }[]
    const [pos, spotName] = activeSpotKey.split('||')
    const matches: { solution: ParsedSolution; spot: Spot }[] = []
    for (const sol of Array.from(solutions.values())) {
      for (const p of sol.positions) {
        if (posName(p.hero) !== pos) continue
        const spot = p.spots.find((s) => s.name === spotName)
        if (spot) { matches.push({ solution: sol, spot }); break }
      }
    }
    return matches
  }, [solutions, activeSpotKey])

  const activeEntry = matchingSolutions.find((m) => m.solution.id === activeSolutionId) ?? matchingSolutions[0] ?? null

  // Auto-select defaults
  useEffect(() => {
    if (allSpots.length > 0 && !activeSpotKey) {
      const firstRfi = allSpots.find((s) => s.group === 'rfi') ?? allSpots[0]
      setActiveSpotKey(`${firstRfi.pos}||${firstRfi.spotName}`)
    }
  }, [allSpots, activeSpotKey])

  useEffect(() => {
    if (matchingSolutions.length > 0 && !matchingSolutions.some((m) => m.solution.id === activeSolutionId)) {
      setActiveSolutionId(matchingSolutions[0].solution.id)
    }
  }, [matchingSolutions, activeSolutionId])

  const isLoading = solutions.size < manifest.length || manifest.length === 0
  const activeSpotKeyParsed = activeSpotKey ? allSpots.find((s) => `${s.pos}||${s.spotName}` === activeSpotKey) : null

  if (error) return <Section title="Range Viewer"><p className="muted">Error: {error}</p></Section>

  return (
    <>
      <Section title="Range Viewer">
        <p>Pick a spot, then flip through solutions to compare ranges across stack depths and ICM stages.</p>
        {isLoading && totalCount > 0 ? (
          <Callout variant="warn"><strong>Loading solutions... {loadingCount}/{totalCount}</strong></Callout>
        ) : (
          <Callout><strong>{solutions.size} solutions loaded</strong> · {allSpots.length} unique spots. Raw solver files parsed client-side.</Callout>
        )}
      </Section>

      {!isLoading && (
        <>
          {/* Spot selector */}
          <Section title="Spot">
            <input
              className="rv-filter"
              type="text"
              placeholder="Filter: e.g. BTN, UTG, vs 3bet..."
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

          {/* Solution flip row — grouped by product */}
          {matchingSolutions.length > 0 && (
            <Section title={`${activeSpotKeyParsed?.label ?? ''} · ${matchingSolutions.length} solutions`}>
              {(() => {
                const groups: Record<string, typeof matchingSolutions> = {}
                for (const m of matchingSolutions) {
                  const g = m.solution.product
                  if (!groups[g]) groups[g] = []
                  groups[g].push(m)
                }
                return Object.entries(groups).map(([product, items]) => (
                  <div key={product} className="rv-sol-group">
                    <div className="rv-sol-group-label">{product}</div>
                    <div className="rv-cmp-sol-row">
                      {items.map(({ solution }) => (
                        <button
                          key={solution.id}
                          className={`rv-cmp-sol-btn ${solution.id === (activeEntry?.solution.id ?? '') ? 'active' : ''}`}
                          onClick={() => { setActiveSolutionId(solution.id); setLockedHand(null) }}
                        >
                          <span className="rv-cmp-sol-depth">{solution.depth}</span>
                          <span className="rv-cmp-sol-label">{solution.label.split('·')[1]?.trim() || solution.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </Section>
          )}

          {/* Grid */}
          {activeEntry && (
            <Section title={`${activeEntry.spot.name} · ${activeSpotKeyParsed?.pos} · ${activeEntry.solution.label}`}>
              <div className="rv-grid-wrap">
                <table className="rv-grid">
                  <thead>
                    <tr>
                      <th></th>
                      {RANKS.map((r) => <th key={r}>{r}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {HAND_GRID.map((rowCells, ri) => (
                      <tr key={ri}>
                        <th className="rv-rowhead">{RANKS[ri]}</th>
                        {rowCells.map((cell, ci) => {
                          const freq = raiseFreq(activeEntry.spot, cell.hand)
                          const isLocked = lockedHand === cell.hand
                          return (
                            <td
                              key={ci}
                              className={`rv-cell ${freq > 0 ? 'in-range' : ''} ${isLocked ? 'locked' : ''}`}
                              style={cellStyle(activeEntry.spot, cell.hand)}
                              title={cell.hand}
                              onClick={() => setLockedHand(isLocked ? null : cell.hand)}
                            >
                              <span className="rv-cell-hand">{cell.hand}</span>
                              {freq > 0 && <span className="rv-cell-freq">{freq.toFixed(0)}</span>}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        <div className="rv-action-fill" style={{ width: `${activeEntry.spot.hands[lockedHand]?.[i] || 0}%` }} />
                      </div>
                      <span className="rv-action-pct">{(activeEntry.spot.hands[lockedHand]?.[i] || 0).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}
        </>
      )}
    </>
  )
}

export default RangeViewerPage
