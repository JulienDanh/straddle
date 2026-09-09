import { Section, Callout, H } from '../components/ui'
import { StrategyQuestions } from '../components/StrategyQuestions'


export function S11Page() {
  return (
    <>
      <Section title="System 11 \u2014 Hero Calling">
        <p>Face river bet with bluff catcher. Call or fold? Systematically differentiating between bluff catchers.</p>

        <h3>Three keys</h3>
        <table>
          <tr><th>#</th><th>Key</th><th>Description</th></tr>
          <tr><td>1</td><td><strong>Range awareness</strong></td><td>Know what combos you arrive with</td></tr>
          <tr><td>2</td><td><strong>Unblock bluffs</strong></td><td>Prefer hands that don't block opponent's bluffing region</td></tr>
          <tr><td>3</td><td><strong>Block value</strong></td><td>Prefer hands that block opponent's value region</td></tr>
        </table>
        <Callout>Value range <em>wide</em> \u2192 focus on #2 (unblock bluffs). <em>Narrow</em> \u2192 focus on #3 (block value).</Callout>

        <h3>Good vs bad bluff catchers</h3>
        <table>
          <tr><th>Attribute</th><th>Good</th><th>Bad</th></tr>
          <tr><td>Blocks value</td><td>King (blocks KK, KQ)</td><td>8/9 (blocks nothing valuable)</td></tr>
          <tr><td>Unblocks bluffs</td><td>4, 3, deuce</td><td>8, 9, T (blocks offsuit opens)</td></tr>
        </table>
        <Callout variant="warn"><strong>Preflop awareness:</strong> BTN opens suited 5+ and offsuit 8+. 4-x/3-x <em>unblock</em> bluffs (not opened); 8-x/9-x <em>block</em> bluffs (opened).</Callout>

        <h3>Core principle</h3>
        <Callout><strong>Opponent's required bluff frequency = your pot odds.</strong> Need 25% \u2192 they must bluff 25% of betting range. If balanced \u2192 worst callable = worth 0. But <em>better</em> bluff catchers = worth significant EV.</Callout>

        <h3>Exceptions</h3>
        <ul>
          <li><strong>No natural bluffs:</strong> if no draws missed, opponent won't convert Ax to bluff \u2192 fold even if MDF says call.</li>
          <li><strong>Check-raise opportunity:</strong> if opponent bets too small IP (1/3 pot, thin value), CR second pair can fold better + call worse. Modest CR (to ~25bb) can get hands you beat to call (KQ, QJ) and hands that beat you to fold (A-3/4/5<H>\u2665</H>).</li>
        </ul>

        <h3>Sizing</h3>
        <p>No explicit sizing \u2014 it's a call/fold decision.</p>
      </Section>

      <StrategyQuestions
        title="System 11 — Rules"
        questions={[
          { question: 'What are the three keys to hero calling?', options: ['Range awareness, unblock bluffs, block value', 'Bet sizing, pot odds, blockers', 'Hand strength, position, stack depth', 'Board texture, draws, fold equity'], correct: 0, explanation: '1) Range awareness (know what you arrive with), 2) Unblock bluffs (don\'t block their bluffing region), 3) Block value (block their value region).' },
          { question: 'When the value range is wide, what do you focus on?', options: ['Unblock bluffs (#2)', 'Block value (#3)', 'Both equally', 'Neither'], correct: 0, explanation: 'Value range wide → focus on #2 (unblock bluffs). Narrow → focus on #3 (block value).' },
          { question: 'Which cards are GOOD bluff catchers (unblock bluffs)?', options: ['4, 3, deuce (not in opponent\'s open range)', '8, 9, T (in their range)', 'Ace, King', 'Paired cards'], correct: 0, explanation: 'BTN opens suited 5+ and offsuit 8+. 4-x/3-x unblock bluffs (not opened); 8-x/9-x block bluffs (opened).' },
          { question: 'Which cards BLOCK value well?', options: ['King (blocks KK, KQ)', '8, 9 (blocks nothing valuable)', 'Deuce', '4'], correct: 0, explanation: 'King blocks KK, KQ (value). 8/9 block nothing valuable. Good catchers block value AND unblock bluffs.' },
          { question: 'What is the "no natural bluffs" exception?', options: ['If no draws missed, opponent won\'t convert Ax to bluff → fold even if MDF says call', 'Always call if MDF says call', 'Bluff more', 'Check-raise'], correct: 0, explanation: 'If no draws missed, opponent has no natural bluffs → won\'t convert Ax to bluff → fold even if MDF says call.' },
          { question: 'What is the opponent\'s required bluff frequency?', options: ['Your pot odds', 'Their bet size', 'Always 50%', 'The MDF'], correct: 0, explanation: 'Opponent\'s required bluff frequency = your pot odds. Need 25% → they must bluff 25% of betting range. Better catchers = worth significant EV.' },
        ]}
      />
    </>
  )
}

export default S11Page
