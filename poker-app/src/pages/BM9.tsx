import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import { flashcards, quizzes } from '../data/content'
import type { HandExample } from '../components/ui'

const examples: HandExample[] = [
  { tag: "BB leads low (covering)", tagVariant: "default", board: <>5<S>♠</S> 5<H>♥</H> 4<D>♦</D></>, holeCards: <>BB covers BTN ~2x</>, desc: "Low paired board, BB covering", verdict: "agree", verdictText: "System agrees", system: "Lead near-range when covering (~85%). Stacks reversed, actions reversed.", solver: "Near-range lead. When BTN covers instead → no leads (BB lacks 5x)." },
  { tag: "J-J-2 check-raise heavy", tagVariant: "risk", board: <>J<C>♣</C> J<D>♦</D> 2<S>♠</S></>, holeCards: <>BB covers 2:1</>, desc: "High paired board, BB covering", verdict: "agree", verdictText: "System agrees", system: "Heavy check-raise, minimal check-call. Near check-raise-or-fold.", solver: "More check-calls appear on J-J-9 two-tone, not J-J-2." },
  { tag: "Front-load overbet", tagVariant: "default", board: <>A<C>♣</C> Q<S>♠</S> 2<D>♦</D></>, holeCards: <>A<D>♦</D> J<D>♦</D> · BTN covered</>, desc: "A-Q-2 rainbow, covered BTN", verdict: "agree", verdictText: "System agrees", system: "Polar ~105% overbet + check (no small bet). Folds out gutters (5-4, 4-3).", solver: "Front-load: clean turns for value. No open-ender, no flush draw." },
  { tag: "FD kills overbet", tagVariant: "risk", board: <>A<C>♣</C> Q<C>♣</C> 2<D>♦</D></>, desc: "Same A-Q-2 but two-tone with FD", verdict: "agree", verdictText: "System agrees", system: "Overbet OFF the table. Don't want bet-call vs drawing stacks-in.", solver: "Reverts to small/check when flush draw present." },
  { tag: "Protection jam", tagVariant: "default", board: <>9<S>♠</S> 6<H>♥</H> 3<D>♦</D></>, holeCards: <>T<D>♦</D> T<C>♣</C> · BTN covered</>, desc: "Low disconnected, covered BTN", verdict: "agree", verdictText: "System agrees", system: "Jam ~118% pot for protection. Bet-calling lets BB CR draws and stack you.", solver: "Protection > induction. Jam tens on low disconnected." },
  { tag: "Non-all-in river", tagVariant: "risk", board: <>J<S>♠</S> 9<S>♠</S> flush · river 25% block</>, holeCards: <>BTN covered · wants to raise</>, desc: "River raise sizing", verdict: "agree", verdictText: "System agrees", system: "Raise to ~50% of remaining, non-all-in. Leave equity behind.", solver: "Never jam when you can avoid it. Same sizing for value and bluffs." },
  { tag: "Monotone — check ~50%", tagVariant: "risk", board: <>A<D>♦</D> 5<D>♦</D> 3<D>♦</D></>, holeCards: <>BTN covered</>, desc: "Monotone when covered", verdict: "agree", verdictText: "System agrees", system: "~50% check. Range bet when covering; passive when covered.", solver: "BTN lacks flushes post polar open vs BB who has any flush." },
]

