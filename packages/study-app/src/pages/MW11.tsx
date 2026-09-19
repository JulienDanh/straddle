import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const MW11_LEAKS: [ReactNode, ReactNode?][] = [
  ['Paying sheriff tax', 'calling river bets from early seats because "someone has to" — no one has to'],
  ['Heads-up MDF instincts', 'multiway defense runs well below HU MDF per player'],
  ['Overcalling the borderline', 'the overcall must beat two ranges; most players price it against the bettor only'],
  ['Calling big bets with bluff-catchers', 'the polar multiway bet was priced to make exactly that call a loss'],
]

export function MW11Page() {
  return (
    <Section title="MW11 — Missed River Calls">
      <p>Someone finally bet the multiway river — the course's final exam: bluff-catching against a multiway bet. The economics are unforgiving: the bettor chose to fire into two-plus ranges, so their range is honest; your defense is shared, so nobody has to be the sheriff; and your seat decides how much of the burden is even yours.</p>

      <Leak items={MW11_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Your seat vs the bet' }, { header: 'Defense' }]}
        rows={[
          [
            <><strong>A · Last to act</strong></>,
            <>Closing action, no overcall risk</>,
            <><Action variant="call">Widest calls</Action> — blockers + top of capped range, near-MDF</>,
          ],
          [
            <><strong>B · Early, players behind</strong></>,
            <>First defender</>,
            <><Action variant="fold">Near-free over-folds</Action> — call only nuts-adjacent</>,
          ],
          [
            <><strong>C · Middle after a call</strong></>,
            <>Overcall seat</>,
            <><Action variant="fold">Domination hands or blockers only</Action> — the overcall beats two ranges or nothing</>,
          ],
          [
            <><strong>D · Vs big polar bet</strong></>,
            <>Anywhere, 75%+</>,
            <><Action variant="fold">Nut-catchers only</Action> — fold the middle of your range</>,
          ],
        ]}
      />

      <Callout variant="bad"><strong>Multiway river bets are honest by construction.</strong> Pure bluffs face "an absolutely terrible risk-reward ratio" — fold frequencies multiply, so opponents can defend much tighter while still preventing profitable bluffs. The bettor's range is value-tilted; believe it. And "the player who closes the action takes on a larger portion of defense than the players before them" — only the last deputy is on duty.</Callout>

      <Subhead>Size and texture gates</Subhead>
      <ul>
        <li><strong>Small bet (≤33%):</strong> the shared-fold math means your call needs only modest equity — blocker bluff-catchers clear the bar in seats A/C.</li>
        <li><strong>Big bet (75%+):</strong> fold everything except nut-catchers — the polar range has already priced out your medium.</li>
        <li><strong>Scary rivers vs calm rivers:</strong> tighten a full grade on runouts that built the bettor's range — "the board is just so threatening, it's too miserable to call all the time."</li>
      </ul>

      <Subhead>The blocker test on the borderline</Subhead>
      <ul>
        <li>Blocking the bettor's value region → call: the flush card vs a flush-river bet blocks their value and unblocks their bluffs — the model multiway call.</li>
        <li>An ace blocks the ace-high hero-bluff region and missed-AK-turned-value — the swiss-army blocker on broadway rivers.</li>
        <li>Board pairs in your hand block trips — on paired rivers, the bluff-catcher <em>with</em> the board card calls; without it, folds. Unblocked medium vs two ranges: fold.</li>
      </ul>

      <Callout><strong>"Blockers call; bare medium folds."</strong> Blockers become more important multiway — as they interact with more ranges, the card removal effects become more powerful. The math that made the bet honest makes your indifferent call negative.</Callout>
    </Section>
  )
}

export default MW11Page
