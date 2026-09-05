import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import { flashcards, quizzes } from '../data/content'
import type { HandExample } from '../components/ui'

const examples: HandExample[] = [
  { tag: "Ace-high lockdown", tagVariant: "default", board: <>A<H>♥</H> K<D>♦</D> 5<C>♣</C></>, holeCards: <>BB 20bb · BTN 50bb</>, desc: "Top pair on ace-high", verdict: "agree", verdictText: "System agrees", system: "Pure check-call. ~88-90% equity, board lockdown — no protection needed.", solver: "No check-raise value range → pure check-call top pair." },
  { tag: "Q-high — check-raise", tagVariant: "risk", board: <>Q<S>♠</S> 8<H>♥</H> 3<D>♦</D></>, holeCards: <>K<S>♠</S> Q<H>♥</H> · BB 20bb</>, desc: "Top pair on Q-high, ~85% equity", verdict: "agree", verdictText: "System agrees", system: "Check-raise. K/A turn can outdraw; ace-high same equity doesn't.", solver: "Check-raise ~83-85%+ equity top pairs on Q/J-high." },
  { tag: "High-low-low paired", tagVariant: "risk", board: <>A<C>♣</C> 8<H>♥</H> 8<D>♦</D></>, desc: "A-8-8 (high-low-low) vs A-A-8 (high-high-low)", verdict: "agree", verdictText: "System agrees", system: "A-8-8: check-raise the 8x (BB has the pair). A-A-8: pure check-call (no pair).", solver: "High-low-low gets XR range; high-high-low doesn't." },
  { tag: "BTN range-bet (low)", tagVariant: "default", board: <>8<H>♥</H> 5<D>♦</D> 3<C>♣</C></>, holeCards: <>BTN 50bb covers BB 20bb</>, desc: "Low board, BTN c-bet", verdict: "agree", verdictText: "System agrees", system: "Range bet. BB too tight to connect; XR ~11% (vs ~33% check in chip).", solver: "Low boards become range-bets when covering." },
  { tag: "Monotone connects OOP", tagVariant: "risk", board: <>A<C>♣</C> K<C>♣</C> 8<D>♦</D></>, holeCards: <>BTN covering</>, desc: "Monotone connecting OOP", verdict: "agree", verdictText: "System agrees", system: "Check back some. Connects with OOP's flatting range (K-8, A-8).", solver: "Distinguish from A-5-2♣ which BTN range-bets." },
  { tag: "K-Q-10 — check ~60%", tagVariant: "risk", board: <>K<S>♠</S> Q<H>♥</H> 10<D>♦</D></>, holeCards: <>BTN covering</>, desc: "Middling Broadway rainbow", verdict: "agree", verdictText: "System agrees", system: "Check ~60%. Bet KT+/AK/JT (straight); mix AJ/A10; check A7-A9.", solver: "Strongest teaching hand. Don't mash range." },
  { tag: "Low paired — range bet", tagVariant: "default", board: <>4<C>♣</C> 4<D>♦</D> 3<H>♥</H></>, holeCards: <>BTN covering</>, desc: "Low paired board", verdict: "agree", verdictText: "System agrees", system: "Range bet in ICM. Would check ~33% in chip. BB plays call-or-fold, no XR.", solver: "Low paired boards become range-bets under ICM." },
]

