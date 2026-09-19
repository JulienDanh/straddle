import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const MW10_LEAKS: [ReactNode, ReactNode?][] = [
  ['Checking back the thin value', 'the capped field\u2019s stubborn calls are the softest money on the river'],
  ['Bluffing unblocked air', 'two calling ranges cover too much — only blocker-assisted bluffs clear the bar'],
  ['Jamming medium strength for "protection"', 'no protection on the river — big bets with thin hands isolate against the continue region'],
  ['One-size-fits-big', 'size follows the bucket: nut region big, thin value small-merged'],
]

export function MW10Page() {
  return (
    <Section title="MW10 — Missed River Bets as IP">
      <p>Everyone checked to you on the river and you're last — the seat every previous system was walking toward: full information on the passive line, two capped ranges waiting, the clock unambiguously yours. The core skill: bet merged and honest. The field's checked-down ranges are weak, but they still call with <em>some</em> hands — and only your blockers decide which.</p>

      <Leak items={MW10_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Hand class' }, { header: 'Action / size' }]}
        rows={[
          [
            <><strong>A · Nut region</strong></>,
            <>Two pair+, TPGK on dead boards</>,
            <><Action variant="bet">Bet always — 66–100%</Action> (the window)</>,
          ],
          [
            <><strong>B · Thin value</strong></>,
            <>Second pair, TPWK vs a passive line</>,
            <><Action variant="bet">Bet 33–50%</Action> — the stubborn calls, not folds</>,
          ],
          [
            <><strong>C · Blocker bluffs</strong></>,
            <>Missed nut draws, board cards, flush-completion card</>,
            <><Action variant="bet">Bet</Action> — same size as value (merged)</>,
          ],
          [
            <><strong>D · Confused middle / naked air</strong></>,
            <>Weak pairs, unblocked missed draws</>,
            <><Action variant="check">Check</Action> — showdown or surrender</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>Last action is the biggest lever.</strong> Nut advantage + firing order + SPR — on the river you always hold the firing-order lever; when the runout also gave you the nut lever, 75%+ is the EV-max line. Live and ICM-sensitive pools under-defend large multiway bets: <strong>value wider, bluff narrower</strong> — one size up from every row.</Callout>

      <Subhead>Price the field's weakness</Subhead>
      <ul>
        <li>Count the passive history: against two <strong>full check-downs</strong>, second pair is a value bet (Bucket B); against a bet-call-check line it isn't — the bettor's presence in history upgraded someone. The passive line is the license; the number of callers is the limit.</li>
        <li>If you check behind, the pot is over — there is no next street. Checking realizes exactly your hand's showdown equity; bet whenever EV(bet) &gt; showdown EV, which on capped fields is almost always true for the top and blocker classes.</li>
      </ul>

      <Subhead>Blockers</Subhead>
      <ul>
        <li>The flush-completion card makes <strong>bluffing better</strong> (blocks the calls) and <strong>thin value worse</strong> (removes the calls) — use it to bluff, check the thin value it would have called.</li>
        <li>Board-pairing cards in your hand block the trips that continue — the cleanest bluff blockers on paired rivers.</li>
      </ul>

      <Subhead>Facing a surprise lead</Subhead>
      <p className="text-[13px] text-muted leading-snug">If someone donks into you (MW9's OOP leads): their lead range is nut-tilted linear by construction. Raise only the top of Bucket A; call with blockers; fold everything the lead range beats.</p>
    </Section>
  )
}

export default MW10Page
