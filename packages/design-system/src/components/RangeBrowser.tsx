import { Fragment, useMemo, useState } from 'react'
import { RangeGrid, strategyShare, handClassTotals } from './RangeGrid'
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
  /** Hash prefix to persist the selection under (e.g. "#ranges/btn") — the
   *  stack, solution type and board are appended as segments and restored
   *  on mount, so a spot reloads exactly where you left it. */
  hashPrefix?: string
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

/** Stacks where both a reference and a target solution type exist. */
function pairStacksOf(ranges: StoredRange[], ref: string, target: string): number[] {
  return [...new Set(ranges
    .filter(r => r.type === target && ranges.some(x => x.type === ref && x.stack === r.stack))
    .map(r => r.stack))]
}

/** Nearest candidate stack (deepest wins ties). */
function nearestStack(candidates: number[], from: number): number {
  return candidates.reduce((best, s) =>
    Math.abs(s - from) < Math.abs(best - from) || (
      Math.abs(s - from) === Math.abs(best - from) && s > best) ? s : best,
  candidates[0])
}

/** Short display name for a solution type ("ICM-covered-deep" → "covered deep"). */
function shortTarget(t: string): string {
  return t.replace(/^ICM-/, '').replace(/-/g, ' ')
}

const pillClass = (active: boolean) =>
  `px-2.5 py-1 rounded-[5px] text-[11px] font-semibold transition-colors ${
    active ? 'bg-accent text-dark' : 'text-txt/80 hover:text-txt hover:bg-panel/60'
  }`

