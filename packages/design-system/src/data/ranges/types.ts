// Stored range types and helpers shared by all solution groups.

export type RangeAction = 'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'

/** Solution type: cEV (chip-EV), ICM (equal-stack tournament equity),
 *  or its asymmetric-stack variants (covered/covering configs) */
export type SolutionType =
  | 'cEV'
  | 'ICM'
  | 'ICM-FT'              // final table (200-man FT payouts), equal stacks
  | 'ICM-FT-covered-deep' // final table, covered by much bigger stacks
  | 'ICM-FT-covering'     // final table, covers the table
  | 'ICM-covered-deep'    // covered by a much bigger stack (BM2 "covered by heaps")
  | 'ICM-covered-similar' // covered but close ("game of chicken")
  | 'ICM-covering'

export interface StoredRange {
  /** Spot label, e.g. "UTG RFI" */
  title: string
  /** Solution variant, e.g. "ChipEV" or "ICM 83% left" */
  subtitle: string
  /** Solution type — cEV (chip-EV) or ICM (tournament equity) */
  type: SolutionType
  /** Effective stack in bb */
  stack: number
  /** Hero position, e.g. "UTG" */
  position: string
  /** Per-action combo:freq strings; omit actions that don't apply */
  actions: Partial<Record<RangeAction, string>>
  /** Bet/raise sizes in bb per action, shown in the grid legend (e.g. raise: 2.2) */
  sizings?: Partial<Record<RangeAction, number>>
  /** Stable id for lookup, e.g. "k83" (postflop children) */
  id?: string
  /** Board cards shown in selectors, e.g. "Kh8h3c" (postflop children) */
  label?: string
  /** Preflop line that produced this spot, e.g. "Cbet vs BB call" (postflop children) */
  line?: string
  /** Flop-action history leading to the hero's decision, e.g. "X-R1.5"
   *  (postflop children; the Wizard link's flop_actions) */
  node?: string
  /** The hero's weighted reach at the node, verbatim from the capture
   *  (combo:freq line) — open x street conditionals for deep nodes. The
   *  display base: grid fills and legend shares weight by it. Falls back to
   *  the line's parent line when absent (flop children reach their whole
   *  parent line). */
  reach?: string
  /** GTO Wizard share link for the spot (preflop entries: their decision node; postflop children: the flop node) */
  wizardUrl?: string
  /** Asymmetric entries only: the eight stacks in seat order UTG..BB (bb).
   *  Equal-stack entries omit it — their config is stack x8. */
  config?: number[]
  /** Postflop solutions derived from this preflop range; nested in the same store file */
  postflop?: StoredRange[]
}

/** Pick a single stack depth out of a group (e.g. for single-range display) */
export function byStack(ranges: StoredRange[], stack: number): StoredRange {
  return ranges.find(r => r.stack === stack) ?? ranges[0]
}

function parseComboLine(line: string): Record<string, number> {
  const out: Record<string, number> = {}
  for (const entry of line.split(',')) {
    const [combo, raw] = entry.trim().split(':')
    if (!combo || raw === undefined) continue
    const freq = parseFloat(raw)
    if (!isNaN(freq)) out[combo] = freq
  }
  return out
}

/** Texture subtitle from board cards: "K83 two-tone (Kh8h3c)" */
export function boardTexture(board: string): string {
  const suits = board.replace(/[^shdc]/g, '')
  const distinct = new Set(suits).size
  return distinct === 1 ? 'monotone' : distinct === suits.length ? 'rainbow' : 'two-tone'
}

export function boardSubtitle(board: string): string {
  const flop = board.slice(0, 6)
  const later = board.slice(6).match(/[AKQJT2-9][shdc]/g) ?? []
  const ranks = flop.replace(/[shdc]/g, '')
  const label = later.length
    ? `${ranks} ${boardTexture(flop)} + ${later.join(' ')} (${board})`
    : `${ranks} ${boardTexture(flop)} (${board})`
  return label
}

const WIZARD = ('https://app.gtowizard.com/solutions?solution_type=gwiz&soltab=range'
  + '&gmfs_solution_tab=ai_sols')

