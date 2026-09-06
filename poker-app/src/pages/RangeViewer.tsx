import { useState, useEffect, useMemo } from 'react'
import { Section, Callout } from '../components/ui'

// ---- Types ----
interface RawCell { name: string; group: string; nodeId: number }
interface RawNode { ranges: Record<string, { freq: number[] }>[]; percentages: { action: string }[] }
interface RawSolution { columns: string[]; table: Record<string, (RawCell | RawCell[])[]>; nodes: Record<string, RawNode> }

interface ManifestEntry { id: string; label: string; product: string; category: string; depth: string; file: string }
interface Spot { name: string; group: string; actions: string[]; hands: Record<string, number[]> }
interface Position { hero: string; spots: Spot[] }
interface ParsedSolution { id: string; label: string; product: string; category: string; depth: string; columns: string[]; positions: Position[] }
interface SpotKey { pos: string; spotName: string; group: string }

// ---- Constants ----
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const

const HAND_GRID: { hand: string }[][] = RANKS.map((row, ri) =>
  RANKS.map((col, ci) => {
    if (row === col) return { hand: `${row}${col}` }
    const idx1 = RANKS.indexOf(row), idx2 = RANKS.indexOf(col)
    const [hi, lo] = idx1 < idx2 ? [row, col] : [col, row]
    return { hand: ci > ri ? `${hi}${lo}s` : `${hi}${lo}o` }
  })
)

const POS_ORDER = ['BB', 'SB', 'BTN', 'CO', 'HJ', 'LJ', 'MP', 'UTG']
const GROUP_ORDER = ['rfi', 'lfi', 'general', '3bet', 'all-in', 'iso']
const GROUP_LABELS: Record<string, string> = {
  'rfi': 'RFI', 'lfi': 'LFI', 'general': 'vs Open', '3bet': 'vs 3-Bet', 'all-in': 'vs All-in', 'iso': 'vs ISO',
}
const CAT_ORDER: Record<string, number> = {
  'ChipEV': 0, 'ICM 83% left': 1, 'ICM 40% left': 2, 'ICM ITM Bubble': 3, 'ICM Bubble': 4,
}

// ---- Helpers ----
function posName(hero: string): string { const n = hero.split('|')[0]; return n === 'BU' ? 'BTN' : n }
function normalizeSpotName(name: string): string { return name.replace(/\s+\d+(\.\d+)?%$/, '').trim() }

function spotHero(spotName: string, rowHero: string): string {
  const name = normalizeSpotName(spotName)
  if (name.endsWith(' RFI') || name.endsWith(' LFI')) {
    const opener = name.split(' ')[0]
    if (opener && opener !== 'vs') return opener === 'BU' ? 'BTN' : opener
  }
  if (name.includes(' vs ')) {
    const defender = name.split(' vs ')[0].trim()
    if (defender) return defender === 'BU' ? 'BTN' : defender
  }
  return rowHero
}

function raiseFreq(spot: Spot, hand: string): number {
  const f = spot.hands[hand]; if (!f) return 0
  return f.slice(1).reduce((s, v) => s + v, 0)
}

function cellStyle(spot: Spot, hand: string): React.CSSProperties {
  const freq = raiseFreq(spot, hand)
  if (freq <= 0) return {}
  const opacity = 0.15 + (freq / 100) * 0.85
  return { background: `rgba(95, 208, 168, ${opacity.toFixed(3)})`, color: freq > 50 ? '#0c1117' : '#d8e2ee', fontWeight: freq > 50 ? 700 : 400 }
}

