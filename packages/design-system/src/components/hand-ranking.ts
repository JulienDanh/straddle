// Hand rankings for SmartRange — two modes:
//
// 1. Sklansky-Chubukov (push/fold) — best for short-stack tournament spots.
//    Ordered by shove threshold (max bb to profitably open-shove SB vs BB).
//    Source: https://www.primedope.com/sklansky-chubukov-rankings/
//
// 2. Opening equity — best for deeper-stack RFI ranges. Pairs by rank,
//    then suited hands by high card + connectivity, then offsuit.
//    Reflects how solvers construct opening ranges (playability matters).
//
// Used by SmartRange to generate the top N% of hands.

// --- Sklansky-Chubukov ranking ---
const SC_RANKING: string[] = [
  // 50+ bb (ceiling)
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
  'AKo', 'AQo', 'AJo', 'ATo', 'KQo',
  'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
  // 49-40 bb
  '55', 'A9o', 'KJo', 'A8s', 'KQs', '44', 'A8o', 'A7s',
  // 39-30 bb
  'KJs', 'A5s', 'A7o', 'A6s', 'A4s', '33', 'KTo', 'KTs', 'A3s', 'A6o', 'A5o',
  // 29-20 bb
  'QJo', 'A2s', 'A4o', 'QJs', 'A3o', 'QTo', 'K9o', '22', 'K9s', 'A2o', 'QTs', 'K8s', 'K7s',
  // 19-10 bb
  'JTo', 'JTs', 'K8o', 'K6s', 'Q9s', 'Q9o', 'K5s', 'K7o', 'K4s', 'K6o', 'K3s', 'J9o', 'K2s', 'Q8s', 'K5o', 'Q8o', 'J9s', 'K4o', 'T9o', 'K3o', 'Q7s', 'T9s', 'Q6s', 'K2o', 'J8o', 'Q7o', 'J8s', 'Q5s', 'Q6o', 'Q4s',
  // 9-5 bb
  'T8o', 'Q5o', 'Q3s', 'J7o', 'T8s', 'J7s', 'Q4o', '98o', 'Q2s', 'Q3o', '98s', 'T7o', 'J6s', 'Q2o', 'J6o', 'T7s', '97o', 'J5s', 'J5o', '87o', 'J4s', 'T6o', 'J4o', '97s', 'J3s', 'T6s', 'J3o', '96o', 'J2o', '86o', 'J2s', '87s', '76o', 'T5o', 'T4o', '95o', 'T5s', '96s', '65o', 'T3o', '85o', '75o', '54o', 'T4s', 'T2o', '86s',
  // 4-1 bb
  '94o', '64o', 'T3s', '76s', '93o', '84o', '74o', '95s', '53o', '92o', '63o', '43o', 'T2s', '83o', '73o', '52o', '85s', '82o', '42o', '72o', '62o', '32o', '94s', '75s', '65s', '93s', '84s', '92s', '74s', '64s', '54s', '83s', '82s', '73s', '63s', '53s', '43s', '72s', '52s', '62s', '42s', '32s',
]

// --- Opening equity ranking ---
// Pairs by rank, then suited by high card + connectivity, then offsuit.
// This reflects how solvers build RFI ranges — playability matters at depth.
const OPEN_RANKING: string[] = [
  // Pairs (best to worst)
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
  // Suited aces
  'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
  // Suited kings
  'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
  // Suited queens
  'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s',
  // Suited jacks
  'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s',
  // Suited tens
  'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s',
  // Suited connectors/gappers
  '98s', '97s', '96s', '95s', '94s', '93s', '92s',
  '87s', '86s', '85s', '84s', '83s', '82s',
  '76s', '75s', '74s', '73s', '72s',
  '65s', '64s', '63s', '62s',
  '54s', '53s', '52s',
  '43s', '42s',
  '32s',
  // Offsuit aces
  'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
  // Offsuit kings
  'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o', 'K5o', 'K4o', 'K3o', 'K2o',
  // Offsuit queens
  'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o', 'Q6o', 'Q5o', 'Q4o', 'Q3o', 'Q2o',
  // Offsuit jacks
  'JTo', 'J9o', 'J8o', 'J7o', 'J6o', 'J5o', 'J4o', 'J3o', 'J2o',
  // Offsuit tens
  'T9o', 'T8o', 'T7o', 'T6o', 'T5o', 'T4o', 'T3o', 'T2o',
  // Offsuit connectors/gappers
  '98o', '97o', '96o', '95o', '94o', '93o', '92o',
  '87o', '86o', '85o', '84o', '83o', '82o',
  '76o', '75o', '74o', '73o', '72o',
  '65o', '64o', '63o', '62o',
  '54o', '53o', '52o',
  '43o', '42o',
  '32o',
]

export type RangeMode = 'push' | 'open'

const RANKINGS: Record<RangeMode, string[]> = {
  push: SC_RANKING,
  open: OPEN_RANKING,
}

export function getRanking(mode: RangeMode = 'open'): string[] {
  return RANKINGS[mode]
}

export const TOTAL_HANDS = 169

export function topRange(pct: number, mode: RangeMode = 'open'): string[] {
  const count = Math.ceil((pct / 100) * TOTAL_HANDS)
  return RANKINGS[mode].slice(0, count)
}

export function topRangeNotation(pct: number, mode: RangeMode = 'open'): string {
  return topRange(pct, mode).join(', ')
}
