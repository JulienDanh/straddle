import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Code } from '@poker/design-system/src/components/ui'

export const RS1_LEAKS: [ReactNode, ReactNode?][] = [
  ['Over-bluffing big bets, under-bluffing small ones', 'the bluff ratio is a function of size — pot-sized carries twice the bluff fraction of half-pot'],
  ['Betting the middle', 'second-tier hands are check/call hands, full stop'],
  ['Ignoring SPR in the ratio', 'at SPR 2–5 the per-street bet must be geometric, or the river jam arrives at the wrong multiple'],
]

export function RS1Page() {
  return (
    <Section title="RS1 — Symmetric Ranges by SPR">
      <p>Toy Game 1, the benchmark: both players arrive at the river with <strong>symmetric ranges</strong> — same shapes, same strength — so neither holds an equity or nut advantage. Every bet is exactly α-bluffs and every defense exactly MDF. Mastering the symmetric baseline tells you what deviations (position, condensation, traps) do in the later toy games.</p>

      <Leak items={RS1_LEAKS} />

      <DataTable
        columns={[{ header: 'Bet size (s = bet/pot)' }, { header: 'α (fold req.)' }, { header: 'MDF (call floor)' }, { header: 'Bluffs in bet range' }]}
        rows={[
          ['25% pot', '20%', '80%', '11%'],
          ['33% pot', '25%', '75%', '14%'],
          ['50% pot', '33%', '67%', '25%'],
          ['75% pot', '43%', '57%', '27%'],
          [<><strong>100% pot</strong></>, <><strong>50%</strong></>, <><strong>50%</strong></>, <><strong>33%</strong></>],
          ['150% pot', '60%', '40%', '43%'],
          ['200% pot', '67%', '33%', '50%'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">The arithmetic, cold: bluff share = <Code>s/(2s+1)</Code> of the betting range · defense = <Code>1/(1+s)</Code> · fold ceiling <Code>α = s/(1+s)</Code> — and <strong>α + MDF = 1, always</strong>: the attacker's fold-requirement and the defender's call-floor are two views of one number.</p>

      <Subhead>By SPR</Subhead>
      <DataTable
        compact
        columns={[{ header: 'SPR' }, { header: 'Geometric path' }, { header: 'Structure' }]}
        rows={[
          ['1', 'One pot-sized bet = all-in', 'Pure one-street clairvoyance game: α=50%, MDF=50%'],
          ['2', '~73% pot × 2', 'Multi-street: earlier bets must account for the jam behind'],
          ['5', '~82% pot × 3', 'Size choice interacts with polarization across streets'],
        ]}
      />

      <Callout variant="bad"><strong>Second-tier hands never bet.</strong> The middle of a symmetric range neither value-bets (only better calls) nor bluffs (betting folds out worse) — it checks and picks off bluffs. "Betting only chases away the Q that was already losing and only gets called by the A that was already beating it." The sharpest lesson of the symmetric game.</Callout>

      <Callout variant="good"><strong>The river forgives only one size — the geometric one.</strong> The river is the only truly polar street (100% or 0% equity), which is why the last-to-act player can bet several times pot with a single geometric size. Multi-street: keep earlier bets geometric so the final bet lands all-in, and the bluff ratio per street at pot-odds level so the <em>cumulative</em> ratio stays α-exact.</Callout>
    </Section>
  )
}

export default RS1Page