/** Equal-stack depth/stack params (stack in bb + 0.125). */
function wizardParams(stack: number): string {
  const d = stack + 0.125
  const stacks = Array(8).fill(d).join('-')
  return `&depth=${d}&stacks=${stacks}`
}

/** The app's gametypes: cEV MTT 8-max and the ICM structures used by the
 *  ranges — the 200-man bubble (33 left, preflop-only) and its final table. */
export const CEV_GAMETYPE = 'MTTGeneral_8m'
export const ICM_GAMETYPE = 'MTTGeneral_ICM8m200PTBUBBLEMID'
export const ICM_FT_GAMETYPE = 'MTTGeneral_ICM8m200PTFT'

/** Wizard link to a preflop decision node (an entry's own spot):
 *  preflopActions = the line before the entry acts, historySpot = 1 + its length. */
export function preflopUrl(stack: number, preflopActions: string, historySpot: number,
                           gametype: string = CEV_GAMETYPE): string {
  let url = `${WIZARD}&gametype=${gametype}${wizardParams(stack)}`
  if (preflopActions) url += `&preflop_actions=${preflopActions}`
  return `${url}&history_spot=${historySpot}`
}

/** Wizard link to a preflop node on an explicit asymmetric stack config:
 *  stacks are the eight stacks in seat order UTG..BB (bb). Used by the
 *  covered-stack BM spots, where the stack config IS the lesson. */
export function preflopUrlStacks(stacks: number[], preflopActions: string,
                                 historySpot: number,
                                 gametype: string = CEV_GAMETYPE): string {
  const d = stacks.map(s => s + 0.125)
  let url = `${WIZARD}&gametype=${gametype}&depth=${d[0]}&stacks=${d.join('-')}`
  if (preflopActions) url += `&preflop_actions=${preflopActions}`
  return `${url}&history_spot=${historySpot}`
}

/** Wizard link to a postflop node: preflop actions, the street-split
 *  histories leading to the node (flopActions / turnActions / riverActions —
 *  the app's own canonical form; e.g. flop "X-R1.1-C", turn "X-R8.7-C",
 *  river "X") and the board — all cards dealt so far. The node ordinal is
 *  1 + preflop actions + max(0, history actions - 1), counting every
 *  street — empirically pinned against the app's own URLs. repfloptab (the
 *  flop report view) follows the flop texture and is omitted past the flop. */
export function flopUrlRaw(preflop: string, flopActions: string, board: string, stack = 40,
                           turnActions = '', riverActions = ''): string {
  const hist = [...flopActions.split('-'),
    ...(turnActions ? turnActions.split('-') : []),
    ...(riverActions ? riverActions.split('-') : [])]
  const spot = 1 + preflop.split('-').length + Math.max(0, hist.length - 1)
  const flop = board.slice(0, 6)
  const ranks = flop.replace(/[shdc]/g, '')
  const paired = new Set(ranks).size < ranks.length
  const high = [...ranks].sort((a, b) => 'AKQJT98765432'.indexOf(a) - 'AKQJT98765432'.indexOf(b))[0]
  const tab = !paired && boardTexture(flop) !== 'monotone' && 'AKQJT'.includes(high)
    ? 'swv_high_cards' : 'swv_flops'
  return `${WIZARD}&gametype=${CEV_GAMETYPE}${wizardParams(stack)}&gmfft_sort_key=0&gmfft_sort_order=desc`
    + `&history_spot=${spot}&legacy_postflop_sizings=true&preflop_actions=${preflop}`
    + `&flop_actions=${flopActions}` + (turnActions ? `&turn_actions=${turnActions}` : '')
    + (riverActions ? `&river_actions=${riverActions}` : '')
    + (board.length <= 6 ? `&repfloptab=${tab}` : '') + `&board=${board}`
}

/** Wizard link to the flop c-bet node of an open-vs-BB-call line (flop spots
 *  are solved at 40bb; repfloptab follows the board texture). */
export function flopUrl(openPosition: string, openSize: number, board: string, stack = 40): string {
  const open = openPosition === 'BTN' ? `F-F-F-F-F-R${openSize}` : `R${openSize}`
  const folds = openPosition === 'BTN' ? 1 : 6
  const preflop = [open, ...Array(folds).fill('F'), 'C'].join('-')
  return flopUrlRaw(preflop, 'X', board, stack)
}