export function BM8Page() {
  return (
    <>
      <Section title="BTN Covers BB — Postflop">
        <p>BTN (50bb) covers BB (20bb) on the bubble. Two sides: BB defense (modules 11) and BTN c-betting (module 12). The covering stack range-bets far more flops than in chip EV; the covered BB check-raises far less and plays protection-oriented.</p>
        <Callout variant="good"><strong>Bet MORE air when covered, not less.</strong> Because BB can't check-raise you, your c-bet frequency goes UP under ICM — the opposite of what most players do.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["BB defense (covered)", "BTN c-bet (covering)"]}
          intro="Board class (row) × side (column). Green = the default action."
          rows={[
            { label: "Ace-high (A-K-x, A-Q-x)", cells: [
              { action: "Pure check-call top pair", sub: "~88-90% equity, lockdown. No protection.", color: "green" },
              { action: "Range bet", sub: "BB has no check-raise value range.", color: "green" },
            ]},
            { label: "Q-high / J-high", cells: [
              { action: "Check-raise ≥83-85%", sub: "K/A turn can outdraw → protection.", color: "orange" },
              { action: "Range bet (or near)", sub: "BB XR only ~5% (vs ~20% chip).", color: "green" },
            ]},
            { label: "Low boards", cells: [
              { action: "Check-shove strong value", sub: "Maximize protection. No small raises.", color: "orange" },
              { action: "Range bet", sub: "BB has near-zero connection. XR ~11%.", color: "green" },
            ]},
            { label: "Paired, high-high-low (A-A-8)", cells: [
              { action: "Pure check-call", sub: "No XR range — BB lacks the pair.", color: "green" },
              { action: "Range bet", sub: "K-K-2/K-K-4 ~95%. K-K-9 checks some.", color: "green" },
            ]},
            { label: "Monotone connecting OOP", cells: [
              { action: "Check-call / check-shove", sub: "Case by case.", color: "orange" },
              { action: "Check back some", sub: "A-K-8♣, A-9-8♣, K-J-3♣, Q-8-3♣.", color: "orange" },
            ]},
            { label: "Middling Broadway (K-Q-10)", cells: [
              { action: "Check-raise some", sub: "Board connects both.", color: "orange" },
              { action: "Check ~60%", sub: "Bet strongest + weakest ace-highs; check mid.", color: "orange" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules — BB Defense (covered)">
        <table>
          <tr><th>Board class</th><th>Default</th></tr>
          <tr><td><strong>Ace-high lockdown</strong></td><td>Pure check-call top pair. ~88-90% equity, no outdraw.</td></tr>
          <tr><td><strong>Q-high / J-high</strong></td><td>Check-raise top pairs ≥83-85% equity. K/A turn can outdraw.</td></tr>
          <tr><td><strong>Low boards</strong></td><td>Check-shove strong value + few semi-bluffs. Maximize protection.</td></tr>
          <tr><td><strong>Paired high-high-low (A-A-8)</strong></td><td>Pure check-call. BB lacks the pair → no XR value.</td></tr>
          <tr><td><strong>Paired high-low-low (A-8-8)</strong></td><td>Check-raise the pair (8x). BB has the pair.</td></tr>
          <tr><td><strong>Turns</strong></td><td>Almost never donk-lead (~≤10%).</td></tr>
          <tr><td><strong>Rivers</strong></td><td>Donk-jam only if opponent under-bluffs; default check.</td></tr>
        </table>
        <Callout variant="bad"><strong>A smaller raise size for IP kills your check-raise range.</strong> When IP can click-raise (not just jam), OOP check-raise freq collapses. Non-all-in check-raises 'really suck in ICM.'</Callout>
      </Section>

      <Section title="Core Rules — BTN C-bet (covering)">
        <h3>Range-bet boards</h3>
        <p>Ace-high (A-K-x, A-Q-x, A-7-x), K-high disconnected (K-9-3, K-J-2, K-4-3), Q-high disconnected, low boards (7-5-2, 8-5-3, 5-3-2), low paired (4-4-3, 6-6-3), high-high-low paired (K-K-2, K-K-4), A-side monotone (A-5-2♣).</p>
        <h3>Check-back boards</h3>
        <p>Middling Broadway rainbow (K-Q-10: ~60% check), high-high-mid paired (K-K-9, K-K-8), monotone connecting OOP (A-K-8♣, A-9-8♣, K-J-3♣, K-9-8♣, Q-8-3♣, J-10-8♣), 10-9-8♣ monotone (~20% check threshold).</p>
      </Section>

      <Section title="Risk Factors / Exceptions (BTN c-bet)">
        <p>In chip EV, BTN c-bet risk factors are: paired boards (high check-raise), low boards (BB doesn't fold enough), monotone boards (check back). In ICM these are largely <strong>neutralized</strong> because BB check-raises far less and BTN has more board coverage.</p>
        <table>
          <tr><th>Remaining risk factor</th><th>Effect</th></tr>
          <tr><td><strong>Monotone connecting OOP</strong></td><td>Check back some (A-K-8♣, K-J-3♣, Q-8-3♣, J-10-8♣).</td></tr>
          <tr><td><strong>Middling Broadway rainbow (K-Q-10)</strong></td><td>~60% check.</td></tr>
          <tr><td><strong>High-high-mid paired (K-K-9)</strong></td><td>Mid card gives BB some pairs → check back.</td></tr>
          <tr><td><strong>Deeper effective stacks</strong></td><td>More reverse implied odds when check-raised; check-back freq rises.</td></tr>
        </table>
        <Callout variant="good"><strong>If you cover by more than ~2x their stack, "closing your eyes and always range-betting" is approximately correct.</strong></Callout>
      </Section>

      <Section title="Sizing">
        <p>BTN c-bet ~quarter pot (~1.8bb into ~5.5bb pot). BB check-raise on low boards: all-in (check-shove), not small. BB check-raise on ace-high: pure check-call — no raise. Equities that flip check-call → check-raise on Q/J-high: ~83-85%+. Equities that stay check-call on ace-high: ~88-90% (lockdown).</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards['bm8']} />
      <QuizSection questions={quizzes['bm8']} />
    </>
  )
}

export default BM8Page
