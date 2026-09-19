import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const MW5_LEAKS: [ReactNode, ReactNode?][] = [
  ['Calling the flop with no turn plan', 'coverage calls that fold their hit turns are catastrophic'],
  ['Peeling double barrels with dominated medium', '"the board is just so threatening" is the feeling of being shown the exit'],
  ['Auto-folding the undercard pocket pairs', 'the pair below the middle card is "very rarely folded"'],
  ['Donk-leading turns after calling', 'the aggressor\u2019s check is your green light; leading into their betting range donates fold equity backwards'],
]

export function MW5Page() {
  return (
    <Section title="MW5 — Missed Flop Calls from BB">
      <p>The BB called the flop bet and survived — now the hard part: out of position against a condensed betting range, possibly with a third player still in. The core skill: <strong>know before the turn arrives which cards you're continuing on and which you conceded the moment you called.</strong></p>

      <Leak items={MW5_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Turn situation' }, { header: 'Default' }]}
        rows={[
          [
            <><strong>A · Coverage hits</strong></>,
            <>Overcards to a low board pair up: T/J/Q/K turns</>,
            <><Action variant="call">Check-call once</Action> — this is what the flop call was for</>,
          ],
          [
            <><strong>B · Static/brick</strong></>,
            <>Board pairs low, blank turns</>,
            <><Action variant="call">Check-call</Action> with 2x/5x/7x-class; check-fold air</>,
          ],
          [
            <><strong>C · Threatening</strong></>,
            <>Flush/straight completes; board interacts with the raiser\u2019s range</>,
            <><Action variant="fold">Nut-grade only</Action> — fold the dominated middle</>,
          ],
          [
            <><strong>D · Double barrel, third player in</strong></>,
            <>Aggressor barrels into both of you</>,
            <><Action variant="fold">Tightest continue</Action> — nut potential or fold</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>Your flop calls were a promise about the turn.</strong> On 752 vs an EP c-bet, the BB calls with every 7x, nearly every 5x, every 2x, and KQ/QJ/QT overcards "for board coverage" — pre-loaded for the T/J/Q/K turns the opener barrels aggressively. Coverage cards are calls <em>because of the barrel they block</em>.</Callout>

      <Subhead>Read the turn against the aggressor's range</Subhead>
      <ul>
        <li>Cards that improve the raiser's condensed range (overcards on low boards, broadways completing AK/AQ) invite barrels — check-call your coverage hands, check-raise almost never (MW3 rules while a player is behind you).</li>
        <li>Cards that miss their range but connect yours (low cards pairing K-high boards) — check and let them barrel or give up; don't donk.</li>
        <li>Threatening boards shrink continuance brutally: on KJQdd facing 28% pot, even QTs mixes folding and T9s "should call, but... can I really just call?" — continuance is equity-based, not stubbornness-based.</li>
      </ul>

      <Subhead>The stubborn undercard pair</Subhead>
      <p className="text-[13px] text-muted leading-snug">On K92r, 44–77 do some calling and 88 "almost always calls" — the pocket pair just below the middle flop card is very rarely folded. If you're always folding these, "you're probably folding too much on the flop." It survives <strong>one</strong> bet — not a double barrel into two players.</p>

      <Callout variant="bad"><strong>"Second barrel into two players is a confession: believe it."</strong> A range that chose to bet into two players twice is nut-tilted — one-pair bluff-catchers are dominated. If the third player folded, thresholds loosen toward your heads-up systems (S9/S12): the burden of defense is no longer shared against you. And when the aggressor checks the turn, the clock passed — transition to MW8/MW9.</Callout>

      <Subhead>Robust equity beats raw equity</Subhead>
      <p className="text-[13px] text-muted leading-snug">The hands that do well multiway have better visibility — more paths to the nuts. Pair+draw, suited connectors, set-mines: hands whose improvement <em>is</em> the nuts. Weak top pairs and dominated kickers bleed reverse implied odds.</p>
    </Section>
  )
}

export default MW5Page