export function BM9Page() {
  return (
    <>
      <Section title="BB Covers BTN — Postflop">
        <p>BB is the big/covering stack, BTN is the shorter/covered stack. Two sides: BB defense (module 13) and BTN c-betting (modules 13-14). The dynamic flips from BTN-covers-BB: BB donk-leads low and paired boards; BTN c-bets far less and develops real check-back ranges.</p>
        <Callout variant="warn"><strong>Stacks reversed, actions reversed.</strong> Boards that are range-bet for BTN when BTN covers become range-CHECK when BB covers BTN. The side with the connecting hands flips.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["BB defense (covering)", "BTN c-bet (covered)"]}
          intro="Board class (row) × side (column). Green = default action."
          rows={[
            { label: "Low / paired (5-5-4, 6-6-2)", cells: [
              { action: "Lead near-range", sub: "Covering by ~1.5-2x+. Doesn't exist in chip-EV.", color: "green" },
              { action: "Check back high freq (>50%)", sub: "BB has the low cards; BTN lacks backup.", color: "red" },
            ]},
            { label: "High paired (J-J-2)", cells: [
              { action: "Check-raise heavy", sub: "Minimal check-call. Near CR-or-fold.", color: "green" },
              { action: "Check back ~70%", sub: "BB check-raises ~10.5% aggressively.", color: "red" },
            ]},
            { label: "Ace-Broadway-Broadway (A-K-Q)", cells: [
              { action: "Defend normally", sub: "BB doesn't have the connecting hands.", color: "orange" },
              { action: "Range bet / near-range", sub: "A-K-Q, A-K-J, A-K-T, A-Q-T, A-J-T.", color: "green" },
            ]},
            { label: "A-Q-2 (no OESD, no FD)", cells: [
              { action: "Check-call mostly", sub: "BTN polar overbet.", color: "orange" },
              { action: "Polar ~105% overbet + check", sub: "Front-load: fold out gutters. No small bet.", color: "green" },
            ]},
            { label: "Monotone", cells: [
              { action: "Lead / check-raise", sub: "BB can have any flush.", color: "orange" },
              { action: "~50% check", sub: "BTN lacks flushes (shoves suited pre).", color: "red" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules — BB Defense (covering)">
        <table>
          <tr><th>Board type</th><th>BB action</th></tr>
          <tr><td><strong>Low boards (5-5-4, 6-6-4, 7-7-2, 8-high)</strong></td><td>Lead near-range / pure when covering by ~1.5-2x+.</td></tr>
          <tr><td><strong>Mid-low disconnected (J-6-4, J-7-5, Q-7-6)</strong></td><td>Small lead (~13-22%) — not pure, but exists (not in chip-EV).</td></tr>
          <tr><td><strong>High paired (J-J-2)</strong></td><td>Check-raise heavy, minimal check-call. Near CR-or-fold.</td></tr>
          <tr><td><strong>Boards BTN smashed (BTN covers BB)</strong></td><td>No leads — BB doesn't have the connecting hands.</td></tr>
        </table>
        <Callout variant="bad"><strong>Never all-in on the river when you can avoid it.</strong> Polar river spots → raise non-all-in, leave chips behind. You're maximizing tournament equity, not chips. Losing your stack on a thin value raise is a disproportionate ICM error.</Callout>
      </Section>

      <Section title="Core Rules — BTN C-bet (covered)">
        <h3>Still range-bet</h3>
        <p>Ace-Broadway-Broadway: A-K-Q, A-K-J, A-K-T, A-Q-T, A-J-T.</p>
        <h3>Develop check-back range</h3>
        <p>Low boards, low-paired (5-5-4, 6-6-2, 3-3-K) → check back high freq (&gt;50%). Monotone → ~50% check. K-6-2 → check back a lot (BB has low cards; BTN lacks backup). A-J-8 and below → check-back range incl. some top pair.</p>
        <h3>Front-load overbet</h3>
        <p>A-Q-2-type disconnected boards with gutshots but no open-enders and no flush draw: polar ~105% overbet + check (no small bet). Folds out 5-4/4-3 so turns are clean value bets.</p>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Risk factor</th><th>Effect</th></tr>
          <tr><td><strong>Open-ended straight draws on board</strong></td><td>Kills the front-loading overbet (can't fold out open-enders).</td></tr>
          <tr><td><strong>Flush draw / two-tone board</strong></td><td>Kills the front-load (don't want bet-call vs FD stacks-in).</td></tr>
          <tr><td><strong>BB leading the open-ender combos</strong></td><td>Can restore the overbet (those combos removed from BB's check-call).</td></tr>
          <tr><td><strong>Opponent under-leads low boards</strong></td><td>BTN checks back range (pure) — exploit, not GTO mix.</td></tr>
          <tr><td><strong>Blocker sensitivity in bluff-catching</strong></td><td>Narrow opponent ranges (ICM-tight) → suit of bluff-catcher matters enormously (~17bb EV swing).</td></tr>
          <tr><td><strong>Thin river value</strong></td><td>If it feels thin, lean to check over raise — getting called and losing burns disproportionate equity.</td></tr>
        </table>
        <Callout variant="warn"><strong>Bet BIGGER to fold out gutters, not smaller.</strong> The ~105% front-load on A-Q-2 removes 5-4/4-3 from BB's range so turns are clean value bets. Counter-intuitive vs the chip-EV "small range-bet."</Callout>
      </Section>

      <Section title="Sizing">
        <p>BB donk lead ~50% pot (can go range on extreme low boards). BB lead turn: block ~25-33%. BB value bet river: block ~25%, never shove. BTN c-bet default ~B40 / small. BTN front-load overbet ~105% pot. BTN protection shove ~118% pot on low disconnected. River raise (value or bluff): non-all-in (~50% of remaining).</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards['bm9']} />
      <QuizSection questions={quizzes['bm9']} />
    </>
  )
}

export default BM9Page
