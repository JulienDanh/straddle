import { Section, Callout, H, Tabs, Collapsible, DataTable } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function S11Page() {
  return (
    <Section title="System 11 — Hero Calling">
      <p>Face river bet with bluff catcher. Call or fold? Systematically differentiating between bluff catchers.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <h3>Good vs bad bluff catchers</h3>
              <DataTable columns={[{ header: 'Attribute' }, { header: 'Good' }, { header: 'Bad' }]} rows={[[<>Blocks value</>, <>King (blocks KK, KQ)</>, <>8/9 (blocks nothing valuable)</>],
                  [<>Unblocks bluffs</>, <>4, 3, deuce</>, <>8, 9, T (blocks offsuit opens)</>]]} />

              <Callout>Value range <em>wide</em> → focus on unblocking bluffs. <em>Narrow</em> → focus on blocking value.</Callout>
              <Callout variant="warn"><strong>Preflop awareness:</strong> BTN opens suited 5+ and offsuit 8+. 4-x/3-x <em>unblock</em> bluffs (not opened); 8-x/9-x <em>block</em> bluffs (opened).</Callout>

              <Collapsible title="Three keys">
                <DataTable columns={[{ header: '#' }, { header: 'Key' }, { header: 'Description' }]} rows={[[<>1</>, <><strong>Range awareness</strong></>, <>Know what combos you arrive with</>],
                  [<>2</>, <><strong>Unblock bluffs</strong></>, <>Prefer hands that don't block opponent's bluffing region</>],
                  [<>3</>, <><strong>Block value</strong></>, <>Prefer hands that block opponent's value region</>]]} />
              </Collapsible>

              <Collapsible title="Core principle">
                <Callout><strong>Opponent's required bluff frequency = your pot odds.</strong> Need 25% → they must bluff 25% of betting range. If balanced → worst callable = worth 0. But <em>better</em> bluff catchers = worth significant EV.</Callout>
              </Collapsible>

              <Collapsible title="Exceptions">
                <ul>
                  <li><strong>No natural bluffs:</strong> if no draws missed, opponent won't convert Ax to bluff → fold even if MDF says call.</li>
                  <li><strong>Check-raise opportunity:</strong> if opponent bets too small IP (1/3 pot, thin value), CR second pair can fold better + call worse. Modest CR (to ~25bb) can get hands you beat to call (KQ, QJ) and hands that beat you to fold (A-3/4/5<H>♥</H>).</li>
                </ul>
              </Collapsible>

              <Collapsible title="Sizing">
                <p>No explicit sizing — it's a call/fold decision.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 11 — Practice"
              quiz={{
                options: [
                  { label: 'Call', variant: 'call' },
                  { label: 'Fold', variant: 'fold' },
                ],
                scenarios: [
                  { board: { high: 'T', variant: 'green', label: 'T-high, opp checked turn' }, correct: { label: 'Call', variant: 'call' }, explanation: 'T6o blocks opponent from having Tx (their thin value). After turn check-back, their range is weak. Blocker effect makes this superior.' },
                  { board: { high: 'K', variant: 'green', label: 'K7/K3/K2' }, correct: { label: 'Call', variant: 'call' }, explanation: 'King-high blockers block KK/KQ (value region) AND unblock bluffs (BTN opens suited 5+, offsuit 8+). Excellent hero call.' },
                  { board: { high: '9', variant: 'green', label: '92/93/97' }, correct: { label: 'Fold', variant: 'fold' }, explanation: '9-x blocks where bluffs come from (offsuit 8+ opens). Doesn\'t block value. Bad bluff catcher — fold.' },
                  { board: { high: '9', variant: 'green', label: '42/43/74 (low cards)' }, correct: { label: 'Call', variant: 'call' }, explanation: '4-x unblocks bluffs (BTN doesn\'t open suited 4s, offsuit 7s). Makes more bluffs available. Attractive hero call.' },
                  { board: { high: 'T', suit: 'two-tone', label: '78s blocks pocket 7s' }, correct: { label: 'Call', variant: 'call' }, explanation: '78s blocks 2/3 of opponent\'s value (pocket 7s). Worth ~27% of pot. Not all bluff catchers are worth 0 — 78s is worth a lot.' },
                  { board: { high: 'T', variant: 'green', label: 'Pocket 8s (no blocker)' }, correct: { label: 'Fold', variant: 'fold' }, explanation: 'Pocket 8s doesn\'t block value or unblock bluffs — worth 0, indifferent. 78s is far superior because it blocks where value comes from.' },
                ],
              }}
              questions={[
                { question: 'What are the three keys to hero calling?', options: ['Range awareness, unblock bluffs, block value', 'Bet sizing, pot odds, blockers', 'Hand strength, position, stack depth', 'Board texture, draws, fold equity'], correct: 0, explanation: '1) Range awareness (know what you arrive with), 2) Unblock bluffs (don\'t block their bluffing region), 3) Block value (block their value region).' },
                { question: 'When the value range is wide, what do you focus on?', options: ['Unblock bluffs (#2)', 'Block value (#3)', 'Both equally', 'Neither'], correct: 0, explanation: 'Value range wide → focus on #2 (unblock bluffs). Narrow → focus on #3 (block value).' },
                { question: 'Which cards are GOOD bluff catchers (unblock bluffs)?', options: ['4, 3, deuce (not in opponent\'s open range)', '8, 9, T (in their range)', 'Ace, King', 'Paired cards'], correct: 0, explanation: 'BTN opens suited 5+ and offsuit 8+. 4-x/3-x unblock bluffs (not opened); 8-x/9-x block bluffs (opened).' },
                { question: 'Which cards BLOCK value well?', options: ['King (blocks KK, KQ)', '8, 9 (blocks nothing valuable)', 'Deuce', '4'], correct: 0, explanation: 'King blocks KK, KQ (value). 8/9 block nothing valuable. Good catchers block value AND unblock bluffs.' },
                { question: 'What is the "no natural bluffs" exception?', options: ['If no draws missed, opponent won\'t convert Ax to bluff → fold even if MDF says call', 'Always call if MDF says call', 'Bluff more', 'Check-raise'], correct: 0, explanation: 'If no draws missed, opponent has no natural bluffs → won\'t convert Ax to bluff → fold even if MDF says call.' },
                { question: 'What is the opponent\'s required bluff frequency?', options: ['Your pot odds', 'Their bet size', 'Always 50%', 'The MDF'], correct: 0, explanation: 'Opponent\'s required bluff frequency = your pot odds. Need 25% → they must bluff 25% of betting range. Better catchers = worth significant EV.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S11Page
