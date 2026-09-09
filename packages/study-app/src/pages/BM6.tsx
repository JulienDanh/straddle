import { Section, Callout, Code, Action } from '@poker/design-system/src/components/ui'
import { StrategyQuestions } from '@poker/design-system/src/components/StrategyQuestions'


export function BM6Page() {
  return (
    <>
      <Section title="Dealing With 3-Bets & Misc Preflop">
        <p>UTG opens versus each position's defense, dealing with 3-bets, and open-vs-defense from each seat. The directional-shift framework: who covers whom, how deep, and opener's range tightness determine your defense. Short stacks lean raise/fold versus 3-bets; covering stacks can cold call.</p>
        <Callout variant="bad"><strong>When covering the 3-bettor, you can cold call; when covered by the 3-bettor, you can't.</strong> Same hand, different stack dynamic. 50bb vs 25bb 3-bet → 24% calls. 25bb vs 50bb 3-bet → 0% calls. Stack relationship to the 3-bettor, not absolute depth, is the key variable.</Callout>

        <h3>Your stack vs the 3-bettor × cover relationship</h3>
        <table>
          <tr><th>Stack</th><th>Cover the 3-bettor</th><th>Covered by the 3-bettor</th></tr>
          <tr><td><strong>Deep (45-50bb)</strong></td><td><Action variant="call">Cold call ~24%</Action> — can call; cover the 3-bettor.</td><td><Action variant="fold">Raise/fold</Action> — covered by the 3-bettor. Shorter = more raise/fold.</td></tr>
          <tr><td><strong>Mid (30-37bb)</strong></td><td><Action variant="call">Cold call ~16-22%</Action> — covering less but still can call.</td><td><Action variant="fold">Raise/fold</Action> — covered → raise/fold only.</td></tr>
          <tr><td><strong>Short (≤25bb)</strong></td><td><Action variant="call">Some calls if cover</Action> — rare; mostly raise/fold.</td><td><Action variant="fold">~0% calls; raise/fold</Action> — short + covered = pure raise/fold.</td></tr>
        </table>

        <h3>Core rules</h3>
        <table>
          <tr><th>Rule</th><th>Detail</th></tr>
          <tr><td><strong>BB stack dictates opener width</strong></td><td>UTG opens wider when BB short/covered; tighter when BB has big covering stack.</td></tr>
          <tr><td><strong>SB cold call vs UTG when BB very short (10bb)</strong></td><td>SB is 'protected' — UTG's tight range + short BB = can't squeeze. Narrow value range.</td></tr>
          <tr><td><strong>3-bet sizing by depth</strong></td><td>~6-6.5bb mid; ~8-8.5bb at 45+bb. Matching range to size matters more than number.</td></tr>
          <tr><td><strong>Zero-EV fringe hands</strong></td><td>Let FGS (other-table stacks) and tendencies decide. Short stack elsewhere = lean fold.</td></tr>
          <tr><td><strong>Exploits happen at the fringes</strong></td><td>Over-exploiting forces opponents to adjust; in ICM, stolen equity spreads to ALL players.</td></tr>
        </table>

        <h3>Risk factors</h3>
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Who 3-bets you matters</strong></td><td>Short 3-bettor (~25bb) → raise/fold. You cover them (50v25) → cold-call range exists.</td></tr>
          <tr><td><strong>UTG+1 3-bet vs UTG deep (50bb)</strong></td><td>Jax+, AQ; Tens ~0 EV. Very thin bluffs only.</td></tr>
          <tr><td><strong>Raise to 7.9bb leaving 0.1 behind</strong></td><td>Leak. Raise to <Code>~5bb</Code> to fold to jam+call behind (caller shows QQ+).</td></tr>
          <tr><td><strong>4-bet noise</strong></td><td>Some solver 4-bet ranges (CO 4-betting Jacks) appear too loose — likely zero-EV noise. Author wouldn't get Jacks in.</td></tr>
        </table>
        <Callout variant="warn"><strong>Over-exploiting on the bubble is doubly costly.</strong> In ICM, equity stolen from you spreads to ALL players, not just the exploiter. Exploits happen at the fringes, not the core.</Callout>

        <h3>Sizing</h3>
        <p>3-bet sizing varies by stack depth (~5-8.5bb) but matters less than matching range construction to size. Larger 3-bet = more polar value. UTG+1 3-bet vs UTG deep: <Code>Jax+, AQ</Code> (Tens ~0 EV). Raise to <Code>~5bb</Code> (not 7.9bb) so you can fold to a jam + call behind.</p>
      </Section>

      <StrategyQuestions
        title="BM6 — 3-Bets & Misc Preflop Rules"
        questions={[
          { question: 'What determines whether you can cold-call a 3-bet?', options: ['Your stack relationship to the 3-bettor (cover vs covered), not absolute depth', 'Your absolute stack depth', 'Your hand strength', 'The opener\'s position'], correct: 0, explanation: '50bb vs 25bb 3-bet → 24% calls (you cover). 25bb vs 50bb 3-bet → 0% calls (covered). Same hand, different stack dynamic.' },
          { question: 'What happens when covered by the 3-bettor?', options: ['~0% cold calls; raise/fold only', 'Cold call wide', 'Always jam', 'Fold everything'], correct: 0, explanation: 'Covered by the 3-bettor → can\'t cold call. Short + covered = pure raise/fold.' },
          { question: 'What is the SB "protected" dynamic vs UTG?', options: ['BB very short → UTG too tight for BB to squeeze → SB can cold-call narrow value', 'SB should fold everything', 'SB should jam', 'SB should 3-bet light'], correct: 0, explanation: 'SB 17bb, UTG open, BB 10bb: SB is protected. UTG\'s tight range + short BB = can\'t squeeze. SB cold calls a narrow value range (KQs, A9s, mid pairs).' },
          { question: 'Why is leaving 0.1bb behind (raise to 7.9bb with 8bb stack) a leak?', options: ['No fold option preserved — raise to ~5bb to fold to jam+call behind', 'It\'s too small', 'It gives pot odds', 'It\'s fine'], correct: 0, explanation: 'Leaving 0.1bb behind is a leak — no fold option preserved. Raise to ~5bb so you can fold to a jam + call behind (caller shows QQ+).' },
          { question: 'What is the UTG+1 3-bet range vs UTG deep (50bb)?', options: ['Jax+, AQ (Tens ~0 EV). Very thin bluffs only', 'Any pair', 'AK only', 'Suited connectors'], correct: 0, explanation: 'UTG+1 3-bet vs UTG deep: Jax+, AQ (Tens ~0 EV). Very thin bluffs only.' },
          { question: 'Why is over-exploiting on the bubble doubly costly?', options: ['In ICM, equity stolen from you spreads to ALL players, not just the exploiter', 'It costs chips', 'It\'s not costly', 'Only the exploiter gains'], correct: 0, explanation: 'In ICM, equity stolen from you spreads to ALL players. Exploits happen at the fringes, not the core.' },
        ]}
      />
    </>
  )
}

export default BM6Page
