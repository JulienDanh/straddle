import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const LP5_LEAKS: [ReactNode, ReactNode?][] = [
  ['Iso-folding the middles', 'raising K9o/T8o "because they\u2019re ahead of a limp" then folding to a limp-shove'],
  ['Defending trash because "it\u2019s only a min-raise more"', 'the iso\u2019s junk end folds to pressure; your trash must too'],
  ['Playing the iso\u2019d pot like an SRP', 'the SPR is higher and the c-bet range wider — SRP defenses under-defend here'],
  ['Never trapping', 'a limper who only limp-calls lets the BB iso profitably with pure junk — trap density is the tax on isolation'],
]

export function LP5Page() {
  return (
    <Section title="LP5 — Playing vs the BB Isolation">
      <p>Hero limped from SB (or BTN); the BB raised over the limp. The BB's equilibrium iso range is <strong>polar: very strong hands and disposable junky offsuit</strong>, with the middling hands checked back — a structure that blunts the limp-reraise, because strong hands welcome action and junk folds cheaply to a shove.</p>

      <Leak items={LP5_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Hero hand vs the iso' }, { header: 'Defense' }]}
        rows={[
          [
            <><strong>A · Premium traps</strong></>,
            <>AA–JJ, AKs-type</>,
            <><Action variant="raise">Limp-reraise</Action> at 50bb+ · limp-shove at ≤20bb</>,
          ],
          [
            <><strong>B · Playable mediums</strong></>,
            <>Suited connectors, gappers, low pairs, Ax-suited</>,
            <><Action variant="call">Limp-call</Action> — realize equity, keep the iso\u2019s junk in</>,
          ],
          [
            <><strong>C · Blocker/offsuit middles</strong></>,
            <>K9o, Q9o, T8o</>,
            <><Action variant="call">Limp-call</Action> selectively deep / vs linear isos; raise-folding is dead money vs a polar iso</>,
          ],
          [
            <><strong>D · Trash</strong></>,
            <>The bottom of the limp range</>,
            <><Action variant="fold">Fold</Action> — the iso\u2019s fold equity is the price of limping wide</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>"Iso polar, defend polar — it or not-caring."</strong> The weak end of the iso range is designed to be disposable. And suited hands wait for 50bb: at 10–25bb, 76s/54s are conspicuously absent from iso ranges (they hate folding to a limp-shove); only when a limp-3bet is no longer all-in do suited connectors enter.</Callout>

      <Subhead>Postflop geometry of the iso'd pot</Subhead>
      <ul>
        <li>A limped-then-raised pot has a <strong>higher SPR</strong> than a single-raised pot at equal stacks — the raiser c-bets wider and smaller at 50bb+; counter by raising more often (deny equity to the bottom of the c-bet range) and calling with the playables.</li>
        <li>At ≤30bb: expect polarized ~67% c-bets and more check-backs — raise less, call more to realize.</li>
        <li>When YOU iso: vs a frequent c-bettor, BB check-raises low pairs more in limped pots than raised ones; avoid all-in check-raises at low SPR — smaller raises, wider calls.</li>
      </ul>

      <Subhead>Population read</Subhead>
      <p className="text-[13px] text-muted leading-snug">Solver baseline: polar (strong + junky offsuit; 72o is a baseline iso at 25bb, 76s checks). Population reality: many players iso <em>linearly</em> ("good hands only") — their checking range becomes weak, so punish by betting more limped flops (LP2/LP8).</p>

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Situation' }, { header: 'Size' }]}
        rows={[
          ['BB iso vs SB limp (25bb+)', '3–4bb'],
          ['Limp-reraise (50bb+)', '~3× the iso · jam under 25bb'],
          ['Postflop c-bet (50bb+)', '33–67% pot, wide range'],
          ['Postflop c-bet (≤30bb)', '~67% pot, polarized'],
        ]}
      />
    </Section>
  )
}

export default LP5Page
