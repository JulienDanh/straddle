// Hand notation parser — expands poker shorthand to individual hand classes.
// Supports: pairs (55+), suited (A2s+), offsuit (K9o+), specific (A2s, K5o, 55).
//
// "A2s+" means A2s, A3s, ..., AKs (all suited aces with rank >= 2)
// "55+" means 55, 66, 77, 88, 99, TT, JJ, QQ, KK, AA
// "T9s" means just T9s

const RANK_ORDER = 'AKQJT98765432'

function rankIdx(r: string): number { return RANK_ORDER.indexOf(r) }

// Expand "A2s+" → ["A2s","A3s","A4s","A5s","A6s","A7s","A8s","A9s","ATs","AJs","AQs","AKs"]
function expandSuitedPlus(hi: string, lo: string): string[] {
  const result: string[] = []
  for (let i = rankIdx(lo); i >= rankIdx(hi); i--) {
    // i goes from lo's index toward A's index (decreasing = higher rank)
    result.push(`${hi}${RANK_ORDER[i]}s`)
  }
  // Also include the kicker's rank going up to the high card
  // Actually: A2s+ means A2s through AKs, so we go from lo up to the card below hi
  // rankIdx(lo) is the starting point, we go UP in rank (toward A = index 0)
  return result
}

// Expand "55+" → ["55","66","77","88","99","TT","JJ","QQ","KK","AA"]
function expandPairPlus(lo: string): string[] {
  const result: string[] = []
  for (let i = rankIdx(lo); i >= 0; i--) {
    result.push(`${RANK_ORDER[i]}${RANK_ORDER[i]}`)
  }
  return result
}

// Expand "A9o+" → A9o, ATo, AJo, AQo, AKo
function expandOffsuitPlus(hi: string, lo: string): string[] {
  const result: string[] = []
  for (let i = rankIdx(lo); i > 0; i--) {
    if (RANK_ORDER[i] === hi) continue
    result.push(`${hi}${RANK_ORDER[i]}o`)
  }
  return result
}

// Parse a single token like "A2s+", "55+", "K9o", "A2s"
export function parseHandToken(token: string): string[] {
  token = token.trim()
  if (!token) return []

  // Pair with +: "55+"
  if (token.length === 3 && token[0] === token[1] && token[2] === '+') {
    return expandPairPlus(token[0])
  }
  // Pair exact: "55"
  if (token.length === 2 && token[0] === token[1]) {
    return [token]
  }
  // Suited with +: "A2s+"
  if (token.length === 4 && token[3] === '+' && token[2] === 's') {
    return expandSuitedPlus(token[0], token[1])
  }
  // Offsuit with +: "A9o+"
  if (token.length === 4 && token[3] === '+' && token[2] === 'o') {
    return expandOffsuitPlus(token[0], token[1])
  }
  // Suited exact: "A2s"
  if (token.length === 3 && token[2] === 's') {
    return [token]
  }
  // Offsuit exact: "K9o"
  if (token.length === 3 && token[2] === 'o') {
    return [token]
  }
  return [token]
}

// Parse a comma-separated list of hand tokens
export function parseRange(notation: string): string[] {
  const tokens = notation.split(',').map(t => t.trim()).filter(Boolean)
  const hands = new Set<string>()
  for (const t of tokens) {
    for (const h of parseHandToken(t)) {
      hands.add(h)
    }
  }
  return Array.from(hands)
}
