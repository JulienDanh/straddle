import type { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui-shadcn/card'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="bg-panel border-line rounded-[14px] p-[22px] my-4 shadow-lg gap-0">
      <CardHeader className="p-0 pb-3.5">
        <CardTitle className="text-xl border-l-[3px] border-accent pl-2.5">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
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
    fold: 'bg-[#3a4453] text-muted',
    call: 'bg-[#6aa6ff] text-[#0c1117]',
    raise: 'bg-[#ef6f6f] text-[#0c1117]',
    allIn: 'bg-[#c83838] text-white',
    check: 'bg-[#5fd0a8] text-[#0c1117]',
    bet: 'bg-[#ef6f6f] text-[#0c1117]',
  }
  return <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap align-middle ${styles[variant]}`}>{children}</span>
}

export function Small({ children }: { children: ReactNode }) {
  return <span className="text-xs text-muted">{children}</span>
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="bg-dark border border-line px-1.5 py-0.5 rounded text-[13px]">{children}</code>
}
