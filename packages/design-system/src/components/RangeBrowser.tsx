import { Fragment, useMemo, useState } from 'react'
import { RangeGrid, strategyShare } from './RangeGrid'
import { Board } from './ui-parts/cards'
import { lineContext, materializeChild } from '../data/ranges'
import type { StoredRange } from '../data/ranges'

// RangeBrowser — renders StoredRange data as a chart panel, for one stack
// or many.
//
// Takes a group of StoredRange instances (same spot, different stacks) and
// renders a bordered panel: a header strip with the spot name on the left
// and a stack selector on the right, with the range grid inside. With a
// single range the selector is hidden — same panel, nothing to switch.
// Entries carrying `postflop` children (e.g. the 40bb UTG RFI's c-bet
// boards) get a board selector under the header: the preflop open plus one
// pill per solved flop, swapping the grid to that child's strategy.
// Pass the grouped constants from data/ranges.ts.
//
// Usage:
//   <RangeBrowser ranges={UTG_RFI_CEV} />
//   <RangeBrowser ranges={[SOME_SINGLE_RANGE]} />

export interface RangeBrowserProps {
  ranges: StoredRange[]
  /** Stack (bb) selected initially; defaults to the deepest stack */
  defaultStack?: number
  /** Solution type selected initially (e.g. 'ICM-covered-deep') — for
   *  panels passed the FULL line on a page that teaches one scenario;
   *  the scenario groups let the learner switch to the others */
  defaultType?: StoredRange['type']
  /** Hash prefix to persist the selection under (e.g. "#ranges/btn") — the
   *  stack, solution type and board are appended as segments and restored
   *  on mount, so a spot reloads exactly where you left it. */
  hashPrefix?: string
  /** Show the board selector for postflop children (default true). Pass
   *  false for preflop-only panels — each page chooses whether to keep every
   *  line a clean stacks view. */
  postflop?: boolean
  /** Fill the available height: the grid stretches to the panel instead of
   *  fixed-height cells (for full-viewport pages like Live; no page scroll). */
  fill?: boolean
}

