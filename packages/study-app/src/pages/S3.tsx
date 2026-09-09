import { Section, Callout, Action, RandomBoard, BoardTable } from '@poker/design-system/src/components/ui'
import { StrategyQuiz } from '@poker/design-system/src/components/StrategyQuiz'
import { StrategyQuestions } from '@poker/design-system/src/components/StrategyQuestions'


export function S3Page() {
  return (
    <>
      <Section title="System 3 — BB vs SB Limp Stab · Defending Flops">
        <p>SB limps, BB checks, SB stabs (1bb into ~3.7bb). We defend from BB. Highest-impact scenario — BB win rate determines winner/loser.</p>
        <Callout variant="good"><strong>Why BB matters:</strong> Skilled player goes from −112 bb/100 (walk-away) to −20 — 92 points of opportunity. UTG only has 27. BB skill is <em>definitively</em> most important.</Callout>

        <h3>Fold target & mechanisms</h3>
        <p>SB bets 1bb into ~3.7bb. Risk/reward = 1/4 ≈ <strong>25% fold</strong>. Defend ~75%. Focus on the 25% you fold.</p>
        <p>Three defending mechanisms: <strong>high-card defending</strong> (A-high pure → J-high starts folding), <strong>three to a straight</strong> (98o, 86o, 65o — pure calls), <strong>backdoor flush draw</strong> (high card of suit &gt; low card).</p>
        <Callout variant="warn"><strong>Ace and Deuce are NOT strategically relevant.</strong> Everything has overcards to deuce / undercards to ace. No over-unders to either. <em>Ignore them.</em> Build strategy around the other board cards.</Callout>

        <h3>Board types and actions</h3>
        <BoardTable rows={[
          { boards: [<RandomBoard high="K" label="KQ8 (key=8, high)" variant="green" />, <RandomBoard high="Q" label="Q83 (key=8, high)" variant="green" />], action: <Action variant="call">Defend ~75%</Action>, note: <><strong>High key card (8):</strong> double-overs rare/valuable → rarely fold. Worst hands = double-unders to key card (fold unless gutshots/3-straight).</> },
          { boards: [<RandomBoard high="A" label="A42 (key=4, low)" variant="orange" />, <RandomBoard high="K" label="K62 (key=6, low)" variant="orange" />], action: <Action variant="fold">Fold more</Action>, note: <><strong>Low key card (5):</strong> double-overs common → fold more. Over-unders worst hands (73, 83, 93) fold. BDFD can rescue non-worst.</> },
          { boards: [<RandomBoard high="K" paired label="K77" variant="orange" />, <RandomBoard high="J" paired label="J66" variant="orange" />], action: <Action variant="call">Defend around unpaired</Action>, note: "Paired card unusable (can't have equity vs trips). Evaluate around unpaired high card. High-card defending dominates." },
        ]} />

        <h3>Classify around the key card</h3>
        <table>
          <tr><th>Category</th><th>Definition</th><th>Playability</th></tr>
          <tr><td><strong>Double overs</strong></td><td>Both above key card</td><td>Easy play (high key card = rare; low = may fold)</td></tr>
          <tr><td><strong>Over-under</strong></td><td>One over, one under</td><td>Sensitive — worst hands. BDFD often needed.</td></tr>
          <tr><td><strong>Double unders</strong></td><td>Both below</td><td>Often fold — <em>unless</em> gut shots / 3-straight</td></tr>
        </table>

        <Callout variant="bad"><strong>BDFD is not always enough.</strong> Identify the <em>worst</em> hand on the board first (A42 → 7; K62 → over-unders to 6; KQ8 → double-unders to 8). Even with BDFD, the worst hands (42s on K77) still fold.</Callout>

        <h3>Preflop asymmetry</h3>
        <Callout>SB has a folding range; BB does not. 2x/3x favor BB. BB checking = capped (no AK/AQ/overpairs). SB has advantage on Broadway boards; BB on low boards.</Callout>

        <h3>Sizing</h3>
        <p>1bb stab into ~3.7bb pot.</p>
      </Section>

      <StrategyQuiz
        title="System 3 — Defend or Fold More?"
        options={[
          { label: 'Defend ~75%', variant: 'call' },
          { label: 'Fold more', variant: 'fold' },
        ]}
        scenarios={[
          { board: { high: 'K', variant: 'green' }, correct: { label: 'Defend ~75%', variant: 'call' }, explanation: 'High key card (8) → double-overs rare and valuable. Rarely fold. (KQ8-type: key=8, high.)' },
          { board: { high: 'Q', variant: 'green' }, correct: { label: 'Defend ~75%', variant: 'call' }, explanation: 'High key card (8) → double-overs rare. Defend wide. Worst = double-unders to key card.' },
          { board: { high: 'A', lowCard: 4, variant: 'orange' }, correct: { label: 'Fold more', variant: 'fold' }, explanation: 'Low key card (4) → double-overs common → fold more. Over-unders (73, 83, 93) fold.' },
          { board: { high: 'K', lowCard: 6, variant: 'orange' }, correct: { label: 'Fold more', variant: 'fold' }, explanation: 'Low key card (6) → double-overs common → fold more. Worst = over-unders to 6.' },
          { board: { high: 'K', paired: true, variant: 'orange' }, correct: { label: 'Defend ~75%', variant: 'call' }, explanation: 'Paired board → organize around the unpaired high card. High-card defending dominates.' },
          { board: { high: 'J', paired: true, variant: 'orange' }, correct: { label: 'Defend ~75%', variant: 'call' }, explanation: 'Paired board → evaluate around the unpaired high card (J). Overcards to J (A/Q/K-high) pure, undercards (T-high and below) start folding.' },
        ]}
      />
      <StrategyQuestions
        title="System 3 — Rules"
        questions={[
          { question: 'What is the fold target for SB 1bb stabs?', options: ['~25% (1/4)', '~50%', '~10%', '~75%'], correct: 0, explanation: 'SB bets 1bb into ~3.7bb. Risk/reward = 1/4 ≈ 25% fold. Defend ~75%.' },
          { question: 'Which board cards should you IGNORE strategically?', options: ['The ace and the deuce', 'The highest card', 'The lowest card', 'The middle card'], correct: 0, explanation: 'Ace and deuce are not strategically relevant. Everything has over/undercards to them. Ignore them.' },
          { question: 'What determines whether you defend wide or fold more?', options: ['The key card (second-highest) — high vs low', 'Whether the board is paired', 'The suit', 'Your stack depth'], correct: 0, explanation: 'High key card (8) → double-overs rare → defend ~75%. Low key card (5) → double-overs common → fold more.' },
          { question: 'What are the three defending mechanisms?', options: ['High-card defending, 3-straight, BDFD', 'Check-raise, donk-lead, call', 'Fold, call, raise', 'Value, bluff, trap'], correct: 0, explanation: 'High-card defending (A-high pure → J-high folds), three to a straight (98/86/65 pure), backdoor flush draw (high card > low).' },
          { question: 'What is the worst hand category on low key-card boards?', options: ['Over-unders (73, 83, 93)', 'Double-overs', 'Paired hands', 'Suited connectors'], correct: 0, explanation: 'Over-unders to a low key card are the worst — fold unless BDFD rescues them.' },
          { question: 'Why is BB defense the highest-impact scenario?', options: ['92 points of opportunity (−112 → −20 bb/100)', 'It happens most often', 'It has the biggest pots', 'UTG has no edge'], correct: 0, explanation: 'Skilled BB goes from −112 bb/100 (walk-away) to −20. UTG only has 27 points. BB skill is definitively most important.' },
        ]}
      />
    </>
  )
}

export default S3Page