// ---- Postflop line contexts --------------------------------------------
//
// Postflop children carry a human `line` (grouped in RangeBrowser's board
// selector) plus `node` — the flop-action history leading to the hero's
// decision (e.g. "X-R1.5": BB checked, villain c-bet 1.5bb). Each line maps
// to its LineContext: the parent line whose weights are the hero's flop
// reach, the child's title, the example-card action trail and the Wizard
// link. Open/3-bet sizes per depth are static solution metadata read from
// the captured nodes at import time.

/** Open size in bb per opener-depth (read from the captured RFI nodes —
 *  the app's open size varies with depth). */
const OPEN_SIZE: Record<string, number> = {
  'UTG-100': 2.1, 'UTG-80': 2, 'UTG-50': 2, 'UTG-40': 2, 'UTG-25': 2, 'UTG-20': 2, 'UTG-15': 2, 'UTG-13': 2,
  'HJ-60': 2.1, 'HJ-40': 2, 'HJ-25': 2, 'HJ-15': 2,
  'CO-80': 2.2, 'CO-60': 2.1, 'CO-50': 2.1, 'CO-40': 2, 'CO-25': 2,
  'BTN-80': 2.3, 'BTN-50': 2.1, 'BTN-40': 2.1, 'BTN-35': 2, 'BTN-25': 2,
  'SB-40': 3,
}

/** The opener's open size at a depth — c-bet/defend line builders read the
 *  open from this table (the defend parent's own sizings.raise is the
 *  3-bet size, not the open). */
export function openSizeFor(opener: string, stack: number): number {
  return OPEN_SIZE[`${opener}-${stack}`] ?? 2
}

/** 3-bet size in bb per 3-bettor-depth, UTG lines (read from the captured
 *  vs-3bet defender nodes). */
const THREEBET_SIZE: Record<string, number> = {
  'HJ-50': 6, 'HJ-40': 5.5,
  'BTN-50': 6.5, 'BTN-40': 6.5,
  'BB-50': 9, 'BB-40': 9,
}

/** One chip of the preflop line that leads to a solved node: `pos` is the
 *  acting seat, `act` the badge label (e.g. "Raise 2bb"), `variant` the
 *  badge color. Trails carry only the preflop actions — the flop history
 *  lives in the node, the depth in the spot, the sizings in the badges. */
export interface TrailStep {
  pos: string
  act: string
  variant: 'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn'
}

export interface LineContext {
  /** parent line whose weights are the hero's flop reach */
  parentAction: 'raise' | 'check' | 'call'
  /** spot label for the materialized child */
  title: (p: StoredRange, c: StoredRange) => string
  /** preflop line leading to the flop — chips on the example card */
  trail: (p: StoredRange, c: StoredRange) => TrailStep[]
  /** Wizard share link for the flop node */
  url: (p: StoredRange, c: StoredRange) => string
}

/** The node's street-split histories: [flop, turn?, river?] — e.g.
 *  ["X-R1.1-C", "X-R8.7-C", "X"]. Flop-only nodes have one street. */
const nodeStreets = (node?: string): string[] => (node ?? '').split('/')
const openLineFor = (opener: string, open: number): string => callLineFor(opener, 'BB', open)
/** Preflop open-then-call line: folds before the opener, the raise, folds
 *  down to the caller (BB by default, SB for the SB-call lines), then the
 *  call. The app requires the LEADING folds — a line without them does not
 *  resolve (verified: CO's line is F-F-F-F-R2.2-F-F-C). */
const callLineFor = (opener: string, caller: 'SB' | 'BB', open: number): string => {
  const seat = ({ UTG: 0, 'UTG+1': 1, LJ: 2, HJ: 3, CO: 4, BTN: 5, SB: 6 } as Record<string, number>)[opener] ?? 0
  const callerSeat = caller === 'SB' ? 6 : 7
  // an SB caller leaves the BB to act — their fold completes the preflop
  return [...Array(seat).fill('F'), 'R' + open, ...Array(callerSeat - seat - 1).fill('F'),
    'C', ...(caller === 'SB' ? ['F'] : [])].join('-')
}
const threeBetLineFor = (villain: string, t3: number): string => {
  const seat = ({ HJ: 3, CO: 4, BTN: 5, SB: 6, BB: 7 } as Record<string, number>)[villain] ?? 5
  return ['R2', ...Array(seat - 1).fill('F'), 'R' + t3, ...Array(7 - seat).fill('F')].join('-')
}
/** Display seat for a line's villain — the store lines name the villain's
 *  action too ("Turn barrel vs BB call"); chips show just the seat. */
