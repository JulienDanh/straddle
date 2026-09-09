import type { ReactNode } from 'react'

export interface DataTableColumn {
  header: string
  width?: string
}

export interface DataTableProps {
  columns: DataTableColumn[]
  rows: ReactNode[][]
  compact?: boolean
}

export function DataTable({ columns, rows, compact = false }: DataTableProps) {
  const padding = compact ? 'px-2.5 py-1.5' : 'px-3 py-2'
  const fontSize = compact ? 'text-[12px]' : 'text-[13px]'

  return (
    <div className="overflow-x-auto my-3">
      <table className={`w-full border-collapse ${fontSize}`}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`border border-line bg-panel2 text-accent2 font-semibold text-left ${padding} whitespace-nowrap`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-panel2/40 transition-colors">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`border border-line align-top ${padding}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
