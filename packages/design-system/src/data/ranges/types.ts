// Stored range types and helpers shared by all solution groups.

export type RangeAction = 'fold' | 'call' | 'raise' | 'allIn' | 'check'

export interface StoredRange {
  /** Spot label, e.g. "UTG RFI" */
  title: string
  /** Solution category, e.g. "ChipEV" or "ICM 83% left" */
  subtitle: string
  /** Effective stack in bb */
  stack: number
  /** Hero position, e.g. "UTG" */
  position: string
  /** Per-action combo:freq strings; omit actions that don't apply */
  actions: Partial<Record<RangeAction, string>>
  /** Bet/raise sizes in bb per action, shown in the grid legend (e.g. raise: 2.2) */
  sizings?: Partial<Record<RangeAction, number>>
}

/** Pick a single stack depth out of a group (e.g. for single-range display) */
export function byStack(ranges: StoredRange[], stack: number): StoredRange {
  return ranges.find(r => r.stack === stack) ?? ranges[0]
}
