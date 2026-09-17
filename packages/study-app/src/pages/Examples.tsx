import { Section, Tabs, BoardExample, ExampleBrowser, HandExample } from '@poker/design-system/src/components/ui'
import { S10_FLOP_A72, S10_FLOP_J97T9, S10_FLOP_K7222, S11_FLOP_A732K, S12_FLOP_842, S12_FLOP_984, S12_FLOP_K84, S1_FLOP_AK2, S1_FLOP_J66, S1_FLOP_K83, S1_FLOP_KK3, S1_FLOP_MONOTONE, S2_FLOP_963, S2_FLOP_A72, S2_FLOP_A95, S2_FLOP_K84, S2_FLOP_K93, S3_FLOP_A42, S3_FLOP_JJ3, S3_FLOP_K72, S3_FLOP_KQ8, S4_FLOP_AK4, S5_FLOP_K72Q, S5_FLOP_Q73J, S5_FLOP_Q73J50, S5_FLOP_Q758, S6_FLOP_864, S6_FLOP_K84, S6_FLOP_K94, S6_FLOP_Q75, S7_FLOP_533, S7_FLOP_662, S7_FLOP_JJ3, S7_FLOP_T33, S8_FLOP_A72, S8_FLOP_KKT, S8_FLOP_Q72Q, S8_FLOP_T922D, S9_FLOP_J105, S9_FLOP_Q62, S9_FLOP_T52, S9_FLOP_T72 } from '@poker/design-system/src/data/ranges'

