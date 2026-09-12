import { useState } from 'react'
import { RangeGrid } from './RangeGrid'
import type { StoredRange } from '../data/ranges'

// RangeBrowser — renders StoredRange data as a chart panel, for one stack
// or many.
//
// Takes a group of StoredRange instances (same spot, different stacks) and
// renders a bordered panel: a header strip with the spot name on the left
// and a stack selector on the right, with the range grid inside. With a
// single range the selector is hidden — same panel, nothing to switch.
// Pass the grouped constants from data/ranges.ts.
//
// Usage:
//   <RangeBrowser ranges={UTG_RFI_CEV} />
//   <RangeBrowser ranges={[SOME_SINGLE_RANGE]} />

export interface RangeBrowserProps {
  ranges: StoredRange[]
  /** Stack (bb) selected initially; defaults to the deepest stack */
  defaultStack?: number
}

export function RangeBrowser({ ranges, defaultStack }: RangeBrowserProps) {
  const stacks = [...new Set(ranges.map(r => r.stack))].sort((a, b) => b - a)
  const [stack, setStack] = useState(defaultStack ?? stacks[0])
  const current = ranges.find(r => r.stack === stack) ?? ranges[0]
  const maxStack = stacks[0]

  return (
    <div className="my-4 rounded-xl border border-line bg-panel overflow-hidden w-fit mx-auto">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-panel2 border-b border-line flex-wrap">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-base font-bold text-txt truncate">{current.title} · {current.stack}bb</span>
          <span className="text-sm text-muted whitespace-nowrap">{current.subtitle}</span>
        </div>
        {stacks.length > 1 && (
          <div className="flex gap-0.5 bg-dark rounded-md p-1 border border-line/50">
            {stacks.map(s => {
              const active = stack === s
              return (
                <button
                  key={s}
                  onClick={() => setStack(s)}
                  className={`flex flex-col items-center gap-1 px-2 pt-0.5 pb-1 rounded-[5px] cursor-pointer transition-colors tabular-nums ${
                    active ? 'bg-accent text-[#0c1117]' : 'text-txt/80 hover:text-txt hover:bg-panel/60'
                  }`}
                >
                  <span className="text-[11px] font-semibold leading-none">{s}bb</span>
                  {/* depth gauge: fill is proportional to the stack depth */}
                  <span className={`w-full h-[2px] rounded-full overflow-hidden ${active ? 'bg-[#0c1117]/25' : 'bg-line'}`}>
                    <span
                      className={`block h-full rounded-full transition-colors ${active ? 'bg-[#0c1117]' : 'bg-muted/80'}`}
                      style={{ width: `${Math.round((s / maxStack) * 100)}%` }}
                    />
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
      <div className="p-3.5">
        <RangeGrid {...current.actions} sizings={current.sizings} />
      </div>
    </div>
  )
}

export default RangeBrowser
