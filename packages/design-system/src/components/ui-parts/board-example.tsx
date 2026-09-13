import type { ReactNode } from 'react'
import { Action } from './primitives'
import { ActionTrail } from './action-trail'
import { RangeGrid, actionShares } from '../RangeGrid'
import type { RangeAction, SolvedFlop } from '../../data/ranges/types'

// BoardExample — a walkthrough example connected to its solved postflop
// strategy, stacked: the EXAMPLE header on top (spot, context,
// SYSTEM action badge, reasoning) and, when the spot has been solved, the
// SOLUTION section below at full card width (GTO shares of the parent open
// computed from the stored range — never hardcoded — the GTO Wizard link,
// and the full strategy grid weighted by the open (base) so legend shares
// read "of range"; the grid itself is the solver's description — no prose
// restating its numbers).
// The board is NOT rendered here —
// ExampleBrowser shows it in its selector strip; the `board` prop exists
// for the browser to read.
//
// Usage:
//   <BoardExample
//     board="Kh8h3c"
//     spot="K83 two-tone (king-high, disconnected, 40bb)"
//     action="C-bet 100%"
//     actionVariant="bet"
//     takeaway="100% c-bet at 20% pot — the solver bets the entire open."
//     solve={S1_FLOP_K83}
//   >
//     Solver agrees — at 20% pot it c-bets the whole range.
//   </BoardExample>
//
// Omit `solve` for a walkthrough-only board (plain HandExample also fits
// when there is no board to render).

export interface BoardExampleProps {
  /** Board cards, e.g. "Kh8h3c" — shown by ExampleBrowser's list, not rendered in the card */
  board: string
  /** The spot: board texture, position, stack depth */
  spot: string
  /** The action label (e.g. "C-bet 100%", "Mix") */
  action: ReactNode
  /** Action color variant */
  actionVariant?: 'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn'
  /** Solved postflop strategy (SolvedFlop from a range loader); omit for walkthrough-only boards */
  solve?: SolvedFlop
  /** Reasoning — why this is the correct play */
  children: ReactNode
}

export function BoardExample({
  spot,
  action,
  actionVariant = 'check',
  solve,
  children,
}: BoardExampleProps) {
  const range = solve?.range
  const shares = range ? actionShares(range.actions, solve!.base) : {}
  // badge order: the decision's actions, fold-first for defends, bet-first
  // for aggressor nodes
  const badges: RangeAction[] = ['fold', 'call', 'raise', 'allIn', 'bet', 'check']
  const badgeLabel: Record<RangeAction, string> = {
    fold: 'Fold', call: 'Call', raise: 'Raise', allIn: 'All-in', bet: 'Bet', check: 'Check',
  }

  return (
    <div className="my-4 rounded-xl border border-line bg-panel overflow-hidden flex flex-col">
      <div className="px-4 py-2.5 bg-panel2 border-b border-line">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="text-[13px] font-semibold text-txt leading-snug">{spot}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">System</span>
            <Action variant={actionVariant}>{action}</Action>
          </div>
        </div>
        {solve && <ActionTrail steps={solve.trail} />}
        <p className="mt-1.5 text-[12.5px] text-muted leading-snug">{children}</p>
      </div>
      {solve && (
        <div className="min-w-0">
          <div className="px-4 py-2.5 border-b border-line flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted shrink-0">GTO</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {badges.filter((a) => shares[a] !== undefined).map((a) => (
                <Action key={a} variant={a}>{badgeLabel[a]} {(shares[a] as number).toFixed(1)}%</Action>
              ))}
            </div>
            {range!.wizardUrl && (
              <a
                href={range!.wizardUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold uppercase tracking-wider hover:underline shrink-0"
                style={{ color: 'var(--accent)' }}
              >
                GTO Wizard
              </a>
            )}
          </div>
          <div className="p-3.5">
            <RangeGrid {...range!.actions} sizings={range!.sizings} base={solve.base} />
          </div>
        </div>
      )}
    </div>
  )
}
