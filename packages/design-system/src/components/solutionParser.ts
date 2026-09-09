// Solution parsing, types, and display helpers for the Range Viewer.
// All data extraction from the raw Pio-style JSON lives here; the React
// component in RangeViewer.tsx only renders the parsed structures.

// ---- Types ----
export interface RawCell { name: string; group: string; nodeId: number }
export interface RawRangeEntry { freq: number[]; ev: number[]; hands: string[]; weight: number }
export interface RawNode { ranges: Record<string, RawRangeEntry>[]; percentages: { action: string; amount: number | string; percentage: string }[] }
export interface RawSolution { columns: string[]; table: Record<string, (RawCell | RawCell[])[]>; nodes: Record<string, RawNode> }
export interface ManifestEntry { id: string; label: string; product: string; category: string; depth: string; file: string; stacks?: string }
export interface ActionInfo { name: string; amount: number; spotPct: number }
export interface ComboData { freq: number[]; ev: number[]; weight: number; combos: string[] }
export interface Spot { name: string; group: string; actions: ActionInfo[]; hands: Record<string, ComboData> }
export interface Position { hero: string; spots: Spot[] }
export interface ParsedSolution { id: string; label: string; product: string; category: string; depth: string; columns: string[]; positions: Position[]; stacks?: string; isAsym: boolean; posStacks: Record<string, number> }
export interface SpotKey { pos: string; spotName: string; displayName: string; group: string }

// ---- Constants ----
export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const
export const HAND_GRID: { hand: string }[][] = RANKS.map((row, ri) =>
  RANKS.map((col, ci) => {
    if (row === col) return { hand: `${row}${col}` }
    const idx1 = RANKS.indexOf(row), idx2 = RANKS.indexOf(col)
    const [hi, lo] = idx1 < idx2 ? [row, col] : [col, row]
    return { hand: ci > ri ? `${hi}${lo}s` : `${hi}${lo}o` }
  })
)
export const POS_ORDER = ['BB', 'SB', 'BTN', 'CO', 'HJ', 'LJ', 'MP', 'UTG']
export const GROUP_ORDER = ['rfi', 'lfi', 'general', '3bet', 'all-in', 'iso']
export const GROUP_LABELS: Record<string, string> = { 'rfi': 'RFI', 'lfi': 'LFI', 'general': 'vs Open', '3bet': 'vs 3-Bet', 'all-in': 'vs All-in', 'iso': 'vs ISO' }
export const CAT_ORDER: Record<string, number> = { 'ChipEV': 0, 'ICM 83% left': 1, 'ICM 40% left': 2, 'ICM ITM Bubble': 3, 'ICM Bubble': 4 }
export const depthVal = (d: string) => parseInt(d) || 0

// ---- Helpers ----
export function posName(hero: string): string { const n = hero.split('|')[0]; return n === 'BU' ? 'BTN' : n }
export function normalizeSpotName(name: string): string { return name.replace(/\s+\d+(\.\d+)?%$/, '').trim().replace(/\bBU\b/g, 'BTN') }
export function spotHero(spotName: string, rowHero: string): string {
  const name = normalizeSpotName(spotName)
  if (name.endsWith(' RFI') || name.endsWith(' LFI')) { const o = name.split(' ')[0]; if (o && o !== 'vs') return o === 'BU' ? 'BTN' : o }
  if (name.includes(' vs ')) { const d = name.split(' vs ')[0].trim(); if (d) return d === 'BU' ? 'BTN' : d }
  return rowHero
}
export function raiseFreq(spot: Spot, hand: string): number { const f = spot.hands[hand]?.freq; if (!f) return 0; return f.slice(1).reduce((s, v) => s + v, 0) }

// Effective stack (bb) for a position in a solution. Asym solutions carry
// per-position stacks in the column headers (e.g. "BU|15"); equal solutions
// fall back to the solution's average depth.
export function solPosStack(sol: ParsedSolution, pos: string): number {
  return sol.posStacks[pos] ?? depthVal(sol.depth)
}
export function fmtStack(n: number): string { return `${n}bb` }
// Does a solution's effective stack for `pos` match the selected depth chip?
export function solDepthMatches(sol: ParsedSolution, pos: string, depthStr: string): boolean {
  if (!depthStr) return true
  return solPosStack(sol, pos) === depthVal(depthStr)
}

// ---- Action colors and labels ----
// Per-action color. Raises with distinct bet sizings get distinct shades
// (light = smallest sizing, dark = largest) so multiple raises never merge
// into one color. All-in spots recolor Call to purple (calling an all-in).
const FOLD_COLOR = '#3a4453'
const CALL_COLOR = '#6aa6ff'
const CALL_ALLIN_COLOR = '#a855f7'
const CHECK_COLOR = '#5fd0a8'
const RAISE_SHADES = ['#f5a3a3', '#f5916f', '#ef6f6f', '#e0494b', '#c83838', '#a52424', '#7a1818']

