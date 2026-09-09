// RangePreview — simplified 13x13 hand grid for course content.
// Shows hands as included/excluded (binary), not frequencies.
// Uses the same grid layout as RangeGrid but with a single color.
//
// Props:
//   title — label for the range
//   range — poker notation string (e.g. "A2s+, A9o+, K5s+, 55+, 76s")
//   color — hex color for included hands (default: accent blue)

import { RANKS, HAND_GRID } from '../pages/solutionParser'
import { parseRange } from './hand-notation'

export interface RangePreviewProps {
  title?: string
  range: string
  color?: string
}

export function RangePreview({ title, range, color = '#6aa6ff' }: RangePreviewProps) {
  const handSet = new Set(parseRange(range))

  return (
    <div className="inline-block">
      {title && <div className="text-xs text-muted mb-1.5 font-medium">{title}</div>}
      <div className="rv-grid-wrap rv-compact">
        <table className="rv-grid rv-grid-sm">
          <thead><tr><th></th>{RANKS.map(r => <th key={r}>{r}</th>)}</tr></thead>
          <tbody>
            {HAND_GRID.map((rowCells, ri) => (
              <tr key={ri}>
                <th className="rv-rowhead">{RANKS[ri]}</th>
                {rowCells.map((cell, ci) => {
                  const inRange = handSet.has(cell.hand)
                  return (
                    <td key={ci}
                      className={`rv-cell ${inRange ? 'in-range' : ''}`}
                      style={{ background: inRange ? color : undefined }}
                      title={`${cell.hand}: ${inRange ? 'in range' : 'fold'}`}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RangePreview
