// Stored range types and helpers shared by all solution groups.

export type RangeAction = 'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'

/** Solution type: cEV (chip-EV) or ICM (tournament equity) */
export type SolutionType = 'cEV' | 'ICM'

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
  /** GTO Wizard share link for the spot (preflop entries: their decision node; postflop children: the flop node) */
  wizardUrl?: string
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
  const ranks = board.replace(/[shdc]/g, '')
  return `${ranks} ${boardTexture(board)} (${board})`
}

const WIZARD = ('https://app.gtowizard.com/solutions?solution_type=gwiz&soltab=range'
  + '&gmfs_solution_tab=ai_sols&gametype=MTTGeneral_8m')

/** Equal-stack MTTGeneral_8m depth/stack params (stack in bb + 0.125). */
function wizardParams(stack: number): string {
  const d = stack + 0.125
  const stacks = Array(8).fill(d).join('-')
  return `&depth=${d}&stacks=${stacks}`
}

/** Wizard link to a preflop decision node (an entry's own spot):
 *  preflopActions = the line before the entry acts, historySpot = 1 + its length. */
export function preflopUrl(stack: number, preflopActions: string, historySpot: number): string {
  let url = WIZARD + wizardParams(stack)
  if (preflopActions) url += `&preflop_actions=${preflopActions}`
  return `${url}&history_spot=${historySpot}`
}

/** Wizard link to the flop c-bet node of an open-vs-BB-call line (flop spots
 *  are solved at 40bb; repfloptab follows the board texture). */
export function flopUrl(openPosition: string, openSize: number, board: string): string {
  const open = openPosition === 'BTN' ? `F-F-F-F-F-R${openSize}` : `R${openSize}`
  const folds = openPosition === 'BTN' ? 1 : 6
  const preflop = [open, ...Array(folds).fill('F'), 'C'].join('-')
  const ranks = board.replace(/[shdc]/g, '')
  const paired = new Set(ranks).size < ranks.length
  const high = [...ranks].sort((a, b) => 'AKQJT98765432'.indexOf(a) - 'AKQJT98765432'.indexOf(b))[0]
  const tab = !paired && boardTexture(board) !== 'monotone' && 'AKQJT'.includes(high)
    ? 'swv_high_cards' : 'swv_flops'
  return `${WIZARD}${wizardParams(40)}&gmfft_sort_key=0&gmfft_sort_order=desc`
    + `&history_spot=9&legacy_postflop_sizings=true&preflop_actions=${preflop}`
    + `&flop_actions=X&repfloptab=${tab}&board=${board}`
}

/** Materialize a store line: the file carries the shared title/position once,
 *  each stack entry carries the per-stack data; the Wizard link to the
 *  entry's decision node is built by urlFor. */
export function materializeLine(
  meta: { title: string; position: string; stacks: unknown[] },
  urlFor: (stack: number) => string,
): StoredRange[] {
  return meta.stacks.map((entry) => ({
    ...entry as StoredRange,
    title: meta.title,
    position: meta.position,
    wizardUrl: urlFor((entry as StoredRange).stack),
  }))
}

/** Materialize a raw postflop child against its parent entry: injects the
 *  parent's type/stack/position and the c-bet title, derives the subtitle
 *  and Wizard link from the board label, and converts the raw open-weighted
 *  Wizard paste to conditional frequencies (toConditional). */
export function materializeChild(parent: StoredRange, child: StoredRange): StoredRange {
  return toConditional({
    ...child,
    title: `${parent.position} c-bet vs BB check`,
    subtitle: child.label ? boardSubtitle(child.label) : child.subtitle,
    type: parent.type,
    stack: parent.stack,
    position: parent.position,
    wizardUrl: child.label
      ? flopUrl(parent.position, parent.sizings?.raise ?? 2, child.label)
      : child.wizardUrl,
  } as StoredRange, parent.actions.raise ?? '')
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
