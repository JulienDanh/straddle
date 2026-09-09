// Standard NLH hand ranking (169 hand classes) from best to worst.
// Based on standard push/fold and preflop equity rankings.
// Used by SmartRange to generate the top N% of hands.

export const HAND_RANKING: string[] = [
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

// 169 total hand classes. Top N% = first N% of this list (rounded up).
export const TOTAL_HANDS = HAND_RANKING.length

export function topRange(pct: number): string[] {
  const count = Math.ceil((pct / 100) * TOTAL_HANDS)
  return HAND_RANKING.slice(0, count)
}

export function topRangeNotation(pct: number): string {
  return topRange(pct).join(', ')
}
