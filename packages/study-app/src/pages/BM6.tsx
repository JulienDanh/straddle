import { Section, Callout, Code, Action, Collapsible, StackMatrix, DataTable } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { HJ_VS_UTG, BTN_VS_UTG, UTG_VS_3BET_BTN } from '@poker/design-system/src/data/ranges'

export function BM6Page() {
  return (
    <Section title="Dealing With 3-Bets & Misc Preflop">
      <p>UTG opens versus each position's defense, dealing with 3-bets, and open-vs-defense from each seat. The directional-shift framework: who covers whom, how deep, and opener's range tightness determine your defense. Short stacks lean raise/fold versus 3-bets; covering stacks can cold call.</p>

      <>
              <StackMatrix
                colAxisLabel="Cover relationship"
                rowAxisLabel="Your stack"
                colLabels={['Cover the 3-bettor', 'Covered by the 3-bettor']}
                rows={[
                  { label: 'Deep (45-50bb)', cells: [
                    { content: <><Action variant="call">Cold call ~24%</Action> — can call; cover the 3-bettor.</>, variant: 'call' },
                    { content: <><Action variant="fold">Raise/fold</Action> — covered by the 3-bettor. Shorter = more raise/fold.</>, variant: 'fold' },
                  ]},
                  { label: 'Mid (30-37bb)', cells: [
                    { content: <><Action variant="call">Cold call ~16-22%</Action> — covering less but still can call.</>, variant: 'call' },
                    { content: <><Action variant="fold">Raise/fold</Action> — covered → raise/fold only.</>, variant: 'fold' },
                  ]},
                  { label: 'Short (≤25bb)', cells: [
                    { content: <><Action variant="call">Some calls if cover</Action> — rare; mostly raise/fold.</>, variant: 'call' },
                    { content: <><Action variant="fold">~0% calls; raise/fold</Action> — short + covered = pure raise/fold.</>, variant: 'fold' },
                  ]},
                ]}
              />

              <Callout variant="bad"><strong>When covering the 3-bettor, you can cold call; when covered by the 3-bettor, you can't.</strong>

<p className="mt-6 mb-1 text-sm text-muted">UTG's open versus each position's defense — HJ and BTN here (the blinds are in the Range Library) — and UTG's decision facing the 3-bet itself. The seats between UTG and the 3-bettor act first, so these are the fold-back-around nodes:</p>
              <RangeBrowser ranges={HJ_VS_UTG} />
              <RangeBrowser ranges={BTN_VS_UTG} />
              <RangeBrowser ranges={UTG_VS_3BET_BTN} /> Same hand, different stack dynamic. 50bb vs 25bb 3-bet → 24% calls. 25bb vs 50bb 3-bet → 0% calls. Stack relationship to the 3-bettor, not absolute depth, is the key variable.</Callout>

              <Collapsible title="Core rules">
                <DataTable columns={[{ header: 'Rule' }, { header: 'Detail' }]} rows={[[<><strong>BB stack dictates opener width</strong></>, <>UTG opens wider when BB short/covered; tighter when BB has big covering stack.</>],
                  [<><strong>SB cold call vs UTG when BB very short (10bb)</strong></>, <>SB is 'protected' — UTG's tight range + short BB = can't squeeze. Narrow value range.</>],
                  [<><strong>3-bet sizing by depth</strong></>, <>~6-6.5bb mid; ~8-8.5bb at 45+bb. Matching range to size matters more than number.</>],
                  [<><strong>Zero-EV fringe hands</strong></>, <>Let FGS (other-table stacks) and tendencies decide. Short stack elsewhere = lean fold.</>],
                  [<><strong>Exploits happen at the fringes</strong></>, <>Over-exploiting forces opponents to adjust; in ICM, stolen equity spreads to ALL players.</>]]} />
              </Collapsible>

              <Collapsible title="Risk factors">
                <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Who 3-bets you matters</strong></>, <>Short 3-bettor (~25bb) → raise/fold. You cover them (50v25) → cold-call range exists.</>],
                  [<><strong>UTG+1 3-bet vs UTG deep (50bb)</strong></>, <>Jax+, AQ; Tens ~0 EV. Very thin bluffs only.</>],
                  [<><strong>Raise to 7.9bb leaving 0.1 behind</strong></>, <>Leak. Raise to <Code>~5bb</Code> to fold to jam+call behind (caller shows QQ+).</>],
                  [<><strong>4-bet noise</strong></>, <>Some solver 4-bet ranges (CO 4-betting Jacks) appear too loose — likely zero-EV noise. Author wouldn't get Jacks in.</>]]} />
                <Callout variant="warn"><strong>Over-exploiting on the bubble is doubly costly.</strong> In ICM, equity stolen from you spreads to ALL players, not just the exploiter. Exploits happen at the fringes, not the core.</Callout>
              </Collapsible>

              <Collapsible title="Sizing">
                <p>3-bet sizing varies by stack depth (~5-8.5bb) but matters less than matching range construction to size. Larger 3-bet = more polar value. UTG+1 3-bet vs UTG deep: <Code>Jax+, AQ</Code> (Tens ~0 EV). Raise to <Code>~5bb</Code> (not 7.9bb) so you can fold to a jam + call behind.</p>
              </Collapsible>
            </>
    </Section>
  )
}

export default BM6Page
