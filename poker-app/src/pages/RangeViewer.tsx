import { useState, useEffect, useMemo } from 'react'

// ---- Types ----
interface RawCell { name: string; group: string; nodeId: number }
interface RawNode { ranges: Record<string, { freq: number[] }>[]; percentages: { action: string }[] }
interface RawSolution { columns: string[]; table: Record<string, (RawCell | RawCell[])[]>; nodes: Record<string, RawNode> }
interface ManifestEntry { id: string; label: string; product: string; category: string; depth: string; file: string; stacks?: string }
interface Spot { name: string; group: string; actions: string[]; hands: Record<string, number[]> }
interface Position { hero: string; spots: Spot[] }
interface ParsedSolution { id: string; label: string; product: string; category: string; depth: string; columns: string[]; positions: Position[]; stacks?: string; isAsym: boolean }
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
const GROUP_LABELS: Record<string, string> = { 'rfi': 'RFI', 'lfi': 'LFI', 'general': 'vs Open', '3bet': 'vs 3-Bet', 'all-in': 'vs All-in', 'iso': 'vs ISO' }
const CAT_ORDER: Record<string, number> = { 'ChipEV': 0, 'ICM 83% left': 1, 'ICM 40% left': 2, 'ICM ITM Bubble': 3, 'ICM Bubble': 4 }
const depthVal = (d: string) => parseInt(d) || 0

// ---- Helpers ----
function posName(hero: string): string { const n = hero.split('|')[0]; return n === 'BU' ? 'BTN' : n }
function normalizeSpotName(name: string): string { return name.replace(/\s+\d+(\.\d+)?%$/, '').trim() }
function spotHero(spotName: string, rowHero: string): string {
  const name = normalizeSpotName(spotName)
  if (name.endsWith(' RFI') || name.endsWith(' LFI')) { const o = name.split(' ')[0]; if (o && o !== 'vs') return o === 'BU' ? 'BTN' : o }
  if (name.includes(' vs ')) { const d = name.split(' vs ')[0].trim(); if (d) return d === 'BU' ? 'BTN' : d }
  return rowHero
}
function raiseFreq(spot: Spot, hand: string): number { const f = spot.hands[hand]; if (!f) return 0; return f.slice(1).reduce((s, v) => s + v, 0) }
function cellStyle(spot: Spot, hand: string): React.CSSProperties {
  const freq = raiseFreq(spot, hand); if (freq <= 0) return {}
  const opacity = 0.15 + (freq / 100) * 0.85
  return { background: `rgba(95, 208, 168, ${opacity.toFixed(3)})`, color: freq > 50 ? '#0c1117' : '#d8e2ee', fontWeight: freq > 50 ? 700 : 400 }
}

function parseSolution(raw: RawSolution, m: ManifestEntry): ParsedSolution {
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
  return { id: m.id, label: m.label, product: m.product, category: m.category, depth: m.depth, columns: raw.columns, positions: Array.from(posMap.values()).sort((a, b) => POS_ORDER.indexOf(a.hero) - POS_ORDER.indexOf(b.hero)), stacks: m.stacks, isAsym: !!m.stacks }
}

function buildSpotKeys(solutions: ParsedSolution[]): SpotKey[] {
  const seen = new Set<string>(); const spots: SpotKey[] = []
  for (const sol of solutions) for (const pos of sol.positions) for (const spot of pos.spots) {
    const pn = posName(pos.hero); const key = `${pn}||${spot.name}`
    if (!seen.has(key)) { seen.add(key); spots.push({ pos: pn, spotName: spot.name, group: spot.group }) }
  }
  spots.sort((a, b) => { const pa = POS_ORDER.indexOf(a.pos), pb = POS_ORDER.indexOf(b.pos); if (pa !== pb) return pa - pb; const ga = GROUP_ORDER.indexOf(a.group), gb = GROUP_ORDER.indexOf(b.group); if (ga !== gb) return ga - gb; return a.spotName.localeCompare(b.spotName) })
  return spots
}

