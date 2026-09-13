import { Children, isValidElement, useState, type ReactNode } from 'react'
import { Board } from './cards'
import { Action } from './primitives'
import type { BoardExampleProps } from './board-example'
import type { HandExampleProps } from './hand-example'

// ExampleBrowser — master-detail layout for a system's Examples tab.
// The children are the existing BoardExample / HandExample cards; their
// props are read to build the left-hand list (mini board + spot label +
// solved indicator) and only the selected card is rendered on the right.
// Collapses a wall of full grids into one overview list + one card.
//
// Usage:
//   <ExampleBrowser>
//     <BoardExample board="Kh8h3c" ... />
//     <HandExample spot="..." ... />
//   </ExampleBrowser>
//
// Items without a `board` (HandExample walkthroughs) show their action
// badge in place of the mini board. Items with a `solve` get a "Solved"
// tag; the rest read "Walkthrough".

type ItemProps = Partial<BoardExampleProps> & Partial<HandExampleProps>

export function ExampleBrowser({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(
    (c): c is React.ReactElement<ItemProps> =>
      isValidElement(c) && typeof (c.props as ItemProps).spot === 'string',
  )
  const [selected, setSelected] = useState(0)
  const current = Math.min(selected, items.length - 1)

  return (
    <div className="flex flex-col lg:flex-row gap-3 my-4">
      <nav className="lg:w-48 flex lg:flex-col gap-2 lg:shrink-0 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
        {items.map((item, i) => {
          const p = item.props
          const isSel = i === current
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex flex-col items-center gap-1.5 lg:items-stretch rounded-xl border px-2 py-2 text-left transition-colors shrink-0 ${
                isSel ? 'border-accent bg-panel2' : 'border-line bg-panel hover:bg-panel2'
              }`}
            >
              <span className="flex justify-center min-h-[46px] items-center">
                {p.board ? (
                  <Board cards={p.board} size="sm" />
                ) : (
                  <Action variant={p.actionVariant ?? 'check'}>{p.action}</Action>
                )}
              </span>
              <span className="flex items-center justify-between gap-1.5 min-w-0">
                <span className={`text-[10.5px] leading-tight line-clamp-2 ${isSel ? 'text-txt' : 'text-muted'}`}>
                  {p.spot}
                </span>
                <span
                  className={`text-[8.5px] font-bold uppercase tracking-wider shrink-0 ${
                    p.solve ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {p.solve ? 'Solved' : 'Walk'}
                </span>
              </span>
            </button>
          )
        })}
      </nav>
      <div className="min-w-0 flex-1">
        {items.length > 0 && items[current]}
      </div>
    </div>
  )
}
