import type { ReactNode } from 'react'

export interface StackCell {
  content: ReactNode
  variant?: 'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn' | 'default'
}

export interface StackMatrixProps {
  rows: { label: string; cells: StackCell[] }[]
  colLabels: string[]
  rowAxisLabel?: string
  colAxisLabel?: string
}

export function StackMatrix({ rows, colLabels, rowAxisLabel, colAxisLabel }: StackMatrixProps) {
  const cellBg: Record<string, string> = {
    fold: 'bg-[rgba(239,111,111,0.06)] border-bad/30',
    call: 'bg-[rgba(106,166,255,0.06)] border-accent2/30',
    bet: 'bg-[rgba(95,208,168,0.06)] border-good/30',
    raise: 'bg-[rgba(239,111,111,0.06)] border-bad/30',
    allIn: 'bg-[rgba(200,56,56,0.08)] border-bad/40',
    check: 'bg-[rgba(95,208,168,0.06)] border-good/30',
    default: 'bg-panel2 border-line',
  }

  return (
    <div className="my-4">
      {colAxisLabel && <div className="text-[11px] text-muted text-center mb-1.5 font-semibold">{colAxisLabel}</div>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px] min-w-[400px]">
          <thead>
            <tr>
              {rowAxisLabel && <th className="border border-line bg-panel2 px-3 py-2 text-left text-muted">{rowAxisLabel}</th>}
            </tr>
            <tr>
              {rowAxisLabel && <th className="border border-line bg-panel2"></th>}
              {colLabels.map((label, i) => (
                <th key={i} className="border border-line bg-panel2 px-3 py-2 text-center text-accent2 font-semibold whitespace-nowrap">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="border border-line bg-panel2 px-3 py-2 font-semibold text-txt whitespace-nowrap">{row.label}</td>
                {row.cells.map((cell, j) => {
                  const v = cell.variant || 'default'
                  return (
                    <td key={j} className={`border px-3 py-2.5 align-top ${cellBg[v]}`}>
                      {cell.content}
                    </td>
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
