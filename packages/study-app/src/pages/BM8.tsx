import { Section, Callout, Action, Tabs, Collapsible } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function BM8Page() {
  return (
    <Section title="BTN Covers BB — Postflop">
      <p>BTN (50bb) covers BB (20bb) on the bubble. Two sides: BB defense (modules 11) and BTN c-betting (module 12). The covering stack range-bets far more flops than in chip EV; the covered BB check-raises far less and plays protection-oriented.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Callout variant="good"><strong>Bet MORE air when covered, not less.</strong> Because BB can't check-raise you, your c-bet frequency goes UP under ICM — the opposite of what most players do.</Callout>
              
                      <h3>Board class × side</h3>
<table>
                        <tr><th>Board class</th><th>BB defense (covered)</th><th>BTN c-bet (covering)</th></tr>
                        <tr><td><strong>Ace-high (A-K-x, A-Q-x)</strong></td><td><Action variant="call">Pure check-call top pair</Action> — ~88-90% equity, lockdown. No protection.</td><td><Action variant="bet">Range bet</Action> — BB has no check-raise value range.</td></tr>
                        <tr><td><strong>Q-high / J-high</strong></td><td><Action variant="raise">Check-raise 80%+</Action> — K/A turn can outdraw → protection.</td><td><Action variant="bet">Range bet (or near)</Action> — BB XR only ~5% (vs ~20% chip).</td></tr>
                        <tr><td><strong>Low boards</strong></td><td><Action variant="raise">Check-shove strong value</Action> — Maximize protection. No small raises.</td><td><Action variant="bet">Range bet</Action> — BB has near-zero connection. XR ~11%.</td></tr>
                        <tr><td><strong>Paired, high-high-low (A-A-8)</strong></td><td><Action variant="call">Pure check-call</Action> — No XR range — BB lacks the pair.</td><td><Action variant="bet">Range bet</Action> — K-K-2/K-K-4 ~95%. K-K-9 checks some.</td></tr>
                        <tr><td><strong>Monotone connecting OOP</strong></td><td><Action variant="raise">Check-call / check-shove</Action> — Case by case.</td><td><Action variant="check">Check back some</Action> — A-K-8♣, A-9-8♣, K-J-3♣, Q-8-3♣.</td></tr>
                        <tr><td><strong>Middling Broadway (K-Q-10)</strong></td><td><Action variant="raise">Check-raise some</Action> — Board connects both.</td><td><Action variant="check">Check ~60%</Action> — Bet strongest + weakest ace-highs; check mid.</td></tr>
                      </table><Collapsible title="Core Rules — BB Defense (covered)">
              <table>
                        <tr><th>Board class</th><th>Default</th></tr>
                        <tr><td><strong>Ace-high lockdown</strong></td><td>Pure check-call top pair. ~88-90% equity, no outdraw.</td></tr>
                        <tr><td><strong>Q-high / J-high</strong></td><td>Check-raise top pairs with 80%+ equity. K/A turn can outdraw.</td></tr>
                        <tr><td><strong>Low boards</strong></td><td>Check-shove strong value + few semi-bluffs. Maximize protection.</td></tr>
                        <tr><td><strong>Paired high-high-low (A-A-8)</strong></td><td>Pure check-call. BB lacks the pair → no XR value.</td></tr>
                        <tr><td><strong>Paired high-low-low (A-8-8)</strong></td><td>Check-raise the pair (8x). BB has the pair.</td></tr>
                        <tr><td><strong>Turns</strong></td><td>Almost never donk-lead (~≤10%).</td></tr>
                        <tr><td><strong>Rivers</strong></td><td>Donk-jam only if opponent under-bluffs; default check.</td></tr>
                      </table>
                      <Callout variant="bad"><strong>A smaller raise size for IP kills your check-raise range.</strong> When IP can click-raise (not just jam), OOP check-raise freq collapses. Non-all-in check-raises 'really suck in ICM.'</Callout>
              </Collapsible><Collapsible title="Core Rules — BTN C-bet (covering)">
              <p><strong>Range-bet boards:</strong> Ace-high (A-K-x, A-Q-x, A-7-x), K-high disconnected (K-9-3, K-J-2, K-4-3), Q-high disconnected, low boards (7-5-2, 8-5-3, 5-3-2), low paired (4-4-3, 6-6-3), high-high-low paired (K-K-2, K-K-4), A-side monotone (A-5-2♣).</p>
                      <p><strong>Check-back boards:</strong> Middling Broadway rainbow (K-Q-10: ~60% check), high-high-mid paired (K-K-9, K-K-8), monotone connecting OOP (A-K-8♣, A-9-8♣, K-J-3♣, K-9-8♣, Q-8-3♣, J-10-8♣), 10-9-8♣ monotone (~20% check threshold).</p>
              </Collapsible><Collapsible title="Risk Factors (BTN c-bet)">
              <p>In chip EV, BTN c-bet risk factors are: paired boards (high check-raise), low boards (BB doesn't fold enough), monotone boards (check back). In ICM these are largely <strong>neutralized</strong> because BB check-raises far less and BTN has more board coverage.</p>
                      <table>
                        <tr><th>Remaining risk factor</th><th>Effect</th></tr>
                        <tr><td><strong>Monotone connecting OOP</strong></td><td>Check back some (A-K-8♣, K-J-3♣, Q-8-3♣, J-10-8♣).</td></tr>
                        <tr><td><strong>Middling Broadway rainbow (K-Q-10)</strong></td><td>~60% check.</td></tr>
                        <tr><td><strong>High-high-mid paired (K-K-9)</strong></td><td>Mid card gives BB some pairs → check back.</td></tr>
                        <tr><td><strong>Deeper effective stacks</strong></td><td>More reverse implied odds when check-raised; check-back freq rises.</td></tr>
                      </table>
                      <Callout variant="good"><strong>If you cover by more than ~2x their stack, "closing your eyes and always range-betting" is approximately correct.</strong></Callout>
              </Collapsible><Collapsible title="Sizing">
              <p>BTN c-bet ~quarter pot (~1.8bb into ~5.5bb pot). BB check-raise on low boards: all-in (check-shove), not small. BB check-raise on ace-high: pure check-call — no raise. Equities that flip check-call → check-raise on Q/J-high: ~80%+. Equities that stay check-call on ace-high: ~88-90% (lockdown).</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="BTN Covers BB — Practice"
              quiz={{
                options: [
                  { label: 'Range bet', variant: 'bet' },
                  { label: 'Check back', variant: 'check' },
                  { label: 'Check-raise (BB)', variant: 'raise' },
                ],
                scenarios: [
                  { board: { high: 'A', variant: 'green' }, correct: { label: 'Range bet', variant: 'bet' }, explanation: 'Ace-high (AKx, AQx): BB has no check-raise value range → range bet. (BB defense: pure check-call, ~88-90% equity lockdown.)' },
                  { board: { high: 'K', variant: 'green' }, correct: { label: 'Range bet', variant: 'bet' }, explanation: 'K-high disconnected → range bet. BB XR only ~5% (vs ~20% chip). Bet MORE air when covered.' },
                  { board: { high: '9', variant: 'green' }, correct: { label: 'Range bet', variant: 'bet' }, explanation: 'Low boards → range bet. BB has near-zero connection. XR ~11%.' },
                  { board: { high: '9', paired: true, variant: 'green', label: 'Low paired (443)' }, correct: { label: 'Range bet', variant: 'bet' }, explanation: 'Low paired → range bet in ICM (would check ~33% in chip). BB plays call-or-fold, no XR.' },
                  { board: { high: 'K', connected: true, variant: 'orange' }, correct: { label: 'Check back', variant: 'check' }, explanation: 'Middling Broadway (KQ10) → check ~60%. Bet KT+/AK/JT (straight); mix AJ/A10; check A7-A9.' },
                  { board: { high: 'A', suit: 'monotone', variant: 'orange' }, correct: { label: 'Check back', variant: 'check' }, explanation: 'Monotone connecting OOP (AK8♣, A98♣, KJ3♣) → check back some. Connects with BB\'s flatting range.' },
                  { board: { high: 'Q', variant: 'orange' }, correct: { label: 'Check-raise (BB)', variant: 'raise' }, explanation: 'Q/J-high: BB check-raises top pairs with 80%+ equity. K/A turn can outdraw → protection.' },
                ],
              }}
              questions={[
                { question: 'What is the counter-intuitive ICM c-bet rule?', options: ['Bet MORE air when covered, not less', 'Bet less air when covered', 'No change', 'Always check'], correct: 0, explanation: 'BB can\'t check-raise you (no value XR range), so c-bet frequency goes UP. The opposite of what most players do.' },
                { question: 'What does BB do with top pair on ace-high?', options: ['Pure check-call (~88-90% equity, lockdown)', 'Check-raise', 'Fold', 'Donk-lead'], correct: 0, explanation: 'No outdraw → no protection needed. Pure check-call. Board lockdown.' },
                { question: 'What does BB do with top pair on Q-high/J-high?', options: ['Check-raise with 80%+ equity (K/A turn can outdraw)', 'Pure check-call', 'Fold', 'Donk-lead'], correct: 0, explanation: 'Q/J-high top pairs: check-raise for protection with 80%+ equity. K/A turn can outdraw. Ace-high same equity doesn\'t.' },
                { question: 'What is the difference between A-8-8 and A-A-8 (paired)?', options: ['A-8-8 (high-low-low) → check-raise the 8x; A-A-8 (high-high-low) → pure check-call', 'Both check-call', 'Both check-raise', 'Both fold'], correct: 0, explanation: 'High-low-low: BB has the pair → XR range. High-high-low: BB lacks the pair → pure check-call.' },
                { question: 'When covering by more than ~2x, what is approximately correct?', options: ['"Closing your eyes and always range-betting"', 'Always check', 'Only bet strong hands', 'Bet 25% pot'], correct: 0, explanation: 'If you cover by more than ~2x their stack, always range-betting is approximately correct. BB\'s tight defense lacks coverage.' },
                { question: 'What is the BTN c-bet sizing?', options: ['~quarter pot (~1.8bb into ~5.5bb)', 'Pot-sized', 'Overbet', 'All-in'], correct: 0, explanation: 'BTN c-bet ~quarter pot. BB check-raise on low boards: all-in (check-shove), not small.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default BM8Page