const seat = (villain: string) => villain.replace(/ (call|check)$/, '')

/** Open-vs-call preflop trail. */
const cbetTrail = (opener: string, open: number): TrailStep[] => [
  { pos: opener, act: `Raise ${open}bb`, variant: 'raise' },
  { pos: 'BB', act: 'Call', variant: 'call' },
]

const LINES: Record<string, LineContext> = {
  'Cbet vs SB call': {
    parentAction: 'raise',
    title: (p) => `${p.position} c-bet vs SB check`,
    trail: (p) => [
      { pos: p.position, act: `Raise ${p.sizings?.raise ?? 2}bb`, variant: 'raise' },
      { pos: 'SB', act: 'Call', variant: 'call' },
    ],
    url: (p, c) =>
      flopUrlRaw(callLineFor(p.position, 'SB', p.sizings?.raise ?? 2),
        c.node ?? 'X', c.label!, p.stack),
  },
  'Cbet vs BB call': {
    parentAction: 'raise',
    title: (p) => `${p.position} c-bet vs BB check`,
    trail: (p) => [
      { pos: p.position, act: `Raise ${p.sizings?.raise ?? 2}bb`, variant: 'raise' },
      { pos: 'BB', act: 'Call', variant: 'call' },
    ],
    url: (p, c) => flopUrl(p.position, p.sizings?.raise ?? 2, c.label!, p.stack),
  },
  'Defend vs SB stab': {
    parentAction: 'check',
    title: () => 'BB defend vs SB stab',
    trail: () => [
      { pos: 'SB', act: 'Limp', variant: 'call' },
      { pos: 'BB', act: 'Check', variant: 'check' },
    ],
    url: (p, c) => flopUrlRaw('F-F-F-F-F-F-C-X', c.node ?? 'R1.5', c.label!, p.stack),
  },
  'vs BB check-raise': {
    parentAction: 'raise',
    title: (p) => `${p.position} vs BB check-raise`,
    trail: (p) => [
      { pos: p.position, act: `Raise ${p.sizings?.raise ?? 2}bb`, variant: 'raise' },
      { pos: 'BB', act: 'Call', variant: 'call' },
    ],
    url: (p, c) => flopUrlRaw(`F-F-F-F-F-R${p.sizings?.raise ?? 2}-F-C`, c.node ?? 'X-R1.1-R5', c.label!, p.stack),
  },
}

const defendLine = (opener: string): LineContext => ({
  parentAction: 'call',
  title: () => `BB defend vs ${opener} c-bet`,
  trail: (p) => cbetTrail(opener, openSizeFor(opener, p.stack)),
  url: (p, c) =>
    flopUrlRaw(openLineFor(opener, openSizeFor(opener, p.stack)) + '-C',
      c.node ?? 'X-R1.5', c.label!, p.stack),
})

const threeBetLine = (villain: string): LineContext => ({
  parentAction: 'call',
  title: (p) => `${p.position} defend vs ${villain} 3-bet c-bet`,
  trail: (p) => {
    const t3 = THREEBET_SIZE[`${villain}-${p.stack}`] ?? 6
    return [
      { pos: 'UTG', act: 'Raise 2bb', variant: 'raise' },
      { pos: villain, act: `3-bet ${t3}bb`, variant: 'raise' },
      { pos: 'UTG', act: 'Call', variant: 'call' },
    ]
  },
  url: (p, c) =>
    flopUrlRaw(threeBetLineFor(villain, THREEBET_SIZE[`${villain}-${p.stack}`] ?? 6) + '-C',
      c.node ?? 'X-R1', c.label!, p.stack),
})

/** Turn barrel: hero (the opener, IP) facing a checked turn after the flop
 *  c-bet was called. node = "X-R{cbet}-C/X" — flop check/c-bet/call, turn
 *  check. */
