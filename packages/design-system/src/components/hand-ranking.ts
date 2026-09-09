// Sklansky-Chubukov hand ranking (169 hand classes) from best to worst.
// Ordered by shove threshold (max bb to profitably open-shove SB vs BB).
// Source: https://www.primedope.com/sklansky-chubukov-rankings/
//
// Used by SmartRange to generate the top N% of hands.

export const HAND_RANKING: string[] = [
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

export const TOTAL_HANDS = HAND_RANKING.length

export function topRange(pct: number): string[] {
  const count = Math.ceil((pct / 100) * TOTAL_HANDS)
  return HAND_RANKING.slice(0, count)
}

export function topRangeNotation(pct: number): string {
  return topRange(pct).join(', ')
}
