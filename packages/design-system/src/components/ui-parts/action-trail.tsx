import type { TrailStep } from '../../data/ranges/types'
import { Action } from './primitives'

// ActionTrail — the preflop line that led to a solved node, as chips:
// a tiny position label above each colored Action badge and muted arrows
// between steps. The data comes from the line's trail (LineContext.trail
// in data/ranges/types.ts) — one step per action: { pos, act, variant }.

export function ActionTrail({ steps }: { steps: TrailStep[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mt-2">
      {steps.map((s, i) => (
        <span key={i} className="flex items-center gap-x-2">
          {i > 0 && <span className="text-muted/50 text-[11px]">→</span>}
          <span className="flex items-center gap-1">
            {s.pos && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{s.pos}</span>
            )}
            <Action variant={s.variant}>{s.act}</Action>
          </span>
        </span>
      ))}
    </div>
  )
}
