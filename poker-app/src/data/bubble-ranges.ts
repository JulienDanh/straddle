// Bubble Mastery range data — representative ranges based on transcript VPIP
// percentages and hand composition notes.
//
// These are approximate ranges constructed to match the described VPIP and
// composition (blocker-heavy, Ax-heavy, suited connectors, etc.). They are
// NOT solver outputs — they are study aids for visualizing what each
// percentage looks like.

export interface BubbleRange {
  id: string
  label: string
  position: string
  stack: string
  cover: string
  vpip: string
  range: string
  notes?: string
}

export const bubbleRanges: BubbleRange[] = [
  // ---- BM2: Covered (You Are Covered) ----
  {
    id: 'btn-12bb-covered-heaps',
    label: 'BTN 12bb · Covered by heaps (53bb BB)',
    position: 'BTN',
    stack: '12bb',
    cover: 'Covered by 2x+',
    vpip: '~20%',
    range: '55+, A2s+, A9o+, ATo+, K9s+, KTo+, Q9s+, QTo+, J9s+, T9s',
    notes: 'Almost no open shoves. Offsuit Ax very poor. Cut low pairs, worst Ax.',
  },
  {
    id: 'btn-12bb-covered-close',
    label: 'BTN 12bb · Game of chicken (16bb BB)',
    position: 'BTN',
    stack: '12bb',
    cover: 'Close stacks',
    vpip: '~28%',
    range: '44+, A2s+, A8o+, ATo+, K8s+, KTo+, Q8s+, QTo+, J8s+, JTo, T8s+, 98s, 87s, 76s, 65s',
    notes: 'More open shoving. BB handicapped by risk.',
  },
  {
    id: 'btn-33bb-covered',
    label: 'BTN 33bb · Covered (53bb BB)',
    position: 'BTN',
    stack: '33bb',
    cover: 'Covered',
    vpip: '~35%',
    range: '33+, A2s+, A7o+, ATo+, K6s+, K9o+, Q8s+, Q9o+, J8s+, J9o+, T8s+, T9o, 98s, 87s, 76s, 65s',
    notes: "Don't over-tighten at 30-40bb. BB must risk a lot to pressure you.",
  },
  {
    id: 'utg-16bb-covered',
    label: 'UTG 16bb · Covered by most',
    position: 'UTG',
    stack: '16bb',
    cover: 'Covered by most',
    vpip: '~7%',
    range: '77+, AJs+, AQo+, AKs, KQs',
    notes: 'Extremely tight. Fold nines, AJo, KQo in some configs.',
  },
  {
    id: 'utg-29bb-covered',
    label: 'UTG 29bb · Covered by most',
    position: 'UTG',
    stack: '29bb',
    cover: 'Covered by most',
    vpip: '~9%',
    range: '66+, ATs+, AJo+, AQs+, AKo, KQs, KJs',
    notes: 'Very tight. Fold nines, AJo, KQo in some configs.',
  },

  // ---- BM3: Covering (You Cover) ----
  {
    id: 'btn-125bb-covering-2x',
    label: 'BTN 125bb · Covering 2x+ (deep BB)',
    position: 'BTN',
    stack: '125bb',
    cover: 'Covering 2x+',
    vpip: '~75%',
    range: '22+, A2s+, A2o+, K2s+, K5o+, Q2s+, Q7o+, J2s+, J7o+, T2s+, T7o+, 92s+, 97o+, 82s+, 87o, 72s+, 76o, 62s+, 65o, 52s+, 54o, 42s+, 43o, 32s',
    notes: 'Low suited connectors, low pairs, suited high-low all OK. More of everything.',
  },
  {
    id: 'btn-80bb-covering-close',
    label: 'BTN 80bb · Covering but close (73bb BB)',
    position: 'BTN',
    stack: '80bb',
    cover: 'Covering (close)',
    vpip: '~68%',
    range: '22+, A2s+, A2o+, K2s+, K7o+, Q4s+, Q8o+, J6s+, J8o+, T6s+, T8o+, 96s+, 98o, 86s+, 87o, 75s+, 76o, 64s+, 65o, 53s+, 54o, 43s',
    notes: 'Dial back — losing leaves you short (7bb).',
  },
  {
    id: 'utg-100bb-covering-2x',
    label: 'UTG 100bb · Covering 2x+ (45bb BB)',
    position: 'UTG',
    stack: '100bb',
    cover: 'Covering 2x+',
    vpip: '~35%',
    range: '22+, A2s+, A8o+, ATo+, K8s+, K9o+, KJo+, Q9s+, QJo+, J9s+, JTo, T9s, 98s, 87s, 76s, 65s',
    notes: '2x+ baseline. Like a 30bb CO open in chips.',
  },
  {
    id: 'utg-58bb-mixed',
    label: 'UTG 58bb · Cover most, covered by one',
    position: 'UTG',
    stack: '58bb',
    cover: 'Cover most, covered by one',
    vpip: '~25%',
    range: '33+, A4s+, A9o+, AJo+, K9s+, KJo+, QTs+, QJo+, JTs, T9s, 98s',
    notes: 'Wider than baseline; J8s/Q8s/T8s near zero but +EV if CO passive.',
  },
  {
    id: 'utg-65bb-covering-mid-bb',
    label: 'UTG 65bb · Covering (26bb BB)',
    position: 'UTG',
    stack: '65bb',
    cover: 'Covering healthily',
    vpip: '~38%',
    range: '22+, A2s+, A7o+, ATo+, K7s+, K9o+, Q8s+, QTo+, J8s+, JTo, T8s+, 98s, 87s, 76s, 65s, 54s',
    notes: 'Low suited connectors, sliver of 33s, marginal high-low suited.',
  },

  // ---- BM1: ICM vs ChipEV baselines ----
  {
    id: 'utg-30bb-icm',
    label: 'UTG 30bb · ICM equal stacks',
    position: 'UTG',
    stack: '30bb',
    cover: 'Equal stacks (ICM)',
    vpip: '~16%',
    range: '55+, A8s+, AJo+, ATo+, KQs, KJs, KJo, QJs, QJo, JTs',
    notes: 'Blocker-heavy. A2s opens where Q9s folds. Drop speculative, add Ace-X blockers.',
  },
  {
    id: 'btn-40bb-icm',
    label: 'BTN 40bb · ICM equal stacks',
    position: 'BTN',
    stack: '40bb',
    cover: 'Equal stacks (ICM)',
    vpip: '~35%',
    range: '33+, A2s+, A6o+, A9o+, K7s+, K9o+, Q8s+, Q9o+, J8s+, J9o+, T8s+, T9o, 98s, 87s, 76s, 65s, 54s',
    notes: 'Blocker-heavy. Cold-call strong (AQo, AJs, KQ). Shoves fade.',
  },
]

// Group ranges by BM page for easy lookup
export const rangesByPage: Record<string, string[]> = {
  bm1: ['utg-30bb-icm', 'btn-40bb-icm'],
  bm2: ['btn-12bb-covered-heaps', 'btn-12bb-covered-close', 'btn-33bb-covered', 'utg-16bb-covered', 'utg-29bb-covered'],
  bm3: ['btn-125bb-covering-2x', 'btn-80bb-covering-close', 'utg-100bb-covering-2x', 'utg-58bb-mixed', 'utg-65bb-covering-mid-bb'],
}

export function getRangesForPage(pageId: string): BubbleRange[] {
  const ids = rangesByPage[pageId] || []
  return ids.map(id => bubbleRanges.find(r => r.id === id)!).filter(Boolean)
}
