import type { ReactNode } from 'react'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="my-6">
      <h2 className="text-[24px] font-bold text-txt border-l-[3px] border-accent pl-3 leading-tight">{title}</h2>
      <div className="mt-5 section-content">{children}</div>
    </div>
  )
}

export function Callout({ variant = 'default', children }: { variant?: 'default' | 'warn' | 'bad' | 'good'; children: ReactNode }) {
  const borderColors: Record<string, string> = {
    default: 'border-accent2',
    warn: 'border-warn',
    bad: 'border-bad',
    good: 'border-good',
  }
  return <div className={`bg-panel2 border-l-[3px] ${borderColors[variant]} px-4 py-3 rounded-lg my-3.5`}>{children}</div>
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

export function Subhead({ children }: { children: ReactNode }) {
  return <h3 className="text-[15px] font-bold text-txt border-l-[3px] border-accent2 pl-2.5 mt-7 mb-1 leading-tight">{children}</h3>
}
