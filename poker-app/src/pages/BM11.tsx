import { Section, Callout, Code, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import { flashcards, quizzes } from '../data/content'
import type { HandExample } from '../components/ui'

const examples: HandExample[] = [
  { tag: "Monotone — range check", tagVariant: "risk", board: <>7<H>♥</H> 6<H>♥</H> 5<H>♥</H></>, holeCards: <>BTN 12bb polar · BB 16bb</>, desc: "Monotone, BTN lacks flushes", verdict: "agree", verdictText: "System agrees", system: "Check back (hearts mandatory). BTN open-shoves suited pre → lacks flushes.", solver: "Range check (65-82%+). BB can have any flush." },
  { tag: "Two-tone adds jam", tagVariant: "risk", board: <>K<S>♠</S> 5<S>♠</S> 4<H>♥</H></>, holeCards: <>BTN 12bb · BB 16bb</>, desc: "Two-tone vs rainbow", verdict: "agree", verdictText: "System agrees", system: "Check slightly more (~57%) + add flop jams. Stop check-shoves with bare FDs.", solver: "Rainbow ~50% check. Two-tone ~57% check + jam sizing." },
  { tag: "Dry ace-high — 40%", tagVariant: "default", board: <>A<S>♠</S> Q<D>♦</D> 4<C>♣</C></>, holeCards: <>BTN 12bb · BB 16bb</>, desc: "Dry ace-high", verdict: "agree", verdictText: "System agrees", system: "Bet 40% (not quarter pot). Deny gutshot equity. If check-raise → jam over.", solver: "Larger size on dry ace-high than standard." },
  { tag: "Tighter range → range bet (deep BB)", tagVariant: "default", board: <>J<C>♣</C> 5<D>♦</D> 4<S>♠</S></>, holeCards: <>BTN 12bb · BB 53bb (dry)</>, desc: "Dry board vs deep BB", verdict: "agree", verdictText: "System agrees", system: "Range bet. Tighter range = more top pair/overpair/set, less air.", solver: "vs 16bb: check ~50%. vs 53bb: range bet (BB checks pure)." },
  { tag: "6-6-2 range bet vs 6-6-5 check", tagVariant: "risk", board: <>6<D>♦</D> 6<S>♠</S> 2<C>♣</C></>, holeCards: <>BTN 12bb · BB 16bb</>, desc: "Low paired dry vs low paired + draws", verdict: "agree", verdictText: "System agrees", system: "6-6-2: range bet (BB underrepresented, no draws). 6-6-5: check ~40% (draws flip it).", solver: "Draws flip the strategy on paired boards." },
  { tag: "J-10-7 two-tone — overpair jam", tagVariant: "risk", board: <>J<S>♠</S> 10<H>♥</H> 7<H>♥</H></>, holeCards: <>Q<D>♦</D> 10<D>♦</D> vs A<C>♣</C> 10<S>♠</S></>, desc: "Overpair hierarchy on two-tone", verdict: "agree", verdictText: "System agrees", system: "Queens jam most, Kings less, Aces pure check. Nut traps; weaker protects.", solver: "Aces almost pure-check; Queens jam the most. Inverted from 'bet your strong hands.'" },
  { tag: "Q10 — universal flop shove", tagVariant: "default", board: <>Various textures</>, holeCards: <>Q<D>♦</D> 10<C>♣</C> · 10-12bb</>, desc: "The universal flop-shove hand", verdict: "agree", verdictText: "System agrees", system: "Q10 jams across many textures at 10-12bb post polar open.", solver: "Recurring pattern. If you remember one bluff combo, remember Q10." },
]

export function BM11Page() {
  return (
    <>
      <Section title="Polar Opens & Split-Range C-Betting (Short Stacks)">
        <p>BTN opens a polar split range (min-raise + open-jam) at ~12bb effective on the direct bubble. Postflop strategy is dominated by checking far more than in chip models, with flop jams appearing on draw-heavy textures. When BB covers by heaps (53bb), BTN opens tighter/stronger, which paradoxically allows more c-betting on dry boards.</p>
        <Callout variant="warn"><strong>You check MORE when covered in ICM, not less.</strong> The instinct to "bet to protect your hand" is backwards — you protect your tournament equity by checking. Chip model range-bets become check-backs.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["vs shallow BB (16bb)", "vs deeper BB (53bb)"]}
          intro="Board class (row) × BB depth (column). Green = bet, red = check."
          rows={[
            { label: "Monotone", cells: [
              { action: "Range check (65-82%+)", sub: "BTN lacks flushes (shoves suited pre).", color: "red" },
              { action: "Range check", sub: "Same. If BB under-leads: range check.", color: "red" },
            ]},
            { label: "Dry ace-high (AQ4)", cells: [
              { action: "Bet 40%", sub: "Deny gutshots. Not quarter pot.", color: "green" },
              { action: "Bet 40%", sub: "Same; BTN has Ax.", color: "green" },
            ]},
            { label: "Dry board (J-5-4)", cells: [
              { action: "Check ~50%", sub: "BB leads 40%; game of chicken.", color: "orange" },
              { action: "Range bet", sub: "Tighter range = more value, less air.", color: "green" },
            ]},
            { label: "Two-tone", cells: [
              { action: "Check more + add jams", sub: "Stop check-shoves with bare FDs.", color: "orange" },
              { action: "Check more + add jams", sub: "Same # jam combos, larger share of tighter range.", color: "orange" },
            ]},
            { label: "Low paired dry (6-6-2)", cells: [
              { action: "Range bet", sub: "BB underrepresented on the deuce.", color: "green" },
              { action: "Range bet", sub: "Same.", color: "green" },
            ]},
            { label: "Low paired + draws (6-6-5)", cells: [
              { action: "Check ~40%", sub: "Draws flip the strategy.", color: "red" },
              { action: "Check", sub: "Same.", color: "red" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules">
        <h3>Preflop range tiers (12bb BTN polar open)</h3>
        <table>
          <tr><th>Tier</th><th>Action</th><th>Shift vs deeper BB (53bb)</th></tr>
          <tr><td><strong>Value jam</strong></td><td>Open shove JJ+, AQs, some AKo</td><td>AK pure shove; AQ, AJ, A9s join</td></tr>
          <tr><td><strong>Semi-value min-raise</strong></td><td>A10s–A8s, suited Broadway, offsuit Broadway</td><td>Bluffs shift up: QJ, K10 raise-folds</td></tr>
          <tr><td><strong>Raise-fold Ax</strong></td><td>A4o–A8o, some suited aces</td><td>Worst Axo shove = A8o (vs A4o)</td></tr>
          <tr><td><strong>Folds</strong></td><td>Weak suited connectors, low offsuit</td><td>J9s, T9s barely make the cut</td></tr>
        </table>
        <Callout variant="good"><strong>Open TIGHTER into the deeper stack, but the BB defends WIDER.</strong> Tighter range + wider defender. The 53bb BB has less ICM risk and can get out of line. BB 3-bets blocker-heavy (Kxs, Axs, Axo) and small-3-bets AJ offsuit.</Callout>
        <h3>C-bet defaults (vs shallow BB, 16bb)</h3>
        <ul>
          <li><strong>Ace-high dry (AQ4):</strong> bet 40% (deny gutshots).</li>
          <li><strong>A-high two-tone (AK5tt, AQ2tt):</strong> jam (~2x pot) + check to deny flush-draw equity.</li>
          <li><strong>Monotone:</strong> range check (65-82%+) — BTN lacks flushes.</li>
          <li><strong>Low paired dry (6-6-2):</strong> range bet (BB underrepresented).</li>
          <li><strong>Low paired + draws (6-6-5):</strong> check ~40% (draws flip it).</li>
          <li><strong>Connected mid (10-9-8):</strong> heavy check, jam-or-check (75-80%).</li>
        </ul>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Risk factor</th><th>Effect</th></tr>
          <tr><td><strong>Paired boards (non-connected)</strong></td><td>BB check-raises more; over-c-betting is a leak. Amplified in ICM.</td></tr>
          <tr><td><strong>Monotone flops</strong></td><td>BTN's preflop suited shoves → limited flushes; BB has every flush. Ace-high monotone worst.</td></tr>
          <tr><td><strong>Two-tone flops</strong></td><td>Check-raise + flip vs flush draw is an ICM disaster. Check more; use jams to deny equity.</td></tr>
          <tr><td><strong>Draws present generally</strong></td><td>Open-enders, gutshots for BB → more checking, more jam sizing.</td></tr>
          <tr><td><strong>Higher paired card (A99 vs A77)</strong></td><td>Higher paired card = more BB coverage (J9, T9 vs J7) = more checking.</td></tr>
        </table>
        <Callout variant="warn"><strong>Weaker aces jam as semi-bluffs; stronger aces check.</strong> A4s/A5s shove the flop; A7 (can make a good pair) checks back. The hand with less showdown value is the bluff.</Callout>
      </Section>

      <Section title="Sizing">
        <p>Standard c-bet <Code>~25% pot</Code> (quarter pot). Dry ace-high (AQ4-type): <Code>~40%</Code> to deny gutshots. Flop jam: <Code>~10bb into ~5.5bb</Code> (~1.8x pot, slightly less than 2x). Jams appear on two-tone, connected, flush-draw boards. Open-jam threshold (Axo) shifts up: <Code>A4o</Code> (16bb) → <Code>A8o</Code> (53bb).</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards['bm11']} />
      <QuizSection questions={quizzes['bm11']} />
    </>
  )
}

export default BM11Page
