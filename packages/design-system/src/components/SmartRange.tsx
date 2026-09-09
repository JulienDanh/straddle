// SmartRange — badge that shows the top N% of hands by ranking.
//
// Props:
//   pct — percentage of hands (0-100), e.g. 18 means top 18% of hands
//   mode — 'push' (Sklansky-Chubukov, for short-stack) or 'open' (opening equity, for deeper stacks)
//   label — optional badge label override (defaults to "Range {pct}%")
//   color — hex color for included hands (default: accent blue)

import { useState, useRef, useEffect } from 'react'
import { RANKS, HAND_GRID } from './solutionParser'
import { topRange, type RangeMode } from './hand-ranking'

export interface SmartRangeProps {
  pct: number
  mode?: RangeMode
  label?: string
  color?: string
}

export function SmartRange({ pct, mode = 'open', label, color = '#6aa6ff' }: SmartRangeProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const handSet = new Set(topRange(pct, mode))

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <span ref={ref} className="relative inline-block">
      <button
        className="text-[11px] font-medium px-2 py-1 rounded-md border border-line bg-panel2 text-accent hover:bg-[#1d2738] cursor-pointer transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {label ?? `Range ${pct}%`}
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 p-3 rounded-[14px] border border-line bg-panel shadow-lg">
          <div className="text-xs text-muted mb-2">Top {pct}% &middot; {handSet.size} hands</div>
          <table className="rv-grid rv-grid-md">
            <thead><tr><th></th>{RANKS.map(r => <th key={r}>{r}</th>)}</tr></thead>
            <tbody>
              {HAND_GRID.map((rowCells: { hand: string }[], ri: number) => (
                <tr key={ri}>
                  <th className="rv-rowhead">{RANKS[ri]}</th>
                  {rowCells.map((cell: { hand: string }, ci: number) => {
                    const inRange = handSet.has(cell.hand)
                    return (
                      <td key={ci}
                        className={`rv-cell ${inRange ? 'in-range' : ''}`}
                        style={{ background: inRange ? color : undefined, color: inRange ? '#0c1117' : undefined, fontWeight: inRange ? 700 : 400 }}
                        title={`${cell.hand}: ${inRange ? 'in range' : 'fold'}`}
                      >
                        {cell.hand}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </span>
  )
}

export default SmartRange
