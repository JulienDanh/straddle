import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, DataTable } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const MW3_LEAKS: [ReactNode, ReactNode?][] = [
  ['Raising from the sandwich', 'paying for the privilege of being squeezed'],
  ['Overcalling in the last-to-act seat', 'the population overcalls at ~2× the equilibrium rate'],
  ['Calling MW flop raises too wide', 'the raise survived two ranges; your bluff-catcher did not survive the raise'],
  ['Raising with dominated draws', 'nut potential is king — the non-nut draw builds a pot for the hand that beats you'],
]

export const MW3_TREE: DecisionNode = {
  question: 'Does anyone with a live, uncapped range still act behind you?',
  hint: 'Count the players after you — the raise must survive being called by one and re-raised by another',
  yes: {
    action: <Action variant="call">Call or fold</Action>,
    actionVariant: 'call',
    reason: 'Sandwiched/OOP raises are structurally punished — the solver raises ~0%',
    detail: [
      'Facing a BTN bet with the HJ behind: BB folds ~69%, calls ~31%, raises never',
      'Rare OOP raises polarize into the nuts only: top two, sets, pair+nut draw on threatening boards',
      '"That is not an exploitable tendency — it is the structurally correct response to being sandwiched"',
    ],
  },
  no: {
    action: <Action variant="raise">Raise — the flop squeeze</Action>,
    actionVariant: 'raise',
    reason: 'Closing the action unlocks raising: no one can squeeze you, and your raise faces two capped ranges at once',
    size: '~3× the bet + the call in the pot',
    detail: [
      'HJ raises 30.7% after BTN bet + BB call — **2× the overcall (14.5%)**',
      'Value linearly (two pair+, sets, strong top pair) + medium pairs as blocker bluffs + nut draws',
      'The overcall range is necessarily capped and buried between two players — raise is the default continue',
    ],
  },
}

export function MW3Page() {
  return (
    <Section title="MW3 — Poor Flop Raises">
      <p>Once someone bets a multiway flop, the raise becomes the rarest and most expensive action at the table — it has to get through two (or more) ranges that are allowed to defend tight. The core skill: <strong>raise only when the raise survives being called by one player and re-raised by another.</strong> The last player's raise — the flop squeeze — is dramatically underused by the population.</p>

      <Leak items={MW3_LEAKS} />

      <DecisionTree root={MW3_TREE} />

      <Callout variant="good"><strong>"The last raise owns the pot — be the last raise."</strong> After a bet and a call, the raise is used more than twice as often as the overcall: fold equity against both opponents, a defined range, and control on later streets. Medium pairs make safe bluffs — second/third pair blocks exactly the sets and two pair that would call or re-raise.</Callout>

      <Subhead>Facing a multiway flop raise</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Hand' }, { header: 'Response' }]}
        rows={[
          ['Sets, nut draws, top two', <><Action variant="call">Continue</Action> — nut-grade equity only</>],
          ['One-pair bluff-catchers (KJ on QJ5)', <><Action variant="fold">Fold</Action> — the raise priced out two players; pot odds don\u2019t save dominated pairs</>],
          ['Near bubbles', 'ICM adds elimination cost — tighten further'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">Drop to the tightest continuation thresholds of the whole course: the raiser got the bet through two players, so their range is honest — "a raise through two ranges is a confession of strength."</p>

      <Subhead>Click-backs vs a squeezer (40–50bb)</Subhead>
      <p className="text-[13px] text-muted leading-snug">When the BB squeezes a c-bet + call on K92r to 6bb, the opener's counter is "clicky": blocker hands (A2s, K3s — nearly dead otherwise, blocking the squeezer's value region) re-raise to ~12.5bb (~2×). The tiny size exploits the squeezer's polarized range: its bluffs can't stand even a min-raise.</p>

      <Subhead>Blockers</Subhead>
      <ul>
        <li><strong>Medium pairs</strong> as last-to-act bluffs: block the sets and two pair that would call or re-raise.</li>
        <li><strong>Click-back candidates</strong> (A2s on K92r, K3s): block aces-with-the-board-card and top-pair calls.</li>
        <li>Raising a two-tone board <strong>without the nut flush draw</strong> is expensive — you build a pot where the caller's flush dominance is unblocked.</li>
      </ul>
    </Section>
  )
}

export default MW3Page
