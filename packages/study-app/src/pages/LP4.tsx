import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const LP4_LEAKS: [ReactNode, ReactNode?][] = [
  ['Under-defending the stab', 'folding 35–40% vs 1bb turns the SB\u2019s bluffs into auto-profit — defend ~3 of 4 hands'],
  ['Memorizing hands instead of the framework', 'the fold set is built per-board from overcards/undercards'],
  ['Thin merged betting when checked to', 'small-betting TPWK and A-high walks into the SB\u2019s check-raising game'],
]

export function LP4Page() {
  return (
    <Section title="LP4 — BB Limped Pot Defense">
      <p>SB limped, hero in BB — either checked preflop or facing the SB's flop stab. The defense is a <em>solving for how to fold</em> exercise: facing the bread-and-butter 1bb stab into ~2.5bb, the BB must defend at least 71% (fold at most 28.6%) — and in practice folds less than 25%, because the SB's bluffs carry equity.</p>

      <Leak items={LP4_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Input vs a 1bb stab (Q86r)' }, { header: 'Verdict' }]}
        rows={[
          [
            <><strong>A · Overcard to the high card</strong></>,
            <>K5o — only A/K qualify (rare and valuable)</>,
            <><Action variant="call">Call</Action></>,
          ],
          [
            <><strong>B · Pair / two cards &gt; 6 / draw</strong></>,
            <>22, K9, 54o with the gutshot, any BDFD</>,
            <><Action variant="call">Call</Action> — the default, not the exception</>,
          ],
          [
            <><strong>C · Fails both tests</strong></>,
            <>J5o, T5o — one undercard to the low, one below the high, no BDFD</>,
            <><Action variant="fold">Fold</Action></>,
          ],
          [
            <><strong>D · Two undercards to the low</strong></>,
            <>53o, 43o below the 6, no draw</>,
            <><Action variant="fold">Pure fold</Action></>,
          ],
        ]}
      />

      <Callout variant="bad"><strong>"Ignore the ace and the deuce; fight over the middle cards."</strong> An ace on board makes every hand equally bad (leveling card); a deuce makes every hand equally good. The middle board cards create the splits that decide folds — build the fold set D first, then C, until the quota (~17–24% per board) is met; draws and BDFDs pull hands back out.</Callout>

      <Subhead>The never-fold rules</Subhead>
      <ul>
        <li>Never fold a pair — not 22. Never fold two cards bigger than a six. Almost never fold a BDFD.</li>
        <li>Draws are tiebreakers: a gutshot or BDFD saves hands that fail the overcard test (54o on Q86 continues via the gutshot).</li>
        <li>Raising is a small part: two pairs/sets raise most; bluff-raises are barely-profitable calls at best.</li>
      </ul>

      <Subhead>When the SB checks and you act</Subhead>
      <ul>
        <li>Bet polar: strongest hands disproportionately in the bigger size (50–66%+); bluffs are low-ranked hands <em>with draws</em> (94o, J5dd) — 87o bluffs better than 82o (live overcards + straight potential).</li>
        <li>Keep a robust condensed checking range — position lets you check a condensed range safely; the bigger the pair, the safer to check for pot control. Too many thin small bets leaves you exposed to check-raises.</li>
      </ul>

      <Callout><strong>Preflop sets the defense up.</strong> The BB's equilibrium response to a limp is a polarized raising range including junky offsuit hands at every depth (72o, T4o raise aggressively) — miss those raises and you see flops with too many weak hands, and the SB's small bets print. At 10bb, slow-play sets and two pairs vs stabs.</Callout>
    </Section>
  )
}

export default LP4Page
