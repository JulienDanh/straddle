import type { ReactNode } from 'react'
import { Card } from '@/components/ui-shadcn/card'
import { Tag } from './primitives'
import { Board, HoleCards } from './cards'

export interface HandExample {
  tag: string
  tagVariant: 'default' | 'risk' | 'call' | 'fold'
  board: string
  holeCards?: string
  desc: string
  verdict: 'agree' | 'mixed' | 'mistake'
  verdictText: string
  system: ReactNode
  solver: ReactNode
}

const VERDICT_STYLES: Record<string, string> = {
  agree: 'text-good bg-[rgba(95,208,168,0.12)] border-good',
  mixed: 'text-warn bg-[rgba(240,184,110,0.12)] border-warn',
  mistake: 'text-bad bg-[rgba(239,111,111,0.12)] border-bad',
}

export function HandExampleCard({ ex }: { ex: HandExample }) {
  return (
    <Card className="bg-panel2 border-line rounded-xl p-4 my-3 flex flex-col gap-3 transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Tag variant={ex.tagVariant}>{ex.tag}</Tag>
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap border ${VERDICT_STYLES[ex.verdict]}`}>{ex.verdictText}</span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Board cards={ex.board} size="sm" />
        {ex.holeCards && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted">hero:</span>
            <HoleCards cards={ex.holeCards} size="sm" />
          </div>
        )}
      </div>
      <div className="text-[11px] text-muted leading-tight">{ex.desc}</div>
      <div className="grid grid-cols-1 gap-2 pt-1 border-t border-line">
        <div className="flex gap-2 text-[13px]">
          <span className="text-accent2 font-bold whitespace-nowrap">System:</span>
          <span className="text-txt">{ex.system}</span>
        </div>
        <div className="flex gap-2 text-[13px]">
          <span className="text-muted font-bold whitespace-nowrap">Solver:</span>
          <span className="text-muted">{ex.solver}</span>
        </div>
      </div>
    </Card>
  )
}