export function actionColors(actions: ActionInfo[], isAllIn: boolean): string[] {
  const colors: string[] = actions.map(a => {
    if (a.name === 'Fold') return FOLD_COLOR
    if (a.name === 'Check') return CHECK_COLOR
    if (a.name === 'Call') return isAllIn ? CALL_ALLIN_COLOR : CALL_COLOR
    return '' // Raise: assigned below
  })
  const raiseIdxs = actions.map((a, i) => a.name === 'Raise' ? i : -1).filter(i => i >= 0)
  if (raiseIdxs.length) {
    const sorted = raiseIdxs.slice().sort((a, b) => actions[a].amount - actions[b].amount)
    sorted.forEach((idx, rank) => {
      if (raiseIdxs.length === 1) colors[idx] = '#ef6f6f'
      else colors[idx] = RAISE_SHADES[Math.round((rank / (raiseIdxs.length - 1)) * (RAISE_SHADES.length - 1))]
    })
  }
  return colors
}

// Human label for an action, annotating bet sizings via the `amount` field.
export function actionLabel(a: ActionInfo, isAllIn: boolean): string {
  if (a.name === 'Fold') return 'Fold'
  if (a.name === 'Check') return 'Check'
  if (a.name === 'Call') return isAllIn && a.amount > 0 ? `Call ${a.amount}bb` : 'Call'
  if (a.name === 'Raise') return a.amount > 0 ? `Raise ${a.amount}bb` : 'Raise'
  return a.name
}

// ---- Cell styling ----
// Build multi-color cell background (vertical segments like Pio/GTO Wizard)
export function cellBg(freqs: number[], colors: string[]): string {
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

// Determine text color based on dominant action
export function textColor(freqs: number[]): string {
  const total = freqs.reduce((s, v) => s + v, 0)
  if (total <= 0) return '#8499b5'
  const foldPct = (freqs[0] || 0) / total
  return foldPct > 0.5 ? '#8499b5' : '#0c1117'
}

export function cellStyle(spot: Spot, hand: string, colors: string[]): React.CSSProperties {
  const cd = spot.hands[hand]
  const freqs = cd?.freq || []
  const freq = freqs.slice(1).reduce((s, v) => s + v, 0)
  if (freq <= 0) return {}
  return { background: cellBg(freqs, colors), color: textColor(freqs), fontWeight: freq > 50 ? 700 : 400 }
}

// ---- Parsing ----
export function parseSolution(raw: RawSolution, m: ManifestEntry): ParsedSolution {
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
        const hands: Record<string, ComboData> = {}
        for (let ri = 0; ri < (node.ranges || []).length; ri++) {
          const keys = Object.keys(node.ranges[ri] || {})
          for (let ci = 0; ci < keys.length; ci++) {
            const entry = node.ranges[ri][keys[ci]]
            if (!entry) continue
            hands[HAND_GRID[ri][ci].hand] = {
              freq: (entry.freq || []).map(Number),
              ev: (entry.ev || []).map(Number),
              weight: Number(entry.weight ?? 100),
              combos: entry.hands || [],
            }
          }
        }
        const spotName = normalizeSpotName(cell.name)
        const hero = spotHero(cell.name, rowHero)
        const actions: ActionInfo[] = (node.percentages || []).map((p) => ({
          name: p.action,
          amount: Number(p.amount) || 0,
          spotPct: Number(p.percentage) || 0,
        }))
        if (!posMap.has(hero)) posMap.set(hero, { hero, spots: [] })
        posMap.get(hero)!.spots.push({ name: spotName, group: cell.group, actions, hands })
      }
    }
  }
  return {
    id: m.id, label: m.label, product: m.product, category: m.category, depth: m.depth,
    columns: raw.columns,
    positions: Array.from(posMap.values()).sort((a, b) => POS_ORDER.indexOf(a.hero) - POS_ORDER.indexOf(b.hero)),
    stacks: m.stacks, isAsym: !!m.stacks,
    posStacks: Object.fromEntries(raw.columns.map(c => {
      const n = c.split('|')[1]
      return [posName(c), Math.round(Number(n) || depthVal(m.depth))]
    })),
  }
}

export function buildSpotKeys(solutions: ParsedSolution[]): SpotKey[] {
  const seen = new Set<string>(); const spots: SpotKey[] = []
  for (const sol of solutions) for (const pos of sol.positions) for (const spot of pos.spots) {
    const pn = posName(pos.hero); const key = `${pn}||${spot.name}`
    if (!seen.has(key)) {
      seen.add(key)
      // Prefix defense spots with hero position for clarity
      const display = spot.name.startsWith('vs ') ? `${pn} ${spot.name}` : spot.name
      spots.push({ pos: pn, spotName: spot.name, displayName: display, group: spot.group })
    }
  }
  spots.sort((a, b) => {
    const pa = POS_ORDER.indexOf(a.pos), pb = POS_ORDER.indexOf(b.pos); if (pa !== pb) return pa - pb
    const ga = GROUP_ORDER.indexOf(a.group), gb = GROUP_ORDER.indexOf(b.group); if (ga !== gb) return ga - gb
    return a.spotName.localeCompare(b.spotName)
  })
  return spots
}
