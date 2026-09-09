import { Section, Callout, Action } from '../components/ui'
import { StrategyQuestions } from '../components/StrategyQuestions'


export function BM3Page() {
  return (
    <>
      <Section title="Opening Into Covering Stacks (You Cover)">
        <p>You cover most/all stacks behind. Open significantly wider than the ICM equal-stack baseline — often 2x+ from EP. Key adjustments: how much you cover and whether the blinds are deep or very short.</p>
        <Callout variant="warn"><strong>Open shoves are heavily underused by regs when covering on the bubble.</strong> When blinds are sub-20-25bb and you cover, open-shove a huge chunk of your range. Defaulting to min-raise/fold with 70-85% of hands leaves massive raise-fold equity on the table.</Callout>

        <h3>Your cover ratio × BB depth</h3>
        <p>Composition shifts with BB stack.</p>
        <table>
          <tr><th></th><th>BB deep (40-68bb)</th><th>BB very short (sub-5bb)</th></tr>
          <tr><td><strong>Cover by 2x+ (BTN)</strong></td><td><Action variant="bet">~75% VPIP</Action> — Low suited connectors, low pairs, suited high-low all OK.</td><td><Action variant="bet">~75% + heavy shoves</Action> — High-card dense, Ax-heavy. Drop speculative for raw equity.</td></tr>
          <tr><td><strong>Cover but close (BTN)</strong></td><td><Action variant="call">~68%</Action> — Dial back — losing leaves you short (7bb).</td><td><Action variant="call">~68% + shoves</Action> — Closer stacks still allow shoves but less freely.</td></tr>
          <tr><td><strong>Cover by 2x+ (UTG)</strong></td><td><Action variant="bet">~35%</Action> — 2x+ baseline. Like a 30bb CO open.</td><td><Action variant="call">~18-20%</Action> — High-card heavy; drop suited connectors.</td></tr>
          <tr><td><strong>Cover but close (UTG)</strong></td><td><Action variant="call">~25-26%</Action> — Wider than baseline; trim thinnest.</td><td><Action variant="call">~13-14%</Action> — Tighter; closer stacks hurt.</td></tr>
        </table>

        <h3>Composition by BB depth (when you cover)</h3>
        <table>
          <tr><th>BB stack</th><th>Open range composition</th></tr>
          <tr><td><strong>Deep (40-68bb)</strong></td><td>Low suited connectors (54s, 76s), suited high-low (Q4s, J7s), lowest pairs (22-33) all acceptable — want playability.</td></tr>
          <tr><td><strong>Mid (26bb)</strong></td><td>Sliver of low pairs, marginal suited connectors, marginal high-low suited.</td></tr>
          <tr><td><strong>Very short (sub-5bb)</strong></td><td>High-card dense, Ace-X heavy. Drop suited connectors and low pairs — want raw equity.</td></tr>
        </table>
        <Callout variant="good"><strong>Being covered by one or two players does NOT mean play tight.</strong> If you cover the rest (especially the BB), you still open wider than baseline. The covering player folds ~80%; you then pressure everyone you cover.</Callout>

        <h3>Risk factors</h3>
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Stacks behind close to yours</strong></td><td>Dial back top-line frequency; losing a pot hurts more.</td></tr>
          <tr><td><strong>Blinds sub-20-25bb</strong></td><td>Heavy open shoving appears. Commonly missed by regs — a major leak.</td></tr>
          <tr><td><strong>Blinds 30bb+</strong></td><td>Little/no open shove; min-raise range.</td></tr>
          <tr><td><strong>Micro stack about to hit blinds (other table)</strong></td><td>Blinds disincentivized to play — ramp up opens.</td></tr>
          <tr><td><strong>Covering and called</strong></td><td>Not a disaster — you still cover; losing the pot doesn't end your tournament.</td></tr>
        </table>

        <h3>Sizing</h3>
        <p>Min-raise when blinds are 30bb+ (fold to reshoves, preserve optionality). Open shove a heavy chunk when blinds are sub-20-25bb — BB calls &lt;10%. UTG baseline ~16.5%; covering by 2x+ expands to ~35%.</p>
      </Section>

      <StrategyQuestions
        title="BM3 — Opening Covering (You Cover)"
        questions={[
          { question: 'What VPIP do you open when covering by 2x+ on BTN with deep blinds?', options: ['~75% (2x+ the baseline)', '~53%', '~16.5%', '~35%'], correct: 0, explanation: 'Covering by 2x+ → open ~75%. More of everything vs 53% baseline. Low suited connectors, low pairs all OK.' },
          { question: 'What is the commonly missed leak when covering short blinds?', options: ['Heavy open shoves are underused (BB calls <10%)', 'Opening too wide', 'Limping too much', 'Not raising enough'], correct: 0, explanation: 'When blinds are sub-20-25bb and you cover, open-shove a huge chunk. Defaulting to min-raise/fold with 70-85% of hands leaves raise-fold equity on the table.' },
          { question: 'What happens when stacks are close (covering but not by much)?', options: ['Dial back (~68%) — losing leaves you short (7bb)', 'Open wider (~80%)', 'No change', 'Open shove everything'], correct: 0, explanation: 'Covering but close: dial to ~68%. Closer stacks hurt more if you lose. Stack gap matters.' },
          { question: 'Does being covered by one or two mean play tight?', options: ['No — if you cover the rest (especially BB), still open wider than baseline', 'Yes — play very tight', 'Always fold', 'Only open premiums'], correct: 0, explanation: 'Covering player folds ~80%; you then pressure everyone you cover. Still wider than baseline.' },
          { question: 'How does BB depth shift composition when you cover?', options: ['Deep BB → playability (suited connectors); very short BB → raw equity (Ax-heavy)', 'Always want playability', 'Always want raw equity', 'No composition shift'], correct: 0, explanation: 'Deep BB: low suited connectors, suited high-low, low pairs. Very short BB: high-card dense, Ax-heavy, drop speculative.' },
          { question: 'What is the UTG baseline when covering by 2x+?', options: ['~35% (like a 30bb CO open in chips)', '~16.5%', '~75%', '~9%'], correct: 0, explanation: 'UTG covering by 2x+ → ~35%. UTG baseline ~16.5%; covering expands it.' },
        ]}
      />
    </>
  )
}

export default BM3Page