const SEATS = ['UTG', 'UTG+1', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']

const typeSlug = (t: string) => t.toLowerCase().replace(/\s+/g, '-')

/** Short texture tag for a board ("mono", "tt", "rb", "+pr" when paired). */
function boardTexture(cards: string): string {
  const pairs = cards.match(/.{2}/g) ?? []
  const suits = new Set(pairs.map(c => c[1]))
  const ranks = pairs.map(c => c[0])
  let t = suits.size === 1 ? 'mono' : suits.size === 2 ? 'tt' : 'rb'
  if (new Set(ranks).size < ranks.length) t += '·pr'
  return t
}

/** Nearest candidate stack (deepest wins ties). */
function nearestStack(candidates: number[], from: number): number {
  return candidates.reduce((best, s) =>
    Math.abs(s - from) < Math.abs(best - from) || (
      Math.abs(s - from) === Math.abs(best - from) && s > best) ? s : best,
  candidates[0])
}

/** Short display name for a solution type — the covered/covering direction
 *  is spelled out ("ICM-covered-deep" → "they cover you (deep)") so the
 *  passive/active pair can't be confused. */
function shortTarget(t: string): string {
  const ft = t.startsWith('ICM-FT-')
  const core = t.replace(/^ICM-(FT-)?/, '')
  const label =
    core === 'covered-deep' ? 'they cover you (deep)'
    : core === 'covered-similar' ? 'they cover you (similar)'
    : core === 'covering' ? 'you cover them'
    : core.replace(/-/g, ' ')
  return ft ? `final table · ${label}` : label
}

/** The course-level scenario a solution type belongs to. The type selector
 *  is grouped by it, so the pill row reads as the course's mental model
 *  (equal stacks / you cover them / they cover you) instead of a flat list
 *  of internal type keys. Returns [order, label]. */
function typeGroupLabel(t: string): [number, string] {
  const core = t.replace(/^ICM-(FT-)?/, '')
  // ICM-FT (plain final table) is an equal-stacks scenario — core 'FT';
  // plain ICM (bubble, equal stacks) and the BBZ scrape's bubble /
  // %-of-field ICM stages are equal stacks too
  if (t === 'cEV' || core === '' || core === 'FT' || t === 'ICM'
      || t.startsWith('ICM-BBZ'))
    return [0, 'Equal stacks']
  if (core === 'covering') return [1, 'You cover them']
  if (core === 'covered-deep') return [2, 'They cover you (deep)']
  if (core === 'covered-similar') return [3, 'They cover you (similar)']
  return [9, 'Other']
}

/** Short pill label within its scenario group — the group label carries
 *  the direction, the pill carries the model (ChipEV / ICM / final table). */
function groupPill(t: string): string {
  // every ICM variant carries a self-describing pill — a bare "ICM" is
  // indistinguishable across the equal-stacks / covered / covering groups
  if (t === 'cEV') return 'ChipEV'
  if (t.startsWith('ICM-BBZ-'))
    return t.slice('ICM-BBZ-'.length).replace('pct', '%')
  if (t === 'ICM-FT') return 'final table'
  if (t === 'ICM') return 'bubble'
  if (t === 'ICM-covering') return 'covering'
  if (t === 'ICM-covered-deep') return 'covered deep'
  if (t === 'ICM-covered-similar') return 'covered similar'
  return shortTarget(t)
}

/** The covered/covering definition per scenario group — the tooltip on
 *  the group label. Mirrors the SolutionType union spec. */
const GROUP_HELP: Record<string, string> = {
  'Equal stacks': 'Every stack at the table is the same size.',
  'You cover them': 'No stack still in the hand — the villain and anyone behind you — is bigger than yours.',
  'They cover you (deep)': 'The biggest stack in the hand over yours is at least 1.75x yours (3x+ is "by heaps").',
  'They cover you (similar)': 'The biggest stack in the hand over yours is under 1.75x yours — close enough to fight.',
}

/** Model order within a scenario group: ChipEV, then the ICM stages in
 * tournament progression (more of the field left first: 83% -> 40% ->
 * bubble), then the final table. */
const modelOrder = (t: string) =>
  t === 'cEV' ? 0
  : t === 'ICM-FT' ? 40
  : t === 'ICM-BBZ-83pct' ? 10
  : t === 'ICM-BBZ-40pct' ? 20
  : t === 'ICM-BBZ-bubble' || t === 'ICM' ? 30
  : 1

const pillClass = (active: boolean) =>
  `px-2.5 py-1 rounded-[5px] text-[11px] font-semibold transition-colors ${
    active ? 'bg-accent text-dark' : 'text-txt/80 hover:text-txt hover:bg-panel/60'
  }`

export function RangeBrowser({ ranges, defaultStack, defaultType, hashPrefix, postflop = true, fill = false }: RangeBrowserProps) {
  // a group can mix solution types (cEV + ICM at the same stack) — the
  // type selector switches between them, and the stack selector shows
  // only the stacks of the active type. The selected type is derived
  // (not just read from state) so the component survives prop swaps that
  // reuse the instance — e.g. a panel switching tabs from a mixed group
  // to an all-ICM group: stale 'cEV' state falls back to the group's own
  // types instead of rendering nothing.
  const types = [...new Set(ranges.map(r => r.type))]
  // deep-link restore: #<prefix>/<stack>/<type>/<board> — board "open" is
  // the preflop range. Parsed once on mount; handlers re-write on change.
  const init = useMemo(() => {
    if (!hashPrefix) return null
    const h = window.location.hash
    if (!h.startsWith(hashPrefix + '/')) return null
    const [stackS, typeS, boardS] = h.slice(hashPrefix.length + 1).split('/')
    return { stack: parseFloat(stackS), type: typeS, board: boardS }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [typeSel, setTypeSel] = useState<StoredRange['type'] | null>(() =>
    init?.type ? (types.find(t => typeSlug(t) === init.type) ?? null) : null)
  const type = types.includes(typeSel as StoredRange['type'])
    ? (typeSel as StoredRange['type'])
    : (types.includes(defaultType as StoredRange['type'])
        ? (defaultType as StoredRange['type'])
        : (ranges.some(r => r.type === 'cEV') ? 'cEV' : types[0]))
  const ofType = useMemo(() => ranges.filter(r => r.type === type), [ranges, type])
  const stacks = useMemo(
    () => [...new Set(ofType.map(r => r.stack))].sort((a, b) => b - a),
    [ofType],
  )
  const [stackSel, setStackSel] = useState<number | null>(() =>
    init?.stack && !isNaN(init.stack) ? init.stack : (defaultStack ?? null))
  const [board, setBoard] = useState<string | null>(() =>
    postflop && init?.board && init.board !== 'open' ? init.board : null)
  const stack = stacks.includes(stackSel as number)
    ? (stackSel as number)
    : stacks[0]
  // the depth ladder shows ONLY the active scenario's depths — every pill
  // is live; switching scenario snaps to the nearest solved depth
  const maxStack = stacks[0]
  const current = ofType.find(r => r.stack === stack) ?? ofType[0]
  const boards = postflop ? current.postflop ?? [] : []
  // postflop children are raw (minimal fields + open-weighted paste) —
  // materializeChild injects the parent context and converts on display
  const child = boards.find(b => b.id === board)
  const shown = child ? materializeChild(current, child) : current
  const ctx = child ? lineContext(child.line) : null
  const baseStr = child
    ? (child.reach ?? current.actions[ctx!.parentAction] ?? Object.values(current.actions).join(','))
    : ''
  // range summary: % of hands preflop, % of the parent open postflop
  const share = useMemo(() => strategyShare(shown.actions, baseStr), [shown, baseStr])

  const writeHash = (s: number, t: string, b: string | null) => {
    if (!hashPrefix) return
    window.history.replaceState(null, '',
      `${window.location.pathname}${window.location.search}${hashPrefix}/${s}/${typeSlug(t)}/${b ?? 'open'}`)
  }

  const switchType = (t: StoredRange['type']) => {
    setTypeSel(t)
    setBoard(null)
    // keep the current stack when the new solution has it; otherwise fall
    // back to the stack nearest the current one (deepest on ties)
    const ofNew = ranges.filter(r => r.type === t).map(r => r.stack)
    const nextStack = ofNew.includes(stack) ? stack : nearestStack(ofNew, stack)
    setStackSel(nextStack)
    writeHash(nextStack, t, null)
  }

  // a solution solved at the given depth — every depth pill is live: it
  // always belongs to the active scenario
  const pickStack = (s: number) => {
    setStackSel(s)
    writeHash(s, type, board)
  }

  // group the postflop boards by the line that produced them (line field)
  const boardGroups: { line: string | null; boards: typeof boards }[] = []
  for (const b of boards) {
    const line = b.line ?? null
    const group = boardGroups.find(g => g.line === line)
    if (group) group.boards.push(b)
    else boardGroups.push({ line, boards: [b] })
  }

  return (
    // Fixed width so the panel never resizes between views: must fit the grid
    // (14 cols x 46px cells + gutters + padding, ~689px) on one line with the
    // header text and the stack selector side by side (~730px).
    <div className={
      fill
        ? 'rounded-xl border border-line bg-panel overflow-hidden w-full max-w-[780px] mx-auto h-full min-h-0 flex flex-col'
        : 'my-4 rounded-xl border border-line bg-panel overflow-hidden w-[730px] max-w-full mx-auto'
    }>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2.5 bg-panel2 border-b border-line">
        <div className="flex items-baseline gap-2 min-w-0 flex-1">
          <span className="text-base font-bold text-txt shrink-0">{current.title} · {current.stack}bb</span>
          <span className="text-sm text-muted truncate min-w-0 flex-1">{shown.subtitle}</span>
          {shown.wizardUrl && (
            <a
              href={shown.wizardUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold uppercase tracking-wider text-accent hover:underline shrink-0"
            >
              GTO Wizard
            </a>
          )}
          <span className="shrink-0 text-[11px] font-bold text-accent bg-accent/10 border border-accent/30 rounded-full px-2 py-0.5 tabular-nums">
            {share.toFixed(1)}% {child ? 'of range' : 'of hands'}
          </span>
        </div>
      </div>
      {stacks.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 bg-panel2 border-b border-line">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Depth</span>
          <div className="flex flex-wrap gap-0.5 bg-dark rounded-md p-1 border border-line/50 max-w-full">
            {stacks.map(s => {
              const active = stack === s
              // asymmetric entries (covered/covering configs) carry the
              // stack config as a third subtitle segment — surface it as
              // a tooltip on the stack pill
              const meta = ofType.find(r => r.stack === s)
              const asymmetric = !!meta && (meta.subtitle.match(/·/g) ?? []).length >= 2
              return (
                <button
                  key={s}
                  onClick={() => pickStack(s)}
                  title={asymmetric ? meta!.subtitle : undefined}
                  className={`flex flex-col items-center gap-1 px-2 pt-0.5 pb-1 rounded-[5px] cursor-pointer transition-colors tabular-nums ${
                    active
                      ? 'bg-accent text-dark'
                      : 'text-txt/80 hover:text-txt hover:bg-panel/60'
                  }`}
                >
                  <span className="text-[11px] font-semibold leading-none">{s}bb</span>
                  {/* depth gauge: fill is proportional to the stack depth */}
                  <span className={`w-full h-[2px] rounded-full overflow-hidden ${active ? 'bg-dark/25' : 'bg-line'}`}>
                    <span
                      className={`block h-full rounded-full transition-colors ${active ? 'bg-dark' : 'bg-muted/80'}`}
                      style={{ width: `${Math.round((s / maxStack) * 100)}%` }}
                    />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        )}
      {(types.length > 1 || current.config) && (
        // one strip: solution-type pills, and for asymmetric solutions the
        // whole table's stacks in seat order. Color code vs hero: red =
        // covers hero 2x+, orange = covers hero, green = covered by hero;
        // the hero seat itself is accented.
        <div className="flex items-center gap-3 px-4 py-2 bg-panel2 border-b border-line flex-wrap">
          {types.length > 1 && (() => {
            // scenario groups: equal stacks / you cover them / they cover
            // you — the course's mental model instead of a flat type list
            const groups = new Map<string, { order: number; types: StoredRange['type'][] }>()
            for (const t of types) {
              const [order, label] = typeGroupLabel(t)
              const g = groups.get(label) ?? { order, types: [] as StoredRange['type'][] }
              g.types.push(t)
              groups.set(label, g)
            }
            const list = [...groups.entries()]
              .sort((a, b) => a[1].order - b[1].order)
              .map(([label, g]) => [label, g.types.sort((a, b) => modelOrder(a) - modelOrder(b))] as const)
            return (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Solution</span>
                {list.map(([label, gts]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    {list.length > 1 && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider text-muted cursor-help"
                        title={GROUP_HELP[label] ?? shortTarget(type)}
                      >
                        {label}
                      </span>
                    )}
                    <div className="flex gap-0.5 bg-dark rounded-md p-1 border border-line/50">
                      {gts.map(t => (
                        <button
                          key={t}
                          onClick={() => switchType(t)}
                          className={pillClass(type === t)}
                          title={`${shortTarget(t)} — solved at ${ranges.filter(r => r.type === t).map(r => r.stack).sort((a, b) => b - a).join(', ')}bb`}
                        >
                          {groupPill(t)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
          {current.config && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted mr-0.5">Table</span>
              {current.config.map((s, i) => {
                const seat = SEATS[i]
                const hero = seat === current.position
                const rel = hero ? 'hero'
                  : s >= current.stack * 2 ? 'twice'
                  : s > current.stack ? 'covers'
                  : s < current.stack ? 'covered'
                  : 'even'
                return (
                  <span
                    key={seat}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
                      rel === 'hero' ? 'bg-accent text-dark'
                        : rel === 'twice' ? 'text-bad font-bold'
                        : rel === 'covers' ? 'text-warn'
                        : rel === 'covered' ? 'text-good'
                        : 'text-muted'
                    }`}
                  >
                    {seat} {s}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      )}
      {boards.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-panel2 border-b border-line flex-wrap">
          <div className="flex gap-0.5 bg-dark rounded-md p-1 border border-line/50">
            <button onClick={() => { setBoard(null); writeHash(stack, type, null) }} className={pillClass(board === null)}>
              Open
            </button>
          </div>
          {boardGroups.map(group => (
            <Fragment key={group.line ?? 'default'}>
              {group.line && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted ml-1">
                  {group.line}
                </span>
              )}
              <div className="flex gap-1 bg-dark rounded-md p-1 border border-line/50">
                {group.boards.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setBoard(b.id!); writeHash(stack, type, b.id!) }}
                    title={b.label ? `${b.label.replace(/[shdc]/g, '')} board` : undefined}
                    className={`flex flex-col items-center gap-0.5 px-1 py-0.5 rounded-[7px] cursor-pointer transition-all ${
                      board === b.id
                        ? 'ring-2 ring-accent'
                        : 'opacity-45 hover:opacity-100 ring-2 ring-transparent'
                    }`}
                  >
                    <Board cards={b.label ?? b.id!} size="sm" />
                    <span className="text-[8px] text-muted font-bold leading-none uppercase">
                      {boardTexture(b.label ?? b.id!)}
                    </span>
                  </button>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      )}
      <div className={fill ? 'p-3.5 flex-1 min-h-0 flex flex-col' : 'p-3.5'}>
        <RangeGrid
          {...shown.actions}
          sizings={shown.sizings}
          base={baseStr || undefined}
          fill={fill}
        />
      </div>
    </div>
  )
}

export default RangeBrowser