const turnBarrelLine = (villain: string): LineContext => ({
  parentAction: 'raise',
  title: (p) => `${p.position} turn barrel vs ${villain}`,
  trail: (p) => [
    { pos: p.position, act: `Raise ${p.sizings?.raise ?? 2}bb`, variant: 'raise' },
    { pos: seat(villain), act: 'Call', variant: 'call' },
  ],
  url: (p, c) => {
    const open = p.sizings?.raise ?? 2
    const streets = nodeStreets(c.node)
    return flopUrlRaw(callLineFor(p.position, villain.startsWith('SB') ? 'SB' : 'BB', open),
      streets[0] ?? 'X-R1-C', c.label!, p.stack, streets[1] ?? 'X', streets[2] ?? '')
  },
})

/** River barrel: hero (the opener, IP) facing a checked river after the
 *  flop c-bet and turn barrel were both called. node =
 *  "X-R{cbet}-C/X-R{turn}-C/X". */
const riverBarrelLine = (villain: string): LineContext => ({
  parentAction: 'raise',
  title: (p) => `${p.position} river barrel vs ${villain}`,
  trail: (p) => [
    { pos: p.position, act: `Raise ${p.sizings?.raise ?? 2}bb`, variant: 'raise' },
    { pos: seat(villain), act: 'Call', variant: 'call' },
  ],
  url: (p, c) => {
    const open = p.sizings?.raise ?? 2
    const streets = nodeStreets(c.node)
    return flopUrlRaw(callLineFor(p.position, villain.startsWith('SB') ? 'SB' : 'BB', open),
      streets[0] ?? 'X-R1-C', c.label!, p.stack, streets[1] ?? 'X-R1-C', streets[2] ?? 'X')
  },
})

/** Hero (the opener, IP) facing a river lead after the flop c-bet was
 *  called and the turn checked through. node = "X-R{cbet}-C/X-X/R{lead}". */
const riverLeadLine = (villain: string): LineContext => ({
  parentAction: 'raise',
  title: (p) => `${p.position} vs ${villain} river lead`,
  trail: (p) => [
    { pos: p.position, act: `Raise ${p.sizings?.raise ?? 2}bb`, variant: 'raise' },
    { pos: seat(villain), act: 'Call', variant: 'call' },
  ],
  url: (p, c) => {
    const open = p.sizings?.raise ?? 2
    const streets = nodeStreets(c.node)
    return flopUrlRaw(callLineFor(p.position, 'BB', open),
      streets[0] ?? 'X-R1-C', c.label!, p.stack, streets[1] ?? 'X-X', streets[2] ?? 'R1')
  },
})

/** Hero BB (IP, called the SB open) facing a checked river after the flop
 *  stab was called and the turn checked through. node =
 *  "X-R{stab}-C/X-X/X". */
const riverBluffLine = (): LineContext => ({
  parentAction: 'call',
  title: () => 'BB river bluff vs SB',
  trail: (p) => [
    { pos: 'SB', act: `Raise ${openSizeFor('SB', p.stack)}bb`, variant: 'raise' },
    { pos: 'BB', act: 'Call', variant: 'call' },
  ],
  url: (p, c) => {
    const streets = nodeStreets(c.node)
    return flopUrlRaw(callLineFor('SB', 'BB', openSizeFor('SB', p.stack)),
      streets[0] ?? 'X-R1-C', c.label!, p.stack, streets[1] ?? 'X-X', streets[2] ?? 'X')
  },
})

/** Resolve a child's `line` to its context. Known line families: the c-bet
 *  line (default), "Defend vs {OP} c-bet", "Defend vs {OP} 3-bet c-bet",
 *  "Turn/River barrel vs {OP} ...", "vs BB river lead",
 *  "River bluff vs SB check". */
