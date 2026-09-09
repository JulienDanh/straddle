import { Section, Callout, Action } from '../components/ui'
import { StrategyQuestions } from '../components/StrategyQuestions'
import { RangePreview } from '../components/RangePreview'


export function BM2Page() {
  return (
    <>
      <Section title="Opening Into Covered Stacks (You Are Covered)">
        <p>A stack (or several) behind covers you. You open much tighter than baseline, with the degree of tightness driven by how much the BB covers you, position of covering stacks, and presence of shorter stacks elsewhere.</p>
        <Callout variant="bad"><strong>Same stack, different range.</strong> 12bb on the button is not static. Into a 53bb BB you open ~20%; into a 16bb BB you open ~28%. The BB's depth, not just yours, drives your range.</Callout>

        <h3>Range visualizations</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <RangePreview title="BTN 12bb · Covered by heaps (53bb BB) · ~20%" range="55+, A2s+, A9o+, ATo+, K9s+, KTo+, Q9s+, QTo+, J9s+, T9s" color="#ef6f6f" />
          <RangePreview title="BTN 12bb · Game of chicken (16bb BB) · ~28%" range="44+, A2s+, A8o+, ATo+, K8s+, KTo+, Q8s+, QTo+, J8s+, JTo, T8s+, 98s, 87s, 76s, 65s" color="#ef6f6f" />
          <RangePreview title="BTN 33bb · Covered (53bb BB) · ~35%" range="33+, A2s+, A7o+, ATo+, K6s+, K9o+, Q8s+, Q9o+, J8s+, J9o+, T8s+, T9o, 98s, 87s, 76s, 65s" color="#ef6f6f" />
          <RangePreview title="UTG 16bb · Covered by most · ~7%" range="77+, AJs+, AQo+, AKs, KQs" color="#ef6f6f" />
          <RangePreview title="UTG 29bb · Covered by most · ~9%" range="66+, ATs+, AJo+, AQs+, AKo, KQs, KJs" color="#ef6f6f" />
        </div>

        <h3>Your stack vs the big blind × cover ratio</h3>
        <table>
          <tr><th></th><th>Covered by heaps (BB 2x+ you)</th><th>Covered but close (game of chicken)</th></tr>
          <tr><td><strong>BTN 9-12bb</strong></td><td><Action variant="fold">~20%</Action> — Fold ~80%. No open shoves. Offsuit Ax very poor.</td><td><Action variant="call">~28%</Action> — More open shoving. BB handicapped by risk.</td></tr>
          <tr><td><strong>BTN 25-30bb</strong></td><td><Action variant="call">Tighter than baseline</Action> — Fringe trims; BB must risk heavily to pressure you.</td><td><Action variant="call">Moderate</Action> — Closer stacks widen slightly.</td></tr>
          <tr><td><strong>BTN 33-40bb</strong></td><td><Action variant="call">~35%</Action> — Don't over-tighten. BB must risk a lot to pressure you.</td><td><Action variant="bet">~35%+</Action> — Forgiving at depth.</td></tr>
          <tr><td><strong>UTG 16-29bb</strong></td><td><Action variant="fold">~7-9%</Action> — Fold nines, AJo, KQo, A9s in some configs.</td><td><Action variant="call">~13-14%</Action> — Covering the BB helps even if covered behind.</td></tr>
        </table>

        <h3>What tightens you</h3>
        <ul>
          <li><strong>BB covers you by heaps:</strong> open very tight — they can destroy you postflop, donk, float.</li>
          <li><strong>Very short / micro stacks at other tables:</strong> tighten (FGS overlay — folding has positive $EV).</li>
          <li><strong>Covered by a massive stack (120bb+) when you're mid:</strong> trim thinnest hands; no wider than ~35% on BTN.</li>
        </ul>
        <h3>What loosens you</h3>
        <ul>
          <li><strong>BB is close to your stack (game of chicken):</strong> you can open a bit more; they risk tournament life playing back.</li>
          <li><strong>You're deeper (30-50bb) and covered:</strong> more forgiving — losing a raise-fold costs &lt;10% of stack.</li>
          <li><strong>You're the shortest at the table:</strong> loosen back up — can't rely on others busting.</li>
        </ul>

        <h3>Risk factors</h3>
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Open-shove hand shift (covered)</strong></td><td>Shift stronger — AQ not AJ. Offsuit Ax shove terribly. Drop A2s/A3s.</td></tr>
          <tr><td><strong>Low pairs (22-33) when covered and short</strong></td><td>Often fold — they block the blinds' pair-folds, hurting your fold equity.</td></tr>
          <tr><td><strong>Covered by one but cover the rest</strong></td><td>Still wider than baseline — covering player folds ~80%; you pressure the rest.</td></tr>
          <tr><td><strong>FGS: short stacks at other tables</strong></td><td>Tighten further — folding has positive $EV when others may bust before you.</td></tr>
        </table>
        <Callout><strong>Folding is not zero EV on the bubble.</strong> With shorter stacks elsewhere, folding has positive $EV — and you get free hands coming next. This makes the thinnest opens pass.</Callout>

        <h3>Sizing</h3>
        <p>Min-raise dominant when covered (preserve tournament life, fold to reshoves). Open shoves drop sharply — and shift stronger (AQ, not AJ) when they do appear. BB 3-bet size vs a covering opener can be large/polar (~14bb) to deny price with Ax.</p>
      </Section>

      <StrategyQuestions
        title="BM2 — Opening Covered (You Are Covered)"
        questions={[
          { question: 'What drives your open range when covered?', options: ['How much the BB covers you, position of covering stacks, shorter stacks elsewhere', 'Your absolute stack only', 'Your hand strength only', 'The blinds'], correct: 0, explanation: 'Same stack, different range. 12bb BTN into 53bb BB → ~20%; into 16bb BB → ~28%. The BB\'s depth drives your range.' },
          { question: 'What VPIP do you open at 12bb BTN into a 53bb BB (covered by heaps)?', options: ['~20% — almost no open shoves, offsuit Ax very poor', '~35%', '~9%', '~50%'], correct: 0, explanation: 'Covered by heaps → ~20%. Cut low pairs, worst Ax. Common leak: autopilot shoving K7s/T9s/KTo.' },
          { question: 'What happens at 30-40bb covered?', options: ['Don\'t over-tighten — ~35%. BB must risk a lot to pressure you', 'Play very tight ~9%', 'Open shove everything', 'Fold most hands'], correct: 0, explanation: 'Common leak: way too tight at 30-40bb covered. Losing a raise-fold costs <10% of stack. Still ~35%.' },
          { question: 'What is the "game of chicken" dynamic?', options: ['Close stacks → BB handicapped by risk → you open wider (~28%)', 'You fold everything', 'You jam every hand', 'You limp'], correct: 0, explanation: 'BTN 12bb vs BB 16bb: BB risks tournament life playing back. You open wider with more open-shoving.' },
          { question: 'What is the common leak at 12bb covered?', options: ['Autopilot shoving K7s/T9s/KTo (too wide for covered stacks)', 'Over-tightening', 'Limping too much', 'Not shoving enough'], correct: 0, explanation: 'Covered short → offsuit Ax very poor, almost no open shoves. Autopilot shoving suited connectors/broadways is a leak.' },
          { question: 'What is the dominant sizing when covered?', options: ['Min-raise (preserve tournament life, fold to reshoves)', 'Open-shove', 'Limp', '3x raise'], correct: 0, explanation: 'Min-raise dominant when covered. Open shoves drop sharply and shift stronger (AQ, not AJ) when they appear.' },
        ]}
      />
    </>
  )
}

export default BM2Page