// ---- Chip component ----
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button className={`rv-chip ${active ? 'active' : ''}`} onClick={onClick}>{children}</button>
}

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
  const [activeCategory, setActiveCategory] = useState('')
  const [activeStackType, setActiveStackType] = useState('')  // '' = all, 'equal', 'asym'
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
  const availablePositions = useMemo(() => { const s = new Set(allSpots.map(x => x.pos)); return POS_ORDER.filter(p => s.has(p)) }, [allSpots])
  const availableGroups = useMemo(() => { const spots = activePos ? allSpots.filter(s => s.pos === activePos) : allSpots; const s = new Set(spots.map(x => x.group)); return GROUP_ORDER.filter(g => s.has(g)) }, [allSpots, activePos])
  const availableDepths = useMemo(() => { const s = new Set(manifest.map(m => m.depth)); return Array.from(s).sort((a, b) => depthVal(a) - depthVal(b)) }, [manifest])
  const availableCategories = useMemo(() => { const s = new Set(manifest.map(m => m.category)); return Array.from(s).sort((a, b) => (CAT_ORDER[a] ?? 99) - (CAT_ORDER[b] ?? 99)) }, [manifest])

  const filteredSpots = useMemo(() => {
    let spots = allSpots
    if (activePos) spots = spots.filter(s => s.pos === activePos)
    if (activeGroup) spots = spots.filter(s => s.group === activeGroup)
    return spots
  }, [allSpots, activePos, activeGroup])

  const matchingSolutions = useMemo(() => {
    if (!activeSpotName || solutions.size === 0) return [] as { solution: ParsedSolution; spot: Spot }[]
    const matches: { solution: ParsedSolution; spot: Spot }[] = []
    for (const sol of Array.from(solutions.values())) {
      if (activeDepth && sol.depth !== activeDepth) continue
      if (activeCategory && (sol.category || sol.product) !== activeCategory) continue
      if (activeStackType === 'equal' && sol.isAsym) continue
      if (activeStackType === 'asym' && !sol.isAsym) continue
      for (const p of sol.positions) {
        if (posName(p.hero) !== activePos) continue
        const spot = p.spots.find(s => s.name === activeSpotName)
        if (spot) { matches.push({ solution: sol, spot }); break }
      }
    }
    return matches
  }, [solutions, activeSpotName, activePos, activeDepth, activeCategory, activeStackType])

  const activeEntry = matchingSolutions.find(m => m.solution.id === activeSolutionId) ?? matchingSolutions[0] ?? null
  const isLoading = solutions.size < manifest.length || manifest.length === 0

  // Auto-select defaults
  useEffect(() => { if (availablePositions.length && !activePos) setActivePos('UTG' in availablePositions ? 'UTG' : availablePositions[0]) }, [availablePositions, activePos])
  useEffect(() => { if (availableGroups.length && !availableGroups.includes(activeGroup)) setActiveGroup(availableGroups[0]) }, [availableGroups, activeGroup])
  useEffect(() => { if (filteredSpots.length && !filteredSpots.some(s => s.spotName === activeSpotName)) setActiveSpotName(filteredSpots[0].spotName) }, [filteredSpots, activeSpotName])
  useEffect(() => { if (matchingSolutions.length && !matchingSolutions.some(m => m.solution.id === activeSolutionId)) setActiveSolutionId(matchingSolutions[0].solution.id) }, [matchingSolutions, activeSolutionId])

  // Keyboard: left/right to flip solutions
  useEffect(() => {
    if (matchingSolutions.length === 0) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const idx = matchingSolutions.findIndex(m => m.solution.id === activeSolutionId)
        if (idx < 0) return
        const next = e.key === 'ArrowRight' ? Math.min(idx + 1, matchingSolutions.length - 1) : Math.max(idx - 1, 0)
        setActiveSolutionId(matchingSolutions[next].solution.id)
        setLockedHand(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [matchingSolutions, activeSolutionId])

  if (error) return <div className="rv-page"><p className="muted">Error: {error}</p></div>

  return (
    <div className="rv-page">
      {/* Loading / status */}
      {isLoading ? (
        <div className="rv-loading">{totalCount > 0 ? `Loading ${loadingCount}/${totalCount}...` : 'Loading...'}</div>
      ) : (
        <>
          {/* ===== Top filter bar ===== */}
          <div className="rv-topbar">
            {/* Position */}
            <div className="rv-filter-group">
              <span className="rv-filter-label">Position</span>
              <div className="rv-chip-row">
                {availablePositions.map(p => (
                  <Chip key={p} active={p === activePos} onClick={() => { setActivePos(p); setLockedHand(null) }}>{p}</Chip>
                ))}
              </div>
            </div>
            {/* Spot type */}
            <div className="rv-filter-group">
              <span className="rv-filter-label">Type</span>
              <div className="rv-chip-row">
                {availableGroups.map(g => (
                  <Chip key={g} active={g === activeGroup} onClick={() => { setActiveGroup(g); setLockedHand(null) }}>{GROUP_LABELS[g] || g}</Chip>
                ))}
              </div>
            </div>
            {/* Depth */}
            <div className="rv-filter-group">
              <span className="rv-filter-label">Depth</span>
              <div className="rv-chip-row">
                <Chip active={activeDepth === ''} onClick={() => setActiveDepth('')}>All</Chip>
                {availableDepths.map(d => <Chip key={d} active={d === activeDepth} onClick={() => setActiveDepth(d)}>{d}</Chip>)}
              </div>
            </div>
            {/* Stage */}
            <div className="rv-filter-group">
              <span className="rv-filter-label">Stage</span>
              <div className="rv-chip-row">
                <Chip active={activeCategory === ''} onClick={() => { setActiveCategory(''); setLockedHand(null) }}>All</Chip>
                {availableCategories.map(c => <Chip key={c} active={c === activeCategory} onClick={() => { setActiveCategory(c); setLockedHand(null) }}>{c}</Chip>)}
              </div>
            </div>
            {/* Stacks */}
            <div className="rv-filter-group">
              <span className="rv-filter-label">Stacks</span>
              <div className="rv-chip-row">
                <Chip active={activeStackType === ''} onClick={() => { setActiveStackType(''); setLockedHand(null) }}>All</Chip>
                <Chip active={activeStackType === 'equal'} onClick={() => { setActiveStackType('equal'); setLockedHand(null) }}>Equal</Chip>
                <Chip active={activeStackType === 'asym'} onClick={() => { setActiveStackType('asym'); setLockedHand(null) }}>Asymmetrical</Chip>
              </div>
            </div>
          </div>

          {/* ===== Spot tabs ===== */}
          <div className="rv-spot-tabs">
            {filteredSpots.map(s => (
              <button key={s.spotName}
                className={`rv-spot-tab ${s.spotName === activeSpotName ? 'active' : ''}`}
                onClick={() => { setActiveSpotName(s.spotName); setLockedHand(null) }}>
                {s.spotName}
              </button>
            ))}
          </div>

          {/* ===== Solution comparison bar (sticky) ===== */}
          {matchingSolutions.length > 0 && (
            <div className="rv-sol-bar-sticky">
              {(() => {
                const groups: Record<string, typeof matchingSolutions> = {}
                for (const m of matchingSolutions) { const g = m.solution.category || m.solution.product; if (!groups[g]) groups[g] = []; groups[g].push(m) }
                return Object.entries(groups).sort(([a], [b]) => (CAT_ORDER[a] ?? 99) - (CAT_ORDER[b] ?? 99)).map(([category, items]) => (
                  <div key={category} className="rv-sol-grp">
                    <span className="rv-sol-grp-label">{category}</span>
                    <div className="rv-sol-grp-cards">
                      {items.sort((a, b) => depthVal(a.solution.depth) - depthVal(b.solution.depth)).map(({ solution }) => (
                        <button key={solution.id}
                          className={`rv-sol-card ${solution.id === (activeEntry?.solution.id ?? '') ? 'active' : ''}`}
                          onClick={() => { setActiveSolutionId(solution.id); setLockedHand(null) }}
                          title={solution.stacks || ''}>
                          {solution.label.split('·')[1]?.trim() || solution.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </div>
          )}

          {/* ===== Grid + hand detail ===== */}
          {activeEntry && (
            <div className="rv-content">
              <div className="rv-grid-area">
                <div className="rv-grid-header">
                  <span className="rv-grid-spot">{activeEntry.spot.name}</span>
                  <span className="rv-grid-sol">{activeEntry.solution.label}</span>
                  {activeEntry.solution.stacks && <span className="rv-grid-stacks">{activeEntry.solution.stacks}</span>}
                </div>
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

              {lockedHand && (
                <div className="rv-hand-panel">
                  <div className="rv-hand-panel-title">{lockedHand}</div>
                  <div className="rv-hand-panel-context">{activeEntry.spot.name} · {activeEntry.solution.label}</div>
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
          )}
        </>
      )}
    </div>
  )
}

export default RangeViewerPage
