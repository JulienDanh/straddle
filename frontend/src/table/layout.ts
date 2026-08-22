// Fixed physical seat layout for an 8-seat ring.
//
// There are 8 fixed chairs around the oval. Index 0 is always the hero's
// seat (bottom-center); indices 1..7 run clockwise. We do NOT move hero —
// instead we rotate the *position labels* around the ring so hero's
// chosen position lands at index 0. The dealer button then sits at
// whichever index holds the BTN label.
//
// Clockwise order starting from the button (the real deal order):
//
//   BTN, SB, BB, UTG, UTG+1, MP, CO, UTG-1
//
// Preflop the first to act is UTG (the seat after BB). Postflop action
// starts at SB. The 8-seat ring adds UTG+1 and UTG-1 as extra early-position
// chairs that are empty in a 6-max hand.

/** Clockwise order starting from the button. */
export const CLOCKWISE_FROM_BTN = [
  'BTN',
  'SB',
  'BB',
  'UTG',
  'UTG+1',
  'MP',
  'CO',
  'UTG-1',
] as const

export const RING_SIZE = CLOCKWISE_FROM_BTN.length // 8

/**
 * The six positions the backend's strategy engine understands (state.py
 * Position enum: UTG, MP, CO, BTN, SB, BB). The 8-seat ring adds UTG+1 and
 * UTG-1 as extra early-position chairs that are empty in a 6-max hand.
 */
export const SIX_MAX_POSITIONS = new Set(['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'])

/**
 * Positions dealt in for a given player count, in clockwise order from BTN.
 * With fewer players, the earliest (farthest from the button) seats drop
 * out first — exactly how a short game is dealt.
 *
 *   2 -> BTN, BB            (heads-up: button posts SB, acts first preflop)
 *   3 -> BTN, SB, BB
 *   4 -> BTN, SB, BB, CO
 *   5 -> BTN, SB, BB, UTG, CO
 *   6 -> BTN, SB, BB, UTG, MP, CO
 */
export function activePositions(count: number): readonly string[] {
  // Order positions by distance from the button (closest first), so dropping
  // players removes the farthest seats. Clockwise from BTN already lists SB
  // and BB first; we want the button + the N-1 closest others.
  const ordered = ['BTN', 'BB', 'SB', 'CO', 'MP', 'UTG', 'UTG+1', 'UTG-1']
  return ordered.slice(0, Math.min(count, RING_SIZE))
}

/**
 * Given hero's position, return the 8 position labels in physical seat order
 * (index 0 = hero). Hero's position lands at index 0; the rest follow
 * clockwise.
 *
 * Examples (hero at index 0):
 *   hero=BTN -> [BTN, SB, BB, UTG, UTG+1, MP, CO, UTG-1]
 *   hero=BB   -> [BB, UTG, UTG+1, MP, CO, UTG-1, BTN, SB]
 *   hero=UTG  -> [UTG, UTG+1, MP, CO, UTG-1, BTN, SB, BB]
 */
export function ringLabels(heroPosition: string): readonly string[] {
  const start = CLOCKWISE_FROM_BTN.indexOf(heroPosition as (typeof CLOCKWISE_FROM_BTN)[number])
  const offset = start === -1 ? 0 : start
  const labels: string[] = []
  for (let i = 0; i < RING_SIZE; i++) {
    labels.push(CLOCKWISE_FROM_BTN[(offset + i) % RING_SIZE])
  }
  return labels
}

/** Index of the dealer button in a ring with the given hero position. */
export function dealerIndex(heroPosition: string): number {
  return ringLabels(heroPosition).indexOf('BTN')
}
