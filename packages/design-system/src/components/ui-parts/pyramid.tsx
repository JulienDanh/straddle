import type { ReactNode } from 'react'
import { Action } from './primitives'

export interface PyramidTier {
  label: string
  action: ReactNode
  why: string
  variant: 'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn'
}

export function Pyramid({ tiers, highlight }: { tiers: PyramidTier[]; highlight?: number }) {
  // Render as a vertical stack, widest at bottom (like a pyramid)
  // tiers[0] = top (nuts), tiers[last] = bottom (trash)
  const n = tiers.length
  return (
    <div className="flex flex-col items-center gap-1 my-4">
      {tiers.map((tier, i) => {
        const width = 45 + (i * (55 / (n - 1))) // 45% to 100%
        const isHighlight = highlight === i
        const bg = tier.variant === 'bet' ? 'bg-[rgba(239,111,111,0.08)] border-bad'
          : tier.variant === 'check' ? 'bg-[rgba(95,208,168,0.08)] border-good'
          : tier.variant === 'fold' ? 'bg-[rgba(58,68,83,0.5)] border-line'
          : 'bg-panel2 border-line'
        return (
          <div
            key={i}
            className={`flex items-center justify-between gap-3 border rounded-lg px-4 py-2.5 transition-all ${bg} ${isHighlight ? 'ring-2 ring-accent2' : ''}`}
            style={{ width: `${width}%` }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[12px] font-bold text-txt whitespace-nowrap">{tier.label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Action variant={tier.variant}>{tier.action}</Action>
            </div>
            <span className="text-[11px] text-muted hidden sm:block truncate">{tier.why}</span>
          </div>
        )
      })}
    </div>
  )
}
