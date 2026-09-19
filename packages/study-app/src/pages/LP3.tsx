import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const LP3_LEAKS: [ReactNode, ReactNode?][] = [
  ['Reflex bluff-or-fold', '"no pair = must bluff or fold" forces the 25–50% equity middle into the wrong line — check-call'],
  ['Calling with unrealizable equity', 'A3hh-type hands are pure folds despite ~45% equity — the number looks sufficient, realization isn\u2019t'],
  ['Reading checks as weakness', 'both your own and the BB\u2019s — checked-back flops mean modest hands on both sides'],
]

export function LP3Page() {
  return (
    <Section title="LP3 — SB Flop Checks and Hand Valuation">
      <p>SB limped and either checked the flop or is continuing after checking. The most misunderstood fact about limped pots: <strong>the SB's checks are not trash</strong>. With both ranges wide and weak, King-high and even Queen-high are strong enough to check and call a small bet — valuing unpaired hands by rank and realization, rather than reflexively bluff-or-folding, is the core skill.</p>

      <Leak items={LP3_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Hand class' }, { header: 'Equity' }, { header: 'Line' }]}
        rows={[
          [
            <><strong>A · Modest pairs / strong draws</strong></>,
            <>Middle pair+, FD/OESD</>,
            <>50%+</>,
            <><Action variant="check">Check-call</Action> or check-raise small — the value core</>,
          ],
          [
            <><strong>B · High unpaired + backdoors</strong></>,
            <>K-high/Q-high with BDFD + BD straight</>,
            <>25–50%</>,
            <><Action variant="call">Check-call small</Action>; realize equity</>,
          ],
          [
            <><strong>C · Middling unpaired, poor outs</strong></>,
            <>A3hh-type on 762tt</>,
            <><>~40–45% raw, <strong>low realization</strong></></>,
            <><Action variant="fold">Check, fold to a bet</Action> — the hardest bucket</>,
          ],
          [
            <><strong>D · Trash</strong></>,
            <>No pair, no clean outs, low rank</>,
            <>&lt;25%</>,
            <><Action variant="fold">Check-fold</Action> — river bluffs only on favorable boards (LP7)</>,
          ],
        ]}
      />

      <Callout variant="bad"><strong>"Likely ahead is a reason not to bet."</strong> A3hh on 762tt has ~45% equity yet is a pure check-fold to a bet — and that's not giving up: the BB checks back more than half the time at equilibrium, so checked hands retain value. Being likely ahead means betting mostly folds out worse and keeps in better.</Callout>

      <Subhead>The two tests for unpaired hands</Subhead>
      <ul>
        <li><strong>Rank first:</strong> two live overcards &gt; one high card + one brick &gt; undercards. Ask "if I pair this card, is it top pair or third pair?"</li>
        <li><strong>Realization second:</strong> clean outs (overcards to a middling board, backdoors to the nuts) realize; dirty outs (an Ace that also completes the flush, the low end of straights) don't — dirty-improvement hands fall from B to C.</li>
      </ul>

      <Subhead>Facing a bet after checking</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Situation' }, { header: 'Rule' }]}
        rows={[
          ['A vs serial stabber', 'Check-raise 3–4× their bet, or jam under 12bb'],
          ['B vs 33% stab', 'Call — defend ~67–70%+ of the checking range'],
          ['B/C vs overbet', 'Fold — overbets attack exactly these buckets'],
          ['C/D vs any bet', 'Fold — never call "because it\u2019s cheap"; realization is the tax'],
        ]}
      />

      <Callout><strong>The flop-favored player keeps the advantage.</strong> When the flop checks through, the player favored on that flop usually retains their edge on turn and river — SB bluffs stay profitable on AJ6-type runouts and stay indifferent (unprofitable) on 762-type ones. Restart the turn with LP6 logic.</Callout>
    </Section>
  )
}

export default LP3Page
