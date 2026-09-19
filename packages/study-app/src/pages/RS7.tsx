import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const RS7_LEAKS: [ReactNode, ReactNode?][] = [
  ['The polar player checks', 'giving up the lead = giving up the edge; position is not worth the whole pot'],
  ['The polar player jams regardless of traps', 'same bet every river ignores the one variable (t) the whole game runs on'],
  ['The condensed player bluffs', 'weak wall vs strong polar leads: air has no line — fold or call, nothing else'],
  ['The trap-holder always raises', 'standard-size leads get called; only overgrown sizes cross the raise threshold'],
]

export function RS7Page() {
  return (
    <Section title="RS7 — Polar OOP vs Condensed IP">
      <p>The capstone toy game: the <strong>strong polar range sits out of position</strong> and must act first against a <strong>condensed weak IP range containing traps</strong>. The hardest configuration for both players — the polar player holds the nuts advantage but must <em>lead</em> into trap density; the condensed player holds position but a weak wall. It resolves the course's two big questions at once: how big can the polar player bet into traps (the RS4 cap), and when does position stop mattering (RS3's collapse)?</p>

      <Leak items={RS7_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Hand (either seat)' }, { header: 'Line' }]}
        rows={[
          [
            <><strong>A · OOP nuts region</strong></>,
            <>Top of polar range</>,
            <><Action variant="bet">Lead</Action> — pot-to-123% band at t≈10%; geometric toward all-in at higher SPR</>,
          ],
          [
            <><strong>B · OOP bluff region</strong></>,
            <>Polar air</>,
            <>Lead the same size; ratio per pot odds (RS1) scaled down for trap losses — prefer fold-unblocking cards</>,
          ],
          [
            <><strong>C · IP wall</strong></>,
            <>Condensed catchers</>,
            <><Action variant="call">Call from the top</Action> at c = max(MDF, t); fold the quota from the bottom</>,
          ],
          [
            <><strong>D · IP traps</strong></>,
            <>Beat the polar value</>,
            <><Action variant="call">Call standard sizes</Action>; raise vs overgrown ones; slow back down vs balanced ones</>,
          ],
        ]}
      />

      <Callout variant="bad"><strong>Leading all-in into a 10%+ trap range is the classic capstone error.</strong> The solved math prices the cap at ~123%, not 200% — bigger bets filter the wall, leaving proportionally more traps in the calling range (q = (c−t)/c shrinks as bets grow). All-in is only correct near t≈0.</Callout>

      <Subhead>The collision, resolved</Subhead>
      <ul>
        <li><strong>Leading is mandatory for the polar OOP player</strong> — checking surrenders the pot to a free showdown; the polar edge dies unexercised. The only question is the size.</li>
        <li><strong>Strong-polar leverage:</strong> because the polar range is strong (deep nuts region), it can bet more merged-bluffs than a weak polar range — value-region equity pays for the bluffs the traps punish.</li>
        <li><strong>High SPR:</strong> the polar OOP player wants fewer betting rounds (position hurts them) — frontload larger-than-geometric to deny the condensed player's cheap showdowns and re-priced rivers.</li>
        <li><strong>Outcome:</strong> the equilibrium splits EV roughly by nuts advantage — position is worth less than the trap cap is worth.</li>
      </ul>

      <Callout><strong>"Raise the overgrown, call the capped."</strong> IP traps call standard sizes and raise overgrown ones; the wall defends from the top at max(MDF, t); IP air never bluffs — fold or call, nothing else. ICM compresses the whole structure toward jams and folds.</Callout>
    </Section>
  )
}

export default RS7Page