export function lineContext(line?: string): LineContext {
  if (line?.startsWith('Defend vs ')) {
    if (line.endsWith(' 3-bet c-bet')) return threeBetLine(line.slice('Defend vs '.length, -' 3-bet c-bet'.length))
    if (line.endsWith(' c-bet')) return defendLine(line.slice('Defend vs '.length, -' c-bet'.length))
  }
  if (line?.startsWith('Turn barrel vs ')) return turnBarrelLine(line.slice('Turn barrel vs '.length))
  if (line?.startsWith('River barrel vs ')) return riverBarrelLine(line.slice('River barrel vs '.length))
  if (line === 'vs BB river lead') return riverLeadLine('BB')
  if (line === 'River bluff vs SB check') return riverBluffLine()
  return LINES[line ?? ''] ?? LINES['Cbet vs BB call']
}

/** Materialize a store line: the file carries the shared title/position once,
 *  each stack entry carries the per-stack data; the Wizard link to the
 *  entry's decision node is built by urlFor. */
export function materializeLine(
  meta: { title: string; position: string; stacks: unknown[] },
  urlFor: (stack: number, entry: StoredRange) => string,
): StoredRange[] {
  return meta.stacks.map((entry) => {
    const range = { ...entry as StoredRange, title: meta.title, position: meta.position }
    range.wizardUrl = urlFor(range.stack, range)
    return range
  })
}

/** Materialize a raw postflop child against its parent entry: injects the
 *  parent's type/stack/position and the line's title, derives the subtitle
 *  and Wizard link from the board label, and converts the raw weighted
 *  Wizard paste to conditional frequencies (toConditional — divided by the
 *  line's parent reach: the open for c-bet lines, the call for defends, the
 *  preflop check for the limp line). */
export function materializeChild(parent: StoredRange, child: StoredRange): StoredRange {
  const ctx = lineContext(child.line)
  return toConditional({
    ...child,
    title: ctx.title(parent, child),
    subtitle: child.label ? boardSubtitle(child.label) : child.subtitle,
    type: parent.type,
    stack: parent.stack,
    position: parent.position,
    wizardUrl: child.label ? ctx.url(parent, child) : child.wizardUrl,
  } as StoredRange, parent.actions[ctx.parentAction] ?? '')
}

/** A solved postflop spot bundled with the parent data needed to display it:
 *  the materialized child (title + Wizard link + conditional strategy),
 *  the parent reach line (base — weights the action shares and the grid
 *  legend) and the action trail leading to the node (chips on the example
 *  card). */
export interface SolvedFlop {
  range: StoredRange
  base: string
  trail: TrailStep[]
}

/** Bundle a raw postflop child of a materialized parent entry into a
 *  SolvedFlop (materializeChild injects the parent context and converts the
 *  paste to conditional frequencies). */
export function solvedFlop(parent: StoredRange, child: StoredRange): SolvedFlop {
  const ctx = lineContext(child.line)
  return {
    range: materializeChild(parent, child),
    base: child.reach ?? parent.actions[ctx.parentAction] ?? Object.values(parent.actions).join(','),
    trail: ctx.trail(parent, child),
  }
}

/** Postflop children store the raw GTO Wizard range-view copy (open-weight-
 *  scaled: open weight x conditional strategy) — exactly what was pasted.
 *  This converts a child to conditional display frequencies: divide by the
 *  parent open weights, round to 4dp, clamp >= 0.9995 to 1 (solver display
 *  noise), and synthesize the missing bet/check complement so per-combo
 *  frequencies sum to 1. `open` is the parent entry's raise line. */
export function toConditional(child: StoredRange, open: string): StoredRange {
  const weights = parseComboLine(open)
  const actions: Partial<Record<RangeAction, string>> = {}
  for (const [action, line] of Object.entries(child.actions)) {
    const parts: string[] = []
    for (const [combo, raw] of Object.entries(parseComboLine(line as string))) {
      const w = weights[combo]
      let f = w ? raw / w : raw
      if (f >= 0.9995) f = 1
      parts.push(`${combo}:${f.toFixed(4)}`)
    }
    actions[action as RangeAction] = parts.join(',')
  }
  if (actions.bet && !actions.check) {
    const bet = parseComboLine(actions.bet)
    const check = Object.entries(bet)
      .map(([combo, f]) => `${combo}:${(1 - f).toFixed(4)}`)
      .filter((entry) => parseFloat(entry.split(':')[1]) >= 0.00005)
    if (check.length) actions.check = check.join(',')
  }
  return { ...child, actions }
}