export function ExamplesPage() {
  return (
    <Section title="Examples — Every System's Walkthroughs">
      <p>The worked examples for all twelve systems on one page — pick the system, then the board. Solved cards render the solver's answer; cards for boards without a stored solution are walkthroughs.</p>

      <Tabs
        tabs={[
        {
          label: 'S1 · UTG vs BB',
          content: (
            <>

<p>The system applied — pick a board on the left. Each card walks the read, then the solver's answer where that board has been solved (40bb single-raised pot).</p>

<ExampleBrowser>
<BoardExample
  board="Kh8h3c"
  spot="K83 two-tone (king-high, disconnected, 40bb)"
  action="C-bet 100%"
  actionVariant="bet"
  solve={S1_FLOP_K83}
>
  Solver agrees — the checked hand cost EV.
</BoardExample>

<BoardExample
  board="KhKd3c"
  spot="KK3 rainbow (high-high-low)"
  action="C-bet 100%"
  actionVariant="bet"
  solve={S1_FLOP_KK3}
>
  Player checked — the high-high-low misread, live.
</BoardExample>

<BoardExample
  board="AsKh2c"
  spot="AK2 (AKx family)"
  action="Mix"
  actionVariant="check"
  solve={S1_FLOP_AK2}
>
  BB connects with every Ax/Kx too — the overpair asymmetry that powers
  the range bet is gone here.
</BoardExample>

<BoardExample
  board="AhJh5h"
  spot="AJ5 monotone (ace-high monotone)"
  action="Mix"
  actionVariant="check"
  solve={S1_FLOP_MONOTONE}
>
  Bet sets, heart draws and trash; check the no-heart overpairs (KK most, then 99/TT/QQ).
</BoardExample>

<BoardExample
  board="Jh6s6d"
  spot="J66 (high-low-low, paired)"
  action="Mix"
  actionVariant="check"
  solve={S1_FLOP_J66}
>
  Bet trips (6x), JJ and Ax; check QJo — the middle pairs (TT-88) are near 50/50 splits.
</BoardExample>
</ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S2 · BTN vs BB',
          content: (
            <>

<p>The system applied — pick a board on the left (40bb single-raised pot, BTN opens 2.1bb). Every bucket of the tree has a solved board.</p>

<ExampleBrowser>
<BoardExample
  board="Ac9h5d"
  spot="A95 rainbow (ace-high, clean)"
  action="C-bet 100%"
  actionVariant="bet"
  solve={S2_FLOP_A95}
>
  BTN has the most aces — risk-free bucket. In position the solver even front-loads a big 72%-pot stab instead of small-stabbing.
</BoardExample>

<BoardExample
  board="Kh9d3c"
  spot="K93 (king-high, 3 present — disconnected)"
  action="C-bet 100%"
  actionVariant="bet"
  solve={S2_FLOP_K93}
>
  The 3 keeps the board disconnected — no two low cards interacting. Same rule as the deuce: bet range at a small size.
</BoardExample>

<BoardExample
  board="Ah7h2h"
  spot="A72 monotone (ace-high, risk factor)"
  action="Mix"
  actionVariant="check"
  solve={S2_FLOP_A72}
>
  The system says mix on monotone. The solver's answer: keep the stab tiny and the frequency near-range — the risk is priced into the size, not a check.
</BoardExample>

<BoardExample
  board="Kc8c4c"
  spot="K84 monotone (king-high, two low cards, risk factor)"
  action="Mix"
  actionVariant="check"
  solve={S2_FLOP_K84}
>
  Monotone + two low cards — both risk factors. Bet the club-heavy strong and weak parts; check the medium hands that can't stand a raise.
</BoardExample>

<BoardExample
  board="9h6d3c"
  spot="963 (9-high & below — BTN misses)"
  action="Mix ~60/40"
  actionVariant="check"
  solve={S2_FLOP_963}
>
  No 8+ on board — BTN's wide range barely connects. Bet top and bottom BIG, check the middling pairs that only beat bluffs.
</BoardExample>

<HandExample spot="AJJ paired (ace-high, 50bb)" action="Mix" actionVariant="check">Paired board = risk factor. Check KQ, QQ, TT-77 (medium). Bet Jx + trash. Solver checks ~50%.</HandExample>
<HandExample spot="K63 two-tone (two low cards, no ace)" action="Mix" actionVariant="check">Two low cards interacting — risk factor. Check QQ, JJ, 9x (medium); bet strong + weak.</HandExample>
</ExampleBrowser>
<p className="mt-3 mb-1 text-sm text-muted">Buckets with no solved board yet are tagged Walk above.</p>
            </>
          ),
        },
        {
          label: 'S3 · BB vs SB Limp',
          content: (
            <>

<p>The system applied — pick a board on the left (70bb limped pot: SB limps, BB checks). The SB's stab varies with the board — 1.5bb (50% pot) usually, a big 3.9bb (130% pot) on KQ8 — and so does its frequency.</p>

<ExampleBrowser>
<BoardExample
  board="Ks7s2h"
  spot="K72 two-tone (high card)"
  action="Defend (high card)"
  actionVariant="call"
  solve={S3_FLOP_K72}
>
  Key card = K (paired 7 is unusable). High card defending: defend all ace highs, then queen highs. 32o is a fold.
</BoardExample>

<BoardExample
  board="Ah4h2s"
  spot="A42 two-tone (gut shots)"
  action="Defend (gut shots)"
  actionVariant="call"
  solve={S3_FLOP_A42}
>
  Key card = 4. All 3x and 5x are pure calls (gut shots). Worst hands contain a 7 (97, T7). J9 with a heart is pure play.
</BoardExample>

<BoardExample
  board="KcQh8d"
  spot="KQ8 rainbow (double-unders fold)"
  action="Fold double-unders"
  actionVariant="fold"
  solve={S3_FLOP_KQ8}
>
  Key card = 8. Double-unders (65, 54, 53) = pure folds. 97 with three-to-straight = pure play. All BDFDs playable (scarce).
</BoardExample>

<BoardExample
  board="JsJh3c"
  spot="JJ3 two-tone (straights)"
  action="Defend (straights)"
  actionVariant="call"
  solve={S3_FLOP_JJ3}
>
  Key card = 3 (very low). Anything with a deuce = death sentence. T9 with three-to-straight = pure play.
</BoardExample>
</ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S4 · River Bluffing',
          content: (
            <>

      <ExampleBrowser>
<BoardExample
  board="AhKh4c7d9s"
  spot="86o on AK4 two-tone (BB vs SB, river)"
  action="Bluff"
  actionVariant="bet"
  solve={S4_FLOP_AK4}
>System 1 — bottom of range, bluff. Avoid clubs and hearts (villain calls with both). Pure bluff.</BoardExample>
        <HandExample spot="75o with 7♣ on Q106cc → Tc river" action="Bluff (one-club)" actionVariant="bet">One-club bias (System 2). Board 3-flushed — obvious suit to block. Without a club = check.</HandExample>
        <HandExample spot="J9s on AKQ J T board (EP vs CO)" action="Bluff" actionVariant="bet">Three Broadway — no offsuit air in EP range. Bluffs are scarce. System 1 overrides System 2.</HandExample>
        <HandExample spot="82s on Q106 → J → A river (BB vs SB)" action="Bluff" actionVariant="bet">2x combos are ideal System 2 bluffs — villain folded 2x preflop, so having a deuce unblocks their folding range.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S5 · Barreling',
          content: (
            <>

<ExampleBrowser>
<BoardExample
  board="Qs7c3dJh"
  spot="J9 on Q73 → J turn (CO, 80bb)"
  action="Check"
  actionVariant="check"
  solve={S5_FLOP_Q73J}
>Medium strength (Jx no kicker). Villain check-calls KQ, QJ at depth. Solver: KJ checks, J9 checks, only AJ barrels.</BoardExample>
<BoardExample
  board="Ks7h2cQd"
  spot="99 on K72 → Q turn (CO, 50bb)"
  action="Check"
  actionVariant="check"
  solve={S5_FLOP_K72Q}
>Medium strength. Check. Solver: 99 and 88 don't bet even with small sizing added. Bet KK, A3s, T8s.</BoardExample>
<BoardExample
  board="Qs7c5d8h"
  spot="JJ on Q75r → 8 turn (CO, 50bb)"
  action="Check"
  actionVariant="check"
  solve={S5_FLOP_Q758}
>Medium strength. Bad turn (improves villain's connected hands). Check. Pocket 88 (open-ender) CAN barrel — 99 and JJ cannot.</BoardExample>
<BoardExample
  board="Qs7c3dJh"
  spot="ATo on Q73 → J turn (merge, 50bb)"
  action="Bet (merge)"
  actionVariant="bet"
  solve={S5_FLOP_Q73J50}
>Exception — merge bet. Villain checked back flop (capped). AT folds KX/QX (better) and calls J10/J4s/10Xd (worse).</BoardExample>
</ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S6 · Check-Raising',
          content: (
            <>

      <ExampleBrowser>
<BoardExample
        board="Qh7c5d"
        spot="K7 on Q75 (HJ, 25bb)"
        action="Check-raise"
        actionVariant="raise"
        solve={S6_FLOP_Q75}
      >Pure check-raise. KQ, QJ, QT all pure CR. Q9 heavy mix, Q8 medium, Q2 pure call. Hierarchical taper.</BoardExample>
      <BoardExample
        board="Kc8h4d"
        spot="K7 on K84 (EP, 13bb)"
        action="Check-raise"
        actionVariant="raise"
        solve={S6_FLOP_K84}
      >Pure check-raise. All Kx from KQ to K2 pure CR. K8 (two pair) = trap (check-call).</BoardExample>
      <BoardExample
        board="Kc9c4h"
        spot="K3♣ on K94 (HJ, 15bb)"
        action="Check-call (trap)"
        actionVariant="call"
        solve={S6_FLOP_K94}
      >Flush draw hands trap, non-flush-draw top pairs CR. K7 no club = check-raise (protection).</BoardExample>
      <BoardExample
        board="8c6h4d"
        spot="65o on 864r (CO, 25bb)"
        action="Check-raise"
        actionVariant="raise"
        solve={S6_FLOP_864}
      >Pure check-raise (top pair + gut shot). Need protection. 85, 87 with gut shots = good CR.</BoardExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S7 · C-bet Folding',
          content: (
            <>

      <ExampleBrowser>
<BoardExample
        board="JsJh3c"
        spot="A5 on JJ3 (BTN, 50bb)"
        action="Defend (call)"
        actionVariant="call"
        solve={S7_FLOP_JJ3}
      >CR to 4bb. MDF fold = 38%. A5 is way too strong to fold. Only trash folds.</BoardExample>
      <BoardExample
        board="TsTh4c"
        spot="K10 on T33 (BTN, 35bb)"
        action="Defend (call)"
        actionVariant="call"
        solve={S7_FLOP_T33}
      >Paired board — key card = T. Overcards to T = pure call. Fold double-unders (98o, 87o).</BoardExample>
      <BoardExample
        board="5c3h3d"
        spot="AJ on 533r (BTN, 35bb)"
        action="Defend (call)"
        actionVariant="call"
        solve={S7_FLOP_533}
      >CR to 7.3bb. AJ is near the nuts (BTN doesn't have 3s). Snap call.</BoardExample>
      <BoardExample
        board="6s6h2c"
        spot="K2s on 662 (BTN, 25bb)"
        action="Defend (call)"
        actionVariant="call"
        solve={S7_FLOP_662}
      >CR to 2bb (very small). K2s with BDFD is worth 45bb/100 — pure call. Almost nothing folds.</BoardExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S8 · Bet Sizing IP',
          content: (
            <>

      <ExampleBrowser>
<BoardExample
  board="Td9d2c2d"
  spot="QJ♦ on T92♦ → 2♦ turn (EP vs SB, 100bb)"
  action="Check"
  actionVariant="check"
  solve={S8_FLOP_T922D}
>Medium strength. Should check. Betting 70% is too thin — villain has KJ, flushes, Jx.</BoardExample>
        <BoardExample
          board="Ah7c2d2h8d"
          spot="88 on A72 → 2 → 8 river (EP vs BB, 50bb)"
          action="Bet large"
          actionVariant="bet"
          solve={S8_FLOP_A72}
        >Villain checks turn and river → capped. 88 is near the nuts. Bet large, not 2.5bb. Small bet reopens action to CR.</BoardExample>
        <BoardExample
          board="Qh7c2dQd"
          spot="K8 on Q72 → Q turn (BTN vs BB, 50bb)"
          action="Overbet pot"
          actionVariant="bet"
          solve={S8_FLOP_Q72Q}
        >Villain check-called flop, checked turn. Nut ratio is low. Should overbet pot to set up river shove. Betting 1/3 loses 270bb/100 EV.</BoardExample>
        <BoardExample
          board="KhKdTh8cQs"
          spot="JT on KKT → Q river (EP vs BB, 50bb)"
          action="Check"
          actionVariant="check"
          solve={S8_FLOP_KKT}
        >Don't reopen with Jx — villain can have quads. Check Jx. Bet QQ+ for value to 3/4 pot.</BoardExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S9 · Defending',
          content: (
            <>

      <ExampleBrowser>
<BoardExample
        board="JdTc5h"
        spot="97♦ on J105 (HJ, 60bb)"
        action="Call"
        actionVariant="call"
        solve={S9_FLOP_J105}
      >"Super gut shot" — gut shot + BDFD. Can turn combo draws on diamond turns. 97o is a pure fold; 97♦ is a call.</BoardExample>
      <BoardExample
        board="Td7c2s"
        spot="Q9 with Q♦ on T72 (BTN, 80bb)"
        action="Call"
        actionVariant="call"
        solve={S9_FLOP_T72}
      >Pure play. Overcard to T, BDFD, blocks villain's diamond calls.</BoardExample>
      <BoardExample
        board="Tc5s2d"
        spot="J6♠ on T52 (CO, 60bb)"
        action="Check-raise"
        actionVariant="raise"
        solve={S9_FLOP_T52}
      >Direct equity vs T (jack), backdoor straight (6), BDFD (spades). Opponent misses this board a lot.</BoardExample>
      <BoardExample
        board="Qc6h2d"
        spot="JTo on Q62r (BTN, 80bb)"
        action="Fold"
        actionVariant="fold"
        solve={S9_FLOP_Q62}
      >Three-to-straight but no BDFD. Sizing-sensitive — folds vs big bet, calls vs small.</BoardExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S10 · River Value',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="Set of Js on 957 → 5 turn (EP vs CO, 100bb)" action="Block-bet 1/3" actionVariant="bet">Villain checks back turn = capped. Block-bet small. If you check, villain bets flushes/sets/overpairs (beat you) and checks medium hands (you beat). You lose value.</HandExample>
        <BoardExample
          board="Jh9c7dTh9d"
          spot="AQ on J97 → T → 9 river (EP vs SB, 80bb)"
          action="Bet pot / overbet"
          actionVariant="bet"
          solve={S10_FLOP_J97T9}
        >Villain checked back turn (no Jx, sets, two pair). River 9 blanks. AQ is near relative nuts. Bet pot or overbet.</BoardExample>
        <BoardExample
          board="Kh7c2d2h2s"
          spot="AK on K72 → 2 → 2 river (EP vs BB, 50bb)"
          action="Jam"
          actionVariant="allIn"
          solve={S10_FLOP_K7222}
        >Villain just called flop and turn (no raises). AK is near nuts — villain has no KK, 77, 22 (would raise). Pure jam.</BoardExample>
        <BoardExample
          board="Ah7c2d2h8d"
          spot="88 on A72 → 2 → 8 river (EP vs BB, 50bb)"
          action="Bet large"
          actionVariant="bet"
          solve={S10_FLOP_A72}
        >Villain checks turn and river → capped. 88 is near nuts. Bet big.</BoardExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S11 · Hero Calling',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="A3♥ on A972K (EP, 4-way, 1/3 bet)" action="Check-raise" actionVariant="raise">Villain's small bet = thin value (KQ, QJ) or A3-A5♥. CR folds A3-A5♥, calls KQ/QJ.</HandExample>
        <HandExample spot="A9s on 9642A (4-way, 7bb into 28bb)" action="Fold" actionVariant="fold">No natural bluffs in villain's range. They need 25% bluffs — no suited connectors called multi-way. Range is all value.</HandExample>
        <BoardExample
          board="Ah7c3d2hKs"
          spot="K7 on A73 2 K (BTN vs BB, 1/2 pot)"
          action="Call"
          actionVariant="call"
          solve={S11_FLOP_A732K}
        >Villain checked turn → no AK, AQ, sets. K7 blocks KX value, unblocks 8x/9x bluffs. 87 is a bad call (blocks 8x bluffs).</BoardExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'S12 · 3-Bet Defense',
          content: (
            <>

      <ExampleBrowser>
<BoardExample
        board="8c4h2d"
        spot="AJs on 842 (EP vs HJ 3-bet)"
        action="Fold"
        actionVariant="fold"
        solve={S12_FLOP_842}
      >Two low cards help, but AJs is still worth zero vs a tight 3-bet range.</BoardExample>
        <BoardExample
        board="Kc8h4d"
        spot="77 on K84r (EP vs BTN 3-bet)"
        action="Fold"
        actionVariant="fold"
        solve={S12_FLOP_K84}
      >King-high = danger zone. 77, 66, 55 = heavy folds. Even TT mixes to fold.</BoardExample>
        <BoardExample
        board="9h8d4c"
        spot="55 on 984 (EP 3-bet caller)"
        action="Call"
        actionVariant="call"
        solve={S12_FLOP_984}
      >Low board = favorable. 55 is worth 100+ bb/100. Defend gut shots, KQs with BDFD.</BoardExample>
      <HandExample spot="44 on 963 (EP vs BTN 3-bet, jam)" action="Call" actionVariant="call">Neither player hits this board. 44 is pure call. Pair vs pair, we're ahead often enough.</HandExample>
        <HandExample spot="AQo on 752 (EP vs BTN 3-bet, 25bb)" action="Call / shove" actionVariant="raise">AQ is worth 186 bb/100. Low board = hero is resilient.</HandExample>
      </ExampleBrowser>
      <p className="mt-3 mb-1 text-sm text-muted">Walk-tagged boards have no solved spot (jam / 25bb lines are not in the 40bb capture set).</p>
            </>
          ),
        },
        ]}
      />
    </Section>
  )
}

export default ExamplesPage