export function RangeBrowser({ ranges, defaultStack, hashPrefix }: RangeBrowserProps) {
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
    : (ranges.some(r => r.type === 'cEV') ? 'cEV' : types[0])
  const ofType = useMemo(() => ranges.filter(r => r.type === type), [ranges, type])
  const stacks = useMemo(
    () => [...new Set(ofType.map(r => r.stack))].sort((a, b) => b - a),
    [ofType],
  )
  const [stackSel, setStackSel] = useState<number | null>(() =>
    init?.stack && !isNaN(init.stack) ? init.stack : (defaultStack ?? null))
  const [board, setBoard] = useState<string | null>(() =>
    init?.board && init.board !== 'open' ? init.board : null)
  // diff overlay: pick ANY two solution types that share a stack. While
  // active the grid shows the per-hand-class delta (B − A); the stack pills
  // show only the stacks the pair has in common.
  const [diffOn, setDiffOn] = useState(false)
  const [diffA, setDiffA] = useState<StoredRange['type'] | null>(null)
  const [diffB, setDiffB] = useState<StoredRange['type'] | null>(null)
  // types that can participate in at least one pair
  const pairable = useMemo(
    () => types.filter(t => types.some(o => o !== t && pairStacksOf(ranges, o, t).length > 0)),
    [ranges, types])
  const anyDiffPair = pairable.length >= 2
  const diffStacks = useMemo(
    () => (diffA && diffB && diffA !== diffB ? pairStacksOf(ranges, diffA, diffB) : []),
    [ranges, diffA, diffB])
  // while diffing, the effective stack comes from the pair's common stacks
  const activeStacks = diffOn && diffStacks.length ? diffStacks : stacks
  const stack = activeStacks.includes(stackSel as number)
    ? (stackSel as number)
    : activeStacks[0]
  // the depth ladder always shows every stack in the group; depths without
  // a solution for the current view are greyed out and disabled
  const allStacks = useMemo(
    () => [...new Set(ranges.map(r => r.stack))].sort((a, b) => b - a),
    [ranges])
  const current = ofType.find(r => r.stack === stack) ?? ofType[0]
  const maxStack = allStacks[0]
  const boards = current.postflop ?? []
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
  const diff = useMemo(() => {
    if (!diffOn || !diffA || !diffB) return null
    const a = ranges.find(r => r.type === diffA && r.stack === stack)
    const b = ranges.find(r => r.type === diffB && r.stack === stack)
    if (!a || !b) return null
    const t1 = handClassTotals(a.actions)
    const t2 = handClassTotals(b.actions)
    const out: Record<string, number> = {}
    for (const hc of new Set([...Object.keys(t1), ...Object.keys(t2)])) {
      out[hc] = (t2[hc] ?? 0) - (t1[hc] ?? 0)
    }
    return out
  }, [diffOn, ranges, stack, diffA, diffB])

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

  // enter diff with a sensible default pair: the browsed type vs cEV (or
  // vs the first type that pairs with it when cEV doesn't)
  const enterDiff = () => {
    let b: StoredRange['type'] | null = type
    let a: StoredRange['type'] | null = null
    if (type === 'cEV') {
      b = types.find(t => t !== 'cEV' && pairStacksOf(ranges, 'cEV', t).length > 0) ?? null
      a = b ? 'cEV' : null
    } else if (pairStacksOf(ranges, 'cEV', type).length > 0) {
      a = 'cEV'
    } else {
      a = types.find(t => t !== type && pairStacksOf(ranges, t, type).length > 0) ?? null
    }
    if (!a || !b || a === b) return
    const commons = pairStacksOf(ranges, a, b)
    if (!commons.length) return
    setDiffA(a)
    setDiffB(b)
    setBoard(null)
    setDiffOn(true)
    if (!commons.includes(stack)) {
      const next = nearestStack(commons, stack)
      setStackSel(next)
      writeHash(next, type, null)
    }
  }

  // keep the pair valid: when one side changes, replace the other if the
  // pair breaks, and snap to the nearest common stack
  const setDiffSide = (side: 'A' | 'B', t: StoredRange['type']) => {
    const other = side === 'A' ? diffB : diffA
    let fixedOther = other
    if (other === t || (other && pairStacksOf(ranges, side === 'A' ? t : other as string, side === 'A' ? other as string : t).length === 0)) {
      fixedOther = types.find(x => x !== t && pairStacksOf(ranges, t, x).length > 0) ?? null
    }
    if (!fixedOther) return
    if (side === 'A') { setDiffA(t); setDiffB(fixedOther) }
    else { setDiffB(t); setDiffA(fixedOther) }
    const commons = pairStacksOf(ranges, side === 'A' ? t : fixedOther, side === 'A' ? fixedOther : t)
    if (!commons.includes(stack)) {
      const next = nearestStack(commons, stack)
      setStackSel(next)
      writeHash(next, type, null)
    }
  }

  // a solution solved at the given depth — preference cEV, then ICM, then
  // whatever exists; null when no type has it
  const typeWithStack = (s: number): StoredRange['type'] | null => {
    const avail = types.filter(t => ranges.some(r => r.type === t && r.stack === s))
    if (!avail.length) return null
    return avail.includes('cEV') ? 'cEV' : avail.includes('ICM') ? 'ICM' : avail[0]
  }

  // every bb is always selectable: when the current view has no solution
  // at that depth, switch to one that does (in diff mode, leave the diff)
  const pickStack = (s: number) => {
    if (diffOn) {
      if (diffStacks.includes(s)) {
        setStackSel(s)
        writeHash(s, type, board)
      } else {
        const t = typeWithStack(s) ?? type
        setDiffOn(false)
        setBoard(null)
        setTypeSel(t === type ? typeSel : t)
        setStackSel(s)
        writeHash(s, t, null)
      }
      return
    }
    if (ranges.some(r => r.type === type && r.stack === s)) {
      setStackSel(s)
      writeHash(s, type, board)
    } else {
      const t = typeWithStack(s)
      if (!t) return
      setTypeSel(t)
      setBoard(null)
      setStackSel(s)
      writeHash(s, t, null)
    }
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
    <div className="my-4 rounded-xl border border-line bg-panel overflow-hidden w-[730px] max-w-full mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2.5 bg-panel2 border-b border-line">
        <div className="flex items-baseline gap-2 min-w-0 flex-1">
          <span className="text-base font-bold text-txt truncate">{current.title} · {current.stack}bb</span>
          <span className="text-sm text-muted truncate">{shown.subtitle}</span>
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
          {!diffOn && (
            <span className="shrink-0 text-[11px] font-bold text-accent bg-accent/10 border border-accent/30 rounded-full px-2 py-0.5 tabular-nums">
              {share.toFixed(1)}% {child ? 'of range' : 'of hands'}
            </span>
          )}
        </div>
        {allStacks.length > 0 && (
          <div className="flex flex-wrap gap-0.5 bg-dark rounded-md p-1 border border-line/50 max-w-full">
            {allStacks.map(s => {
              const active = stack === s
              // dimmed depths have no solution for the current view — the
              // ladder doubles as a support map; they stay clickable and
              // switch to a solution solved there
              const supported = diffOn
                ? diffStacks.includes(s)
                : ranges.some(r => r.type === type && r.stack === s)
              const switchTo = !supported ? typeWithStack(s) : null
              // asymmetric entries (covered/covering configs) carry the
              // stack config as a third subtitle segment — surface it as
              // a tooltip on the stack pill
              const meta = ranges.find(r => r.stack === s)
              const asymmetric = !!meta && (meta.subtitle.match(/·/g) ?? []).length >= 2
              return (
                <button
                  key={s}
                  onClick={() => pickStack(s)}
                  title={
                    supported
                      ? (asymmetric ? meta!.subtitle : undefined)
                      : diffOn
                        ? `leaves diff — browses ${switchTo ?? type} at ${s}bb`
                        : switchTo && switchTo !== type
                          ? `switches to ${switchTo.replace(/-/g, ' ')} at ${s}bb`
                          : (asymmetric ? meta!.subtitle : undefined)
                  }
                  className={`flex flex-col items-center gap-1 px-2 pt-0.5 pb-1 rounded-[5px] cursor-pointer transition-colors tabular-nums ${
                    supported ? '' : 'opacity-40'
                  } ${
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
        )}
      </div>
      {(types.length > 1 || current.config) && (
        // one strip: solution-type pills, and for asymmetric solutions the
        // whole table's stacks in seat order. Color code vs hero: red =
        // covers hero 2x+, orange = covers hero, green = covered by hero;
        // the hero seat itself is accented.
        <div className="flex items-center gap-3 px-4 py-2 bg-panel2 border-b border-line flex-wrap">
          {types.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Solution</span>
              <div className="flex gap-0.5 bg-dark rounded-md p-1 border border-line/50">
                {types.map(t => {
                  // in browse mode: solved at the selected depth; in diff
                  // mode: pairs with the current A side
                  const available = diffOn
                    ? diffA !== t && pairStacksOf(ranges, diffA!, t).length > 0
                    : ranges.some(r => r.type === t && r.stack === stack)
                  return (
                    <button
                      key={t}
                      disabled={!available}
                      // while diffing, the type pills pick the diff's B side
                      onClick={() => (diffOn ? setDiffSide('B', t) : switchType(t))}
                      className={`${pillClass(diffOn ? diffB === t : type === t)} ${available ? '' : 'opacity-40 cursor-not-allowed'}`}
                      title={
                        available ? undefined
                          : diffOn ? `${t.replace(/-/g, ' ')} shares no stack with ${shortTarget(diffA!)}`
                          : `${t.replace(/-/g, ' ')} is not solved at ${stack}bb`
                      }
                    >
                      {t.replace(/-/g, ' ')}
                    </button>
                  )
                })}
              </div>
              {anyDiffPair && (
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5 bg-dark rounded-md p-1 border border-line/50">
                    <button
                      onClick={() => (diffOn ? setDiffOn(false) : enterDiff())}
                      className={pillClass(diffOn)}
                      title="Compare any two solutions that share a stack"
                    >
                      Diff
                    </button>
                  </div>
                  {diffOn && (
                    <div className="flex items-center gap-1">
                      <select
                        value={diffA ?? undefined}
                        onChange={e => setDiffSide('A', e.target.value as StoredRange['type'])}
                        className="bg-dark border border-line/50 rounded-[5px] px-1.5 py-1 text-[11px] font-semibold text-txt cursor-pointer"
                        title="Reference solution (A) — the diff shows B minus A"
                      >
                        {pairable.map(t => (
                          <option key={t} value={t} disabled={diffB === t || pairStacksOf(ranges, t, diffB!).length === 0}>
                            {shortTarget(t)}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] font-bold uppercase text-muted">vs</span>
                      <select
                        value={diffB ?? undefined}
                        onChange={e => setDiffSide('B', e.target.value as StoredRange['type'])}
                        className="bg-dark border border-line/50 rounded-[5px] px-1.5 py-1 text-[11px] font-semibold text-txt cursor-pointer"
                        title="Target solution (B) — the diff shows B minus A"
                      >
                        {pairable.map(t => (
                          <option key={t} value={t} disabled={diffA === t || pairStacksOf(ranges, diffA!, t).length === 0}>
                            {shortTarget(t)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
      {!diffOn && boards.length > 0 && (
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
      <div className="p-3.5">
        {diff ? (
          <RangeGrid
            diff={diff}
            diffRefLabel={shortTarget(diffA!)}
            diffNegLabel={`${shortTarget(diffB!)} folds more`}
            diffPosLabel={`${shortTarget(diffB!)} plays more`}
          />
        ) : (
          <RangeGrid
            {...shown.actions}
            sizings={shown.sizings}
            base={baseStr || undefined}
          />
        )}
      </div>
    </div>
  )
}

export default RangeBrowser
