import { Fragment, useState } from 'react'
import { RangeGrid } from './RangeGrid'
import { materializeChild } from '../data/ranges'
import type { StoredRange } from '../data/ranges'

// RangeBrowser — renders StoredRange data as a chart panel, for one stack
// or many.
//
// Takes a group of StoredRange instances (same spot, different stacks) and
// renders a bordered panel: a header strip with the spot name on the left
// and a stack selector on the right, with the range grid inside. With a
// single range the selector is hidden — same panel, nothing to switch.
// Entries carrying `postflop` children (e.g. the 40bb UTG RFI's c-bet
// boards) get a board selector under the header: the preflop open plus one
// pill per solved flop, swapping the grid to that child's strategy.
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

const pillClass = (active: boolean) =>
  `px-2.5 py-1 rounded-[5px] text-[11px] font-semibold transition-colors ${
    active ? 'bg-accent text-[#0c1117]' : 'text-txt/80 hover:text-txt hover:bg-panel/60'
  }`

export function RangeBrowser({ ranges, defaultStack }: RangeBrowserProps) {
  const stacks = [...new Set(ranges.map(r => r.stack))].sort((a, b) => b - a)
  const [stack, setStack] = useState(defaultStack ?? stacks[0])
  const [board, setBoard] = useState<string | null>(null)
  const current = ranges.find(r => r.stack === stack) ?? ranges[0]
  const maxStack = stacks[0]
  const boards = current.postflop ?? []
  // postflop children are raw (minimal fields + open-weighted paste) —
  // materializeChild injects the parent context and converts on display
  const child = boards.find(b => b.id === board)
  const shown = child ? materializeChild(current, child) : current

  // group the postflop boards by the line that produced them (line field)
  const boardGroups: { line: string | null; boards: typeof boards }[] = []
  for (const b of boards) {
    const line = b.line ?? null
    const group = boardGroups.find(g => g.line === line)
    if (group) group.boards.push(b)
    else boardGroups.push({ line, boards: [b] })
  }

  return (
    // Fixed width so the panel never resizes between views: must fit the grid
    // (14 cols x 46px cells + gutters + padding, ~689px) on one line with the
    // header text and the stack selector side by side (~730px).
    <div className="my-4 rounded-xl border border-line bg-panel overflow-hidden w-[730px] max-w-full mx-auto">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-panel2 border-b border-line">
        <div className="flex items-baseline gap-2 min-w-0 flex-1">
          <span className="text-base font-bold text-txt truncate">{current.title} · {current.stack}bb</span>
          <span className="text-sm text-muted truncate">{shown.subtitle}</span>
          {shown.wizardUrl && (
            <a
              href={shown.wizardUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold uppercase tracking-wider text-accent hover:underline shrink-0"
            >
              GTO Wizard
            </a>
          )}
        </div>
        {stacks.length > 1 && (
          <div className="flex gap-0.5 bg-dark rounded-md p-1 border border-line/50 shrink-0">
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
      {boards.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-panel2 border-b border-line flex-wrap">
          <div className="flex gap-0.5 bg-dark rounded-md p-1 border border-line/50">
            <button onClick={() => setBoard(null)} className={pillClass(board === null)}>
              Open
            </button>
          </div>
          {boardGroups.map(group => (
            <Fragment key={group.line ?? 'default'}>
              {group.line && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted ml-1">
                  {group.line}
                </span>
              )}
              <div className="flex gap-0.5 bg-dark rounded-md p-1 border border-line/50">
                {group.boards.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBoard(b.id!)}
                    className={pillClass(board === b.id)}
                  >
                    {b.label ?? b.id}
                  </button>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      )}
      <div className="p-3.5">
        <RangeGrid
          {...shown.actions}
          sizings={shown.sizings}
          base={shown !== current ? Object.values(current.actions).join(',') : undefined}
        />
      </div>
    </div>
  )
}

export default RangeBrowser
