import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Code } from '@poker/design-system/src/components/ui'

export const RS4_LEAKS: [ReactNode, ReactNode?][] = [
  ['Jamming into traps', 'treating the trap-capped range like the clairvoyance game overpays the 10%'],
  ['Raising traps too fast', 'IP traps make more from calls and small bets while the opponent can still barrel air'],
  ['Pretending the wall is pure', 'defense never drops below the trap percentage — plan the quota from the wall only'],
]

export function RS4Page() {
  return (
    <Section title="RS4 — Condensed IP with Traps">
      <p>Toy Game 4 injects <strong>traps</strong> into the condensed IP range: hands that beat the polar player's value bets. This game teaches the deepest sizing law in poker: <strong>optimal bet size is a function of nut advantage</strong>. Against a range that is 90% bluff catchers and 10% traps, the optimal attacking size is ~123% pot — all-in is only correct near t≈0.</p>

      <Leak items={RS4_LEAKS} />

      <DataTable
        columns={[{ header: 'Trap density (t)' }, { header: 'Optimal attack size' }]}
        rows={[
          ['~0%', <>Unbounded — jam (the clairvoyance case)</>],
          [<><strong>10%</strong></>, <><strong>~123% pot</strong> (100–150% nearly equal in EV)</>],
          ['25%+', <>Shrinks toward pot and below — more traps = smaller bets</>],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">The math: defense never drops below the trap fraction, <Code>c = max(MDF, t)</Code>; value equity when called is <Code>q = (c − t)/c</Code> — the larger the bet, the more bluff catchers fold, leaving proportionally <em>more traps</em> in the calling range. Traps cap the opponent's aggression.</p>

      <Subhead>Deploying the traps (IP)</Subhead>
      <ul>
        <li><strong>Vs bets: mostly call</strong> — their range is polar and your traps beat the value half; let them keep barreling. Position lets traps wait: the polar player must bet into them or give up the pot.</li>
        <li><strong>Vs checks: bet</strong> — traps extract from air-checks and value-checks alike; size ~100–150% with value + blocker bluffs.</li>
        <li><strong>Raise only when their size outgrew the trap-capped optimum</strong> — the overbet already crossed the cap and paid you the max.</li>
      </ul>

      <Callout variant="good"><strong>"Traps cap sizes — the more traps, the smaller the bets."</strong> A 3× pot jam into the 90/10 mix gets raised by traps and folded to by the quota — the overbet filtered toward exactly the hands that beat it. The EV surface is flat near the peak: 100–150% pot is close.</Callout>

      <Callout><strong>Slow-playing is correct here</strong> — unlike the clairvoyance game, where "slow-playing the nuts doesn't make sense if the opponent won't bet": a polar opponent <em>will</em> bet. And the non-trap majority defends exactly as in RS2 — MDF arithmetic unchanged; traps only remove the bottom of the fold quota (they never fold).</Callout>
    </Section>
  )
}

export default RS4Page
