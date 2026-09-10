import type { ReactNode } from 'react'
import { Action } from './primitives'

// HandExample — a single hand walkthrough with visual structure.
//
// Each example has a spot description (board/position/stack),
// a decision (rendered with an Action badge), and reasoning.
// The spot is the bold header. The decision is a colored badge.
// The reasoning is the body text.
//
// Usage:
//   <HandExample
//     spot="K83 two-tone (king-high, disconnected, 40bb)"
//     action="c-bet"
//     actionVariant="bet"
//   >
//     Solver agrees — 0% check. Player checked, costing EV.
//   </HandExample>

export interface HandExampleProps {
  /** The spot: board texture, position, stack depth */
  spot: string
  /** The action label (e.g. "C-bet 100%", "Check", "Check-raise") */
  action: ReactNode
  /** Action color variant */
  actionVariant?: 'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn'
  /** Reasoning — why this is the correct play */
  children: ReactNode
}

export function HandExample({
  spot,
  action,
  actionVariant = 'check',
  children,
}: HandExampleProps) {
  return (
    <div className="bg-panel2 border border-line rounded-lg px-4 py-3 my-2.5">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <span className="text-[13px] font-semibold text-txt leading-snug">{spot}</span>
        <span className="flex-shrink-0 mt-0.5">
          <Action variant={actionVariant}>{action}</Action>
        </span>
      </div>
      <p className="text-[12.5px] text-muted leading-snug">{children}</p>
    </div>
  )
}
