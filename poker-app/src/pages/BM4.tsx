import { Section, Callout, Action } from '../components/ui'
import { StrategyQuestions } from '../components/StrategyQuestions'


export function BM4Page() {
  return (
    <>
      <Section title="Blind vs Blind on the Bubble">
        <p>SB vs BB, one stack covers the other. The covered stack plays very tight (shove/fold, almost no limping short); the covering stack leverages chip advantage with aggressive open-shoving and raising to deny free equity. Limping only reappears at ~18bb+ effective and especially deeper.</p>
        <Callout variant="bad"><strong>Limping is a MISTAKE when you cover a short stack on the bubble.</strong> BB overfolds ~85%. Limping gives free equity realization to hands that would fold to a shove. Shove/raise instead.</Callout>

        <h3>Stack situation × who covers</h3>
        <table>
          <tr><th></th><th>SB covers BB</th><th>SB covered by BB</th></tr>
          <tr><td><strong>Short (≤12bb)</strong></td><td><Action variant="bet">Aggressive shove/raise</Action> — No limps. BB overfolds ~85%.</td><td><Action variant="fold">Tight shove/fold</Action> — ~33% VPIP. No limps. Folding has value.</td></tr>
          <tr><td><strong>Close (14-17bb)</strong></td><td><Action variant="bet">High VPID</Action> — Game of chicken; more open-shoving.</td><td><Action variant="call">Wider VPID</Action> — Game of chicken; BB can't defend wide.</td></tr>
          <tr><td><strong>Deeper (18-22bb)</strong></td><td><Action variant="call">More raising, some limps</Action> — Less ISO leverage for BB.</td><td><Action variant="call">Limping begins</Action> — ~18bb threshold. Raise-fold marginal.</td></tr>
          <tr><td><strong>Deep (37+bb)</strong></td><td><Action variant="bet">Lots of limps</Action> — BB can't pile; SB limp range weak/uncapped.</td><td><Action variant="bet">Pure limp</Action> — BB ISO ~49.5%. No limp-shove — limp-call pairs.</td></tr>
        </table>

        <h3>Core rules</h3>
        <table>
          <tr><th>Rule</th><th>Detail</th></tr>
          <tr><td><strong>BB calls only ~10-22%</strong></td><td>vs ~37% call rate in chip model. ICM pressure roughly halves BB call frequency.</td></tr>
          <tr><td><strong>Open-shove selection shifts UP in ICM</strong></td><td>Drop A2s/A3s; threshold shifts past AJo to AQo. Bluffs shift up with value.</td></tr>
          <tr><td><strong>Limp-shove disappears at 40+bb</strong></td><td>Limp-call pairs instead — BB can't pile vs uncapped, trapping range.</td></tr>
          <tr><td><strong>Covering SB at ~22bb</strong></td><td>Shove vs limp depends on other-table ICM pressure. More pressure = more shoving.</td></tr>
        </table>

        <h3>Risk factors</h3>
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Other-table short stacks</strong></td><td>Covering SB leans harder into shoving/raising (max ICM pressure on BB).</td></tr>
          <tr><td><strong>BB call frequency</strong></td><td>BB calls only ~10-22% when covered (vs ~37% in chip model). Limping gives free equity to folders.</td></tr>
          <tr><td><strong>At 25% field left</strong></td><td>Limping reappears for covered short stacks; on direct bubble, gone.</td></tr>
        </table>

        <h3>Sizing</h3>
        <p>Short covered: pure shove/fold. Close stacks: more open-shoving. Deeper covered (~18bb+): limping begins. Deep (37+bb): pure limp, no limp-shove — limp-call pairs. BB ISO ~49.5% (vs 42% chips) when SB is covered deep.</p>
      </Section>

      <StrategyQuestions
        title="BM4 — Blind vs Blind Rules"
        questions={[
          { question: 'Why is limping a mistake when you cover a short BB on the bubble?', options: ['BB overfolds ~85% — limping gives free equity to folders', 'BB calls too much', 'You lose the pot', 'Limping is always bad'], correct: 0, explanation: 'BB overfolds ~85% vs ~37% in chip model. Limping gives free equity realization to hands that would fold to a shove. Shove/raise instead.' },
          { question: 'What does the covering short stack do vs a short BB?', options: ['Pure shove/raise, no limps', 'Limp everything', 'Min-raise only', 'Fold'], correct: 0, explanation: 'Covering short stack: aggressive shove/raise. No limps. BB overfolds ~85%.' },
          { question: 'What does the covered short stack do on the direct bubble?', options: ['Tight shove/fold (~33% VPID), no limps', 'Limp wide', 'Open shove 70%', 'Fold everything'], correct: 0, explanation: 'Covered short: no limps, tight shove/fold ~33% VPIP. Limping reappears at 25% field left, gone on direct bubble.' },
          { question: 'At what stack depth does limping begin (covered)?', options: ['~18bb', '~10bb', '~25bb', '~40bb'], correct: 0, explanation: '~18bb is the threshold. Limping begins; raise-fold marginal. Deeper = more limping.' },
          { question: 'What happens at 37+bb covered (deep)?', options: ['Pure limp, no limp-shove — limp-call pairs', 'Open shove', 'Min-raise fold', '3-bet'], correct: 0, explanation: 'Deep: pure limp. BB ISO ~49.5%. No limp-shove at 40+bb — limp-call pairs. BB can\'t pile vs uncapped, trapping range.' },
          { question: 'How does ICM pressure affect BB fold frequency in BvB?', options: ['BB calls only ~10-22% in ICM vs ~37% in chip model', 'No effect', 'BB calls less', 'BB never folds'], correct: 0, explanation: 'BB calls only ~10-22% when covered (78-90% fold), vs ~37% call rate in chip model. ICM pressure roughly halves BB call frequency.' },
        ]}
      />
    </>
  )
}

export default BM4Page
