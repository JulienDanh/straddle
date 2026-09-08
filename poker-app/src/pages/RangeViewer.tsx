import { useState, useEffect, useMemo } from 'react'
import {
  RANKS, HAND_GRID, POS_ORDER, GROUP_ORDER, GROUP_LABELS, CAT_ORDER, depthVal,
  posName, raiseFreq, solPosStack, fmtStack, solDepthMatches,
  actionColors, actionLabel, cellStyle,
  parseSolution, buildSpotKeys,
  type ManifestEntry, type ParsedSolution, type Spot,
} from './solutionParser'

// ---- Chip component ----
function Chip({ active, disabled, onClick, children }: { active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button className={`rv-chip ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`} onClick={onClick} disabled={disabled}>{children}</button>
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
  const availableDepths = useMemo(() => { const s = new Set<string>(); for (const sol of Array.from(solutions.values())) s.add(fmtStack(activePos ? solPosStack(sol, activePos) : depthVal(sol.depth))); return Array.from(s).sort((a, b) => depthVal(a) - depthVal(b)) }, [solutions, activePos])
  const availableCategories = useMemo(() => { const s = new Set(manifest.map(m => m.category)); return Array.from(s).sort((a, b) => (CAT_ORDER[a] ?? 99) - (CAT_ORDER[b] ?? 99)) }, [manifest])

  // For a given (depth, category, stackType), check if any solutions have a spot for the active position
  const solHasSpot = (sol: ParsedSolution, pos: string, spotName: string) =>
    sol.positions.some(p => posName(p.hero) === pos && p.spots.some(s => s.name === spotName))

  // Valid options for each facet given all OTHER active filters
  const validDepths = useMemo(() => {
    const valid = new Set<string>()
    for (const sol of Array.from(solutions.values())) {
      if (activeCategory && (sol.category || sol.product) !== activeCategory) continue
      if (activeStackType === 'equal' && sol.isAsym) continue
      if (activeStackType === 'asym' && !sol.isAsym) continue
      if (activeSpotName && activePos && !solHasSpot(sol, activePos, activeSpotName)) continue
      valid.add(fmtStack(activePos ? solPosStack(sol, activePos) : depthVal(sol.depth)))
    }
    return valid
  }, [solutions, activeCategory, activeStackType, activeSpotName, activePos])

  const validCategories = useMemo(() => {
    const valid = new Set<string>()
    for (const sol of Array.from(solutions.values())) {
      if (activeDepth && !solDepthMatches(sol, activePos, activeDepth)) continue
      if (activeStackType === 'equal' && sol.isAsym) continue
      if (activeStackType === 'asym' && !sol.isAsym) continue
      if (activeSpotName && activePos && !solHasSpot(sol, activePos, activeSpotName)) continue
      valid.add(sol.category || sol.product)
    }
    return valid
  }, [solutions, activeDepth, activeStackType, activeSpotName, activePos])

  const validStackTypes = useMemo(() => {
    const hasEqual = manifest.some(m => {
      const sol = solutions.get(m.id)
      if (activeDepth && (!sol || !solDepthMatches(sol, activePos, activeDepth))) return false
      if (activeCategory && m.category !== activeCategory) return false
      if (activeSpotName && activePos && (!sol || !solHasSpot(sol, activePos, activeSpotName))) return false
      return !('stacks' in m && m.stacks)
    })
    const hasAsym = manifest.some(m => {
      const sol = solutions.get(m.id)
      if (activeDepth && (!sol || !solDepthMatches(sol, activePos, activeDepth))) return false
      if (activeCategory && m.category !== activeCategory) return false
      if (activeSpotName && activePos && (!sol || !solHasSpot(sol, activePos, activeSpotName))) return false
      return 'stacks' in m && !!m.stacks
    })
    return { equal: hasEqual, asym: hasAsym }
  }, [manifest, solutions, activeDepth, activeCategory, activeSpotName, activePos])

  const validPositions = useMemo(() => {
    const valid = new Set<string>()
    for (const s of allSpots) {
      if (activeDepth || activeCategory || activeStackType) {
        const hasMatching = Array.from(solutions.values()).some(sol => {
          if (activeDepth && !solDepthMatches(sol, s.pos, activeDepth)) return false
          if (activeCategory && (sol.category || sol.product) !== activeCategory) return false
          if (activeStackType === 'equal' && sol.isAsym) return false
          if (activeStackType === 'asym' && !sol.isAsym) return false
          return sol.positions.some(p => posName(p.hero) === s.pos)
        })
        if (!hasMatching) continue
      }
      valid.add(s.pos)
    }
    return valid
  }, [allSpots, solutions, activeDepth, activeCategory, activeStackType])

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
      if (activeDepth && !solDepthMatches(sol, activePos, activeDepth)) continue
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
  // Reset depth when it's no longer valid for the active position (e.g. switching positions changes the available per-position stacks)
  useEffect(() => { if (activeDepth && !availableDepths.includes(activeDepth)) setActiveDepth('') }, [availableDepths, activeDepth])

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
                  <Chip key={p} active={p === activePos} disabled={!validPositions.has(p)} onClick={() => { setActivePos(p); setLockedHand(null) }}>{p}</Chip>
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
              <span className="rv-filter-label">{activePos ? `${activePos} Stack` : 'Depth'}</span>
              <div className="rv-chip-row">
                <Chip active={activeDepth === ''} onClick={() => setActiveDepth('')}>All</Chip>
                {availableDepths.map(d => <Chip key={d} active={d === activeDepth} disabled={!validDepths.has(d)} onClick={() => setActiveDepth(d)}>{d}</Chip>)}
              </div>
            </div>
            {/* Stage */}
            <div className="rv-filter-group">
              <span className="rv-filter-label">Stage</span>
              <div className="rv-chip-row">
                <Chip active={activeCategory === ''} onClick={() => { setActiveCategory(''); setLockedHand(null) }}>All</Chip>
                {availableCategories.map(c => <Chip key={c} active={c === activeCategory} disabled={!validCategories.has(c)} onClick={() => { setActiveCategory(c); setLockedHand(null) }}>{c}</Chip>)}
              </div>
            </div>
            {/* Stacks */}
            <div className="rv-filter-group">
              <span className="rv-filter-label">Stacks</span>
              <div className="rv-chip-row">
                <Chip active={activeStackType === ''} onClick={() => { setActiveStackType(''); setLockedHand(null) }}>All</Chip>
                <Chip active={activeStackType === 'equal'} disabled={!validStackTypes.equal} onClick={() => { setActiveStackType('equal'); setLockedHand(null) }}>Equal</Chip>
                <Chip active={activeStackType === 'asym'} disabled={!validStackTypes.asym} onClick={() => { setActiveStackType('asym'); setLockedHand(null) }}>Asymmetrical</Chip>
              </div>
            </div>
          </div>

          {/* ===== Spot tabs ===== */}
          <div className="rv-spot-tabs">
            {filteredSpots.map(s => (
              <button key={s.spotName}
                className={`rv-spot-tab ${s.spotName === activeSpotName ? 'active' : ''}`}
                onClick={() => { setActiveSpotName(s.spotName); setLockedHand(null) }}>
                {s.displayName}
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
          {activeEntry && (() => {
            const isAllIn = activeEntry.spot.group === 'all-in'
            const colors = actionColors(activeEntry.spot.actions, isAllIn)
            const cd = lockedHand ? activeEntry.spot.hands[lockedHand] : null
            const bestEv = cd ? Math.max(...cd.ev.map((e, i) => (cd.freq[i] > 0 ? e : -Infinity))) : -Infinity
            return (
            <div className="rv-content">
              <div className="rv-grid-area">
                <div className="rv-grid-header">
                  <span className="rv-grid-spot">{activePos} {activeEntry.spot.name}</span>
                  <span className="rv-grid-sol">{activeEntry.solution.label}</span>
                  {activeEntry.solution.isAsym && <span className="rv-grid-herostack">{activePos} {solPosStack(activeEntry.solution, activePos)}bb</span>}
                  {activeEntry.solution.stacks && <span className="rv-grid-stacks">{activeEntry.solution.stacks}</span>}
                </div>
                {/* Spot-level action mix (headline from solver) */}
                <div className="rv-spot-summary">
                  {activeEntry.spot.actions.map((a, i) => (
                    <span key={i} className="rv-summary-item">
                      <span className="rv-summary-dot" style={{ background: colors[i] }} />
                      <span className="rv-summary-name">{actionLabel(a, isAllIn)}</span>
                      <span className="rv-summary-pct">{a.spotPct.toFixed(1)}%</span>
                    </span>
                  ))}
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
                            const w = activeEntry.spot.hands[cell.hand]?.weight ?? 100
                            return (
                              <td key={ci}
                                className={`rv-cell ${freq > 0 ? 'in-range' : ''} ${isLocked ? 'locked' : ''}`}
                                style={cellStyle(activeEntry.spot, cell.hand, colors)}
                                title={`${cell.hand}${w < 100 ? ` · weight ${w}%` : ''}`}
                                onClick={() => setLockedHand(isLocked ? null : cell.hand)}>
                                <span className="rv-cell-hand">{cell.hand}</span>
                                {freq > 0 && <span className="rv-cell-freq">{freq.toFixed(0)}</span>}
                                {w < 100 && w > 0 && freq > 0 && <span className="rv-cell-w">·</span>}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="rv-legend">
                  {activeEntry.spot.actions.map((a, i) => (
                    <span key={i} className="rv-legend-item">
                      <span className="rv-legend-dot" style={{ background: colors[i] }} />
                      {actionLabel(a, isAllIn)}
                    </span>
                  ))}
                </div>
              </div>

              {lockedHand && cd && (
                <div className="rv-hand-panel">
                  <div className="rv-hand-panel-title">{lockedHand}</div>
                  <div className="rv-hand-panel-context">{activeEntry.spot.name} · {activeEntry.solution.label}</div>
                  <div className="rv-hand-meta">
                    {cd.combos.length > 0 && <span>{cd.combos.length} combo{cd.combos.length > 1 ? 's' : ''}</span>}
                    {cd.weight < 100 && <span className="rv-weight-warn">weight {cd.weight.toFixed(0)}%</span>}
                    {cd.weight === 0 && <span className="rv-weight-warn">blocked</span>}
                  </div>
                  <div className="rv-actions">
                    {activeEntry.spot.actions.map((a, i) => {
                      const f = cd.freq[i] || 0
                      const e = cd.ev[i] ?? 0
                      const isBest = f > 0 && e === bestEv && bestEv !== -Infinity
                      return (
                        <div key={i} className={`rv-action-row${isBest ? ' best' : ''}`}>
                          <span className="rv-action-label" style={{ color: colors[i] }}>{actionLabel(a, isAllIn)}</span>
                          <div className="rv-action-bar">
                            <div className="rv-action-fill" style={{ width: `${f}%`, background: colors[i] }} />
                          </div>
                          <span className="rv-action-pct">{f.toFixed(1)}%</span>
                          <span className="rv-action-ev" title="EV in bb">{e.toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="rv-hand-ev-note">EV in bb · <span className="rv-best-mark">■</span> highest-EV action</div>
                </div>
              )}
            </div>
            )
          })()}
        </>
      )}
    </div>
  )
}

export default RangeViewerPage