function parseSolution(raw: RawSolution, manifest: ManifestEntry): ParsedSolution {
  const posMap = new Map<string, Position>()
  for (let rowIdx = 1; rowIdx <= raw.columns.length; rowIdx++) {
    const rowHero = posName(raw.columns[rowIdx - 1])
    const seenNodeIds = new Set<number>()
    for (const cg of raw.table[String(rowIdx)] || []) {
      const items = Array.isArray(cg) ? cg : [cg]
      for (const cell of items) {
        if (typeof cell.nodeId !== 'number') continue
        if (seenNodeIds.has(cell.nodeId)) continue
        seenNodeIds.add(cell.nodeId)
        const node = raw.nodes[String(cell.nodeId)]
        if (!node) continue
        const hands: Record<string, number[]> = {}
        for (let ri = 0; ri < (node.ranges || []).length; ri++)
          for (let ci = 0; ci < Object.keys(node.ranges[ri] || {}).length; ci++)
            hands[HAND_GRID[ri][ci].hand] = (node.ranges[ri][Object.keys(node.ranges[ri])[ci]]?.freq || []).map(Number)
        const spotName = normalizeSpotName(cell.name)
        const hero = spotHero(cell.name, rowHero)
        if (!posMap.has(hero)) posMap.set(hero, { hero, spots: [] })
        posMap.get(hero)!.spots.push({ name: spotName, group: cell.group, actions: (node.percentages || []).map((p) => p.action), hands })
      }
    }
  }
  return {
    id: manifest.id, label: manifest.label, product: manifest.product, category: manifest.category, depth: manifest.depth,
    columns: raw.columns,
    positions: Array.from(posMap.values()).sort((a, b) => POS_ORDER.indexOf(a.hero) - POS_ORDER.indexOf(b.hero)),
  }
}

function buildSpotKeys(solutions: ParsedSolution[]): SpotKey[] {
  const seen = new Set<string>(); const spots: SpotKey[] = []
  for (const sol of solutions) for (const pos of sol.positions)
    for (const spot of pos.spots) {
      const pn = posName(pos.hero); const key = `${pn}||${spot.name}`
      if (!seen.has(key)) { seen.add(key); spots.push({ pos: pn, spotName: spot.name, group: spot.group }) }
    }
  spots.sort((a, b) => {
    const pa = POS_ORDER.indexOf(a.pos), pb = POS_ORDER.indexOf(b.pos); if (pa !== pb) return pa - pb
    const ga = GROUP_ORDER.indexOf(a.group), gb = GROUP_ORDER.indexOf(b.group); if (ga !== gb) return ga - gb
    return a.spotName.localeCompare(b.spotName)
  })
  return spots
}

const depthVal = (d: string) => parseInt(d) || 0

