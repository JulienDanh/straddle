import type { ReactNode } from 'react'

export function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div>
      {title && (
        <h2 className="text-[19px] font-bold text-txt border-l-[3px] border-accent pl-2.5 leading-tight">{title}</h2>
      )}
      <div className="mt-2.5 section-content">{children}</div>
    </div>
  )
}

export function Callout({ variant = 'default', className = '', children }: { variant?: 'default' | 'warn' | 'bad' | 'good'; className?: string; children: ReactNode }) {
  const borderColors: Record<string, string> = {
    default: 'border-accent2',
    warn: 'border-warn',
    bad: 'border-bad',
    good: 'border-good',
  }
  return <div className={`bg-panel2 border-l-[3px] ${borderColors[variant]} px-3.5 py-2.5 rounded-lg my-3 ${className}`}>{children}</div>
}

export function Tag({ variant = 'default', children }: { variant?: 'default' | 'risk' | 'call' | 'fold'; children: ReactNode }) {
  const styles: Record<string, string> = {
    default: 'text-good border-good',
    risk: 'text-warn border-warn',
    call: 'text-accent2 border-accent2',
    fold: 'text-bad border-bad',
  }
  return <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full border mr-1.5 ${styles[variant]}`}>{children}</span>
}

export function Action({ variant = 'fold', children }: { variant?: 'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'; children: ReactNode }) {
  const styles: Record<string, string> = {
    fold: 'bg-[#2f2f4a] text-muted',
    call: 'bg-accent text-dark',
    raise: 'bg-[#ff5470] text-dark',
    allIn: 'bg-[#b44cff] text-white',
    check: 'bg-[#39ff88] text-dark',
    bet: 'bg-[#ff5470] text-dark',
  }
  return <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap align-middle ${styles[variant]}`}>{children}</span>
}

export function Small({ children }: { children: ReactNode }) {
  return <span className="text-xs text-muted">{children}</span>
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="bg-dark border border-line px-1.5 py-0.5 rounded text-[13px]">{children}</code>
}

export function Subhead({ className = '', children }: { className?: string; children: ReactNode }) {
  return <h3 className={`text-[15px] font-bold text-txt border-l-[3px] border-accent2 pl-2.5 mt-4 mb-1.5 leading-tight ${className}`}>{children}</h3>
}

// Leak — the "most players do X, should do Y" panel: red accent (the
// mistake), one row per leak with the correction in green after an arrow.
// Distinct from Callout (insight) — this is the error the system corrects.
export function Leak({ title = 'Common leaks', items }: { title?: string; items: [ReactNode, ReactNode?][] }) {
  return (
    <div className="bg-panel2 border-l-[3px] border-bad px-3.5 py-2.5 rounded-lg my-3">
      <span className="text-[10px] font-bold uppercase tracking-wider text-bad">{title}</span>
      <ul className="mt-1 flex flex-col gap-1">
        {items.map(([leak, fix], i) => (
          <li key={i} className="text-[12.5px] leading-snug text-txt">
            {leak}
            {fix && <span className="text-good"> → {fix}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