// ---- Component ----
export function RangeViewerPage() {
  const [manifest, setManifest] = useState<ManifestEntry[]>([])
  const [solutions, setSolutions] = useState<Map<string, ParsedSolution>>(new Map())
  const [loadingCount, setLoadingCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const [activePos, setActivePos] = useState('')
  const [activeGroup, setActiveGroup] = useState('')
  const [activeSpotName, setActiveSpotName] = useState('')
  const [activeDepth, setActiveDepth] = useState('')
  const [activeSolutionId, setActiveSolutionId] = useState('')
  const [lockedHand, setLockedHand] = useState<string | null>(null)

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    fetch(`${base}data/manifest.json`).then(r => r.json()).then(async (entries: ManifestEntry[]) => {
      setManifest(entries); setTotalCount(entries.length)
      const map = new Map<string, ParsedSolution>(); let loaded = 0
      await Promise.all(entries.map(async (entry) => {
        const res = await fetch(`${base}data/${entry.file}`)
        if (!res.ok) throw new Error(`Failed: ${entry.file}`)
        map.set(entry.id, parseSolution(await res.json(), entry))
        loaded++; setLoadingCount(loaded)
      }))
      setSolutions(map)
    }).catch(e => setError(e.message))
  }, [])

  const allSpots = useMemo(() => buildSpotKeys(Array.from(solutions.values())), [solutions])

  // Available facets (based on data)
  const availablePositions = useMemo(() => {
    const seen = new Set(allSpots.map(s => s.pos)); return POS_ORDER.filter(p => seen.has(p))
  }, [allSpots])

  const availableGroups = useMemo(() => {
    const spots = activePos ? allSpots.filter(s => s.pos === activePos) : allSpots
    const seen = new Set(spots.map(s => s.group)); return GROUP_ORDER.filter(g => seen.has(g))
  }, [allSpots, activePos])

  const availableDepths = useMemo(() => {
    const depths = new Set(manifest.map(m => m.depth))
    return Array.from(depths).sort((a, b) => depthVal(a) - depthVal(b))
  }, [manifest])

  const availableCategories = useMemo(() => {
    const cats = new Set(manifest.map(m => m.category))
    return Array.from(cats).sort((a, b) => (CAT_ORDER[a] ?? 99) - (CAT_ORDER[b] ?? 99))
  }, [manifest])

  // Filtered spots (position + group)
  const filteredSpots = useMemo(() => {
    let spots = allSpots
    if (activePos) spots = spots.filter(s => s.pos === activePos)
    if (activeGroup) spots = spots.filter(s => s.group === activeGroup)
    return spots
  }, [allSpots, activePos, activeGroup])

  // Matching solutions (spot + depth + category)
  const matchingSolutions = useMemo(() => {
    if (!activeSpotName || solutions.size === 0) return [] as { solution: ParsedSolution; spot: Spot }[]
    const matches: { solution: ParsedSolution; spot: Spot }[] = []
    for (const sol of Array.from(solutions.values())) {
      if (activeDepth && sol.depth !== activeDepth) continue
      for (const p of sol.positions) {
        if (posName(p.hero) !== activePos) continue
        const spot = p.spots.find(s => s.name === activeSpotName)
        if (spot) { matches.push({ solution: sol, spot }); break }
      }
    }
    return matches
  }, [solutions, activeSpotName, activePos, activeDepth])

  const activeEntry = matchingSolutions.find(m => m.solution.id === activeSolutionId) ?? matchingSolutions[0] ?? null

  // Auto-select defaults
  useEffect(() => { if (availablePositions.length && !activePos) setActivePos('UTG' in availablePositions ? 'UTG' : availablePositions[0]) }, [availablePositions, activePos])
  useEffect(() => { if (availableGroups.length && !availableGroups.includes(activeGroup)) setActiveGroup(availableGroups[0]) }, [availableGroups, activeGroup])
  useEffect(() => { if (filteredSpots.length && !filteredSpots.some(s => s.spotName === activeSpotName)) setActiveSpotName(filteredSpots[0].spotName) }, [filteredSpots, activeSpotName])
  useEffect(() => { if (matchingSolutions.length && !matchingSolutions.some(m => m.solution.id === activeSolutionId)) setActiveSolutionId(matchingSolutions[0].solution.id) }, [matchingSolutions, activeSolutionId])

  const isLoading = solutions.size < manifest.length || manifest.length === 0

  if (error) return <Section title="Range Viewer"><p className="muted">Error: {error}</p></Section>

  return (
    <>
      <Section title="Range Viewer">
        <p>Pick a position and spot, then compare ranges across solutions. Filters narrow live.</p>
        {isLoading && totalCount > 0 ? (
          <Callout variant="warn"><strong>Loading... {loadingCount}/{totalCount}</strong></Callout>
        ) : (
          <Callout><strong>{solutions.size} solutions</strong> · {allSpots.length} spots</Callout>
        )}
      </Section>

      {!isLoading && (
        <div className="rv-layout">
          {/* ---- Faceted filter sidebar ---- */}
          <aside className="rv-facets">
            {/* Position */}
            <div className="rv-facet">
              <div className="rv-facet-label">Position</div>
              <div className="rv-facet-chips">
                {availablePositions.map(p => (
                  <button key={p} className={`rv-facet-chip ${p === activePos ? 'active' : ''}`}
                    onClick={() => { setActivePos(p); setLockedHand(null) }}>{p}</button>
                ))}
              </div>
            </div>

            {/* Spot Type */}
            <div className="rv-facet">
              <div className="rv-facet-label">Spot Type</div>
              <div className="rv-facet-chips">
                {availableGroups.map(g => (
                  <button key={g} className={`rv-facet-chip ${g === activeGroup ? 'active' : ''}`}
                    onClick={() => { setActiveGroup(g); setLockedHand(null) }}>{GROUP_LABELS[g] || g}</button>
                ))}
              </div>
            </div>

            {/* Depth */}
            <div className="rv-facet">
              <div className="rv-facet-label">Depth</div>
              <div className="rv-facet-chips">
                <button className={`rv-facet-chip ${activeDepth === '' ? 'active' : ''}`}
                  onClick={() => setActiveDepth('')}>All</button>
                {availableDepths.map(d => (
                  <button key={d} className={`rv-facet-chip ${d === activeDepth ? 'active' : ''}`}
                    onClick={() => setActiveDepth(d)}>{d}</button>
                ))}
              </div>
            </div>

            {/* Stage */}
            <div className="rv-facet">
              <div className="rv-facet-label">Stage</div>
              <div className="rv-facet-chips">
                {availableCategories.map(c => (
                  <button key={c} className={`rv-facet-chip ${c === '' ? 'active' : ''}`}
                    onClick={() => setActiveDepth('')} // stage filter TODO if needed
                    title={c}>{c}</button>
                ))}
              </div>
            </div>
          </aside>

          {/* ---- Main content ---- */}
          <div className="rv-main">
            {/* Spot list */}
            <div className="rv-spot-bar">
              <div className="rv-spot-bar-label">
                {activePos}{activeGroup ? ` · ${GROUP_LABELS[activeGroup] || activeGroup}` : ''} · {filteredSpots.length} spots
              </div>
              <div className="rv-spot-scroll">
                {filteredSpots.map(s => (
                  <button key={s.spotName}
                    className={`rv-spot-tab ${s.spotName === activeSpotName ? 'active' : ''}`}
                    onClick={() => { setActiveSpotName(s.spotName); setLockedHand(null) }}>
                    {s.spotName}
                  </button>
                ))}
              </div>
            </div>

            {/* Solution cards */}
            {matchingSolutions.length > 0 && (
              <div className="rv-sol-bar">
                <div className="rv-sol-bar-label">{activeSpotName} · {matchingSolutions.length} solutions</div>
                {(() => {
                  const groups: Record<string, typeof matchingSolutions> = {}
                  for (const m of matchingSolutions) {
                    const g = m.solution.category || m.solution.product
                    if (!groups[g]) groups[g] = []; groups[g].push(m)
                  }
                  return Object.entries(groups)
                    .sort(([a], [b]) => (CAT_ORDER[a] ?? 99) - (CAT_ORDER[b] ?? 99))
                    .map(([category, items]) => (
                      <div key={category} className="rv-sol-group">
                        <div className="rv-sol-group-label">{category}</div>
                        <div className="rv-cmp-sol-row">
                          {items.sort((a, b) => depthVal(a.solution.depth) - depthVal(b.solution.depth)).map(({ solution }) => (
                            <button key={solution.id}
                              className={`rv-cmp-sol-btn ${solution.id === (activeEntry?.solution.id ?? '') ? 'active' : ''}`}
                              onClick={() => { setActiveSolutionId(solution.id); setLockedHand(null) }}>
                              <span className="rv-cmp-sol-label">{solution.label.split('·')[1]?.trim() || solution.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                })()}
              </div>
            )}

            {/* Grid */}
            {activeEntry && (
              <div className="rv-grid-section">
                <h3 className="rv-grid-title">{activeEntry.spot.name} · {activePos} · {activeEntry.solution.label}</h3>
                <div className="rv-grid-wrap">
                  <table className="rv-grid">
                    <thead><tr><th></th>{RANKS.map(r => <th key={r}>{r}</th>)}</tr></thead>
                    <tbody>
                      {HAND_GRID.map((rowCells, ri) => (
                        <tr key={ri}>
                          <th className="rv-rowhead">{RANKS[ri]}</th>
                          {rowCells.map((cell, ci) => {
                            const freq = raiseFreq(activeEntry.spot, cell.hand)
                            const isLocked = lockedHand === cell.hand
                            return (
                              <td key={ci}
                                className={`rv-cell ${freq > 0 ? 'in-range' : ''} ${isLocked ? 'locked' : ''}`}
                                style={cellStyle(activeEntry.spot, cell.hand)}
                                title={cell.hand}
                                onClick={() => setLockedHand(isLocked ? null : cell.hand)}>
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
              </div>
            )}

            {/* Hand detail */}
            {lockedHand && activeEntry && (
              <div className="rv-hand-detail">
                <h3>{lockedHand}</h3>
                <p className="muted">{activeEntry.spot.name} · {activePos} · {activeEntry.solution.label}</p>
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
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default RangeViewerPage
