import { Section, Tabs, BoardExample, ExampleBrowser, HandExample } from '@poker/design-system/src/components/ui'
import { S10_FLOP_A72, S10_FLOP_J97T9, S10_FLOP_K7222, S11_FLOP_A732K, S12_FLOP_842, S12_FLOP_984, S12_FLOP_K84, S1_FLOP_AK2, S1_FLOP_J66, S1_FLOP_K83, S1_FLOP_KK3, S1_FLOP_MONOTONE, S2_FLOP_963, S2_FLOP_A72, S2_FLOP_A95, S2_FLOP_K84, S2_FLOP_K93, S3_FLOP_A42, S3_FLOP_JJ3, S3_FLOP_K72, S3_FLOP_KQ8, S4_FLOP_AK4, S5_FLOP_K72Q, S5_FLOP_Q73J, S5_FLOP_Q73J50, S5_FLOP_Q758, S6_FLOP_864, S6_FLOP_K84, S6_FLOP_K94, S6_FLOP_Q75, S7_FLOP_533, S7_FLOP_662, S7_FLOP_JJ3, S7_FLOP_T33, S8_FLOP_A72, S8_FLOP_KKT, S8_FLOP_Q72Q, S8_FLOP_T922D, S9_FLOP_J105, S9_FLOP_Q62, S9_FLOP_T52, S9_FLOP_T72 } from '@poker/design-system/src/data/ranges'

export function ExamplesPage() {
  return (
    <Section title="Examples — Every System's Walkthroughs">
      <p>The worked examples for every system on one page — pick the system, then the board. Solved cards render the solver's answer; cards for boards without a stored solution are walkthroughs. The P/B/PS courses are reconstructed from public sources — all their examples are walkthroughs.</p>

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
        {
          label: 'P1 · Squeezing',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="50bb — HJ opens 2.3, CO flats, BTN (Bucket A)" action="Squeeze ~10–11bb" actionVariant="raise">Value TT+, AJs, AQo; bluffs A2s–A5s, A7s, K8s, Q8s, J8s, 87s. All three switches on: opener wide, caller capped, you close the action.</HandExample>
<HandExample spot="30bb — BTN opens, SB flats, BB (Bucket B)" action="Squeeze ~8bb" actionVariant="raise">BB closes preflop action after a flat — the strongest OOP squeeze. Value 99+, AJs+, AQo; bluffs A2s–A5s plus a few high suited. More callers = more dead money = squeeze more, not less.</HandExample>
<HandExample spot="40bb — UTG opens, UTG+1 flats, HJ with A5s (Bucket C)" action="Fold" actionVariant="fold">The opener is not wide and the caller is not weak — two switches off. Squeezing EP opens light is a leak; they 4-bet too often.</HandExample>
<HandExample spot="22bb — CO opens, two callers, BB with 99" action="Open-jam" actionVariant="allIn">Below ~25bb, raise-folding burns chips — reshove instead. Jam 99+, AJ+, ATs+, KQs + A2s–A5s blockers.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'P2 · Facing Squeezes',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="40bb — you opened HJ, CO flats, BB squeezes to 10, you hold QQ (opener seat)" action="4-bet / jam" actionVariant="raise">The squeeze did not outrank you — use your range advantage. 4-bet region is premiums only: QQ+/AK core, widening to JJ/AQ only vs demonstrated light squeezing at 40bb+.</HandExample>
<HandExample spot="40bb — you flatted a CO open on BTN, SB squeezes to 10, you hold JJ (sandwich seat)" action="Call" actionVariant="call">Call-or-fold only — never bluff 4-bet from the sandwich: a live opener still acts behind. JJ is the top of your capped range; fold 77–99, AJo, KQo.</HandExample>
<HandExample spot="30bb — you opened UTG, MP flats, BTN squeezes to 9, you hold AK" action="Jam" actionVariant="allIn">UTG is the strongest range at the table. Below 35bb, 4-betting anything means committing — jam QQ+/AK and fold everything else.</HandExample>
<HandExample spot="Bubble 25bb — you opened CO, BTN flats, a covering BB squeezes, you hold JJ" action="Fold" actionVariant="fold">ICM tightens everything: vs a covering stack with steep pay jumps, JJ folds where cEV calls. Respect who covers whom.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'P3 · Big Bets',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="50bb — BTN vs BB, flop K♦Q♣7♦ (broadway, BB capped)" action="Overbet ~120% pot" actionVariant="bet">Bucket A: AK/AA/KQ for value + flush draws and combo draws as equity bluffs. BB's Kx/medium continue-region suffers maximally.</HandExample>
<HandExample spot="60bb — EP opens, BB defends, flop A♠J♠4♥" action="Overbet" actionVariant="bet">EP's tight range has a strong nut advantage on ace-high boards. Value: AA/AK/AJ, nut spade draws, KQ♠ combo draws. Choose the size before the hands.</HandExample>
<HandExample spot="50bb — BTN vs BB, flop 7♠5♠3♦ (low, connected)" action="Check" actionVariant="check">Bucket C: BB defends far more low suited hands — BB has the nuts more often than you. This flop belongs to PS1/PS2, not to the overbet.</HandExample>
<HandExample spot="100bb — K72r, bet 33% called, turn 2♠ (brick)" action="Overbet ~1.5× pot" actionVariant="bet">"Did the board change? No." As aggressor IP with the nut advantage intact, escalate — the Addamo/Negreanu template in your favor.</HandExample>
<HandExample spot="HJ open, CO and BB call, flop Q♠J♦4♣ (multiway)" action="Small or check" actionVariant="bet">Multiway kills big bets: each caller erodes the range advantage. 25–40% pot merged to deny equity — the polarized region no longer exists.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'P4 · Flop Check-Raise',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB vs CO 33% c-bet on K♦8♦6♣, hero KJ" action="Check-raise" actionVariant="raise">"A spot where we check-raise at a pure frequency" — the value region starts at strong top pair, not just monsters. Low-stakes opponents underfold vs check-raises; they fold QT/JT/ace-highs they should continue with.</HandExample>
<HandExample spot="BB vs CO open + c-bet on 9♣7♠2♦, hero T8" action="Check-raise" actionVariant="raise">OESD — the bluff engine. Equity now, fold equity vs the c-bettor's air region. Bluffs are draws, never air.</HandExample>
<HandExample spot="BB vs BTN c-bet on K♦Q♣7♦, hero 98" action="Check-call / fold" actionVariant="check">Bucket C — the raiser's overbet board from the other side. Raising into a nut disadvantage is suicide. This is P3 read in reverse.</HandExample>
<HandExample spot="BB vs BTN 33% c-bet on 7♠5♠3♦, hero 86ss" action="Check-raise" actionVariant="raise">Nut-ish flush draw on a board that smashes the BB's defending range — polar boards for BB convert continues into check-raises.</HandExample>
<HandExample spot="BB multiway (HJ open, CO call) on T♥2♥2♠, hero KJ bdfd" action="Fold / check-call" actionVariant="fold">Multiway check-raising needs two pair+ and nut draws only — respect the nut ratio of live players.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'B1 · Bounty Math',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="$109 PKO ($100 to pools, 9 rake), 10,000 starting chips — you cover a 12bb shove" action="Add ~2,500 chips to the pot" actionVariant="call">Bounty-to-chip conversion: $25 immediate payout ÷ $100 × 10,000 = 2,500 chips of dead equity. Early stages: this simple conversion is the minimum competency.</HandExample>
<HandExample spot="Mid-stage — 500 of 1,000 left, 35bb avg, must call 24bb to win 54.5bb, bounty $50" action="Call to 36.3%" actionVariant="call">Bounty Power 0.233bb/$1 → bounty = 11.67bb → effective pot 66.17bb → required equity 24 ÷ 66.17 = 36.3%, not 44%. The equity drop is the negative risk premium in action.</HandExample>
<HandExample spot="You're covered and facing an all-in" action="Standard thresholds" actionVariant="fold">No equity drop — the bounty is only yours if you cover the player. Normal (or higher) risk premiums apply.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'B2 · PKO Preflop',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="LJ (65bb) opens, BTN (26bb) reshoves in a PKO — you're LJ" action="Call ~36%" actionVariant="call">You cover the shove → apply the equity drop: 36.3% calling range vs 26.8% in a regular MTT. BTN's reshove range widens for value in response.</HandExample>
<HandExample spot="15bb BTN with a 3× grown bounty, blinds cover you" action="Tighten jams — pairs/Ax" actionVariant="allIn">Big bounty on your head → opponents call ~10% wider → shift jams toward pocket pairs over KQo/KTs. Pairs perform better against wide calling ranges.</HandExample>
<HandExample spot="SB jams 12bb — you're BB, covering, SB has a starting bounty" action="Call ~22.7%+" actionVariant="call">Solved: BB calls SB all-ins 15.8% in classic, 22.7% in the PKO. The covering BB's negative risk premium converts marginal hands into profitable calls.</HandExample>
<HandExample spot="Middling stack — EP short stack shoves, two covered players yet to act" action="Flat / small raise" actionVariant="call">The hardest PKO spot. Passive lines that keep multiple bounties in can beat isolation — don't auto-iso-shove.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'B3 · PKO Phases',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="You bust at level 3; field is large, average stack ~1.5× starting" action="Re-enter" actionVariant="allIn">Re-entry rules: only re-enter while early — many starting bounties still in play, average stack still near starting. In small fields or after stacks diverge, re-entering is hard to justify.</HandExample>
<HandExample spot="Mid-stage — you cover the two players to your right, average bounties" action="Widen vs them specifically" actionVariant="raise">Your aggression budget is allocated to players you cover, especially to your right — they act before you every hand. There is a race to become a covering stack.</HandExample>
<HandExample spot="Late — 2 tables left, average bounty has halved relative to stacks" action="Tighten toward standard ICM" actionVariant="fold">Recompute Bounty Power; if it has fallen materially, the equity drop no longer pays for the risk premium. Too tight late beats too wide.</HandExample>
<HandExample spot="Final table — chip leader has 40% of chips and the biggest head" action="Widen shove-calls vs them" actionVariant="call">The winner's-own-head reversal: the biggest bounty at the FT is worth contesting. Price the leader's scalp into your ranges.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'B4 · Mystery Bounty',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="Level 1 of a Mystery Bounty — you cover a short stack" action="Standard freezeout" actionVariant="check">Phase 1: no bounty exists yet. Eliminations before the threshold earn chips and nothing else — taking flips for coverage pays zero bounty.</HandExample>
<HandExample spot="60 left, $50k pool — you cover a 20bb shove" action="Call to ~41%" actionVariant="call">Average KO = $50,000 ÷ 60 = $833 — dead equity in the pot. Equal stacks: required equity falls from 50% to ~40.9%, a gap of nearly 10 points.</HandExample>
<HandExample spot="Medium stack, 3 off the money bubble with 12bb (pre-bounty phase)" action="Take the higher-variance spot" actionVariant="allIn">Phase 2 priority: build a COVERING stack over surviving to a min-cash. Entering the bounty phase unable to cover anyone is the worst position in the format.</HandExample>
<HandExample spot="Top envelope ($50k) drawn with 25 left" action="Tighten back toward vanilla" actionVariant="fold">Disappointment Effect: the pool collapses, average KO crashes ($833 → $200), the Equity Drop shrinks — continuing to call wide is bleeding EV.</HandExample>
<HandExample spot="12 left, top envelope STILL in the box, you cover two middling stacks" action="Widen dramatically" actionVariant="bet">Massive Average Effect: one bounty can be worth more than the next four pay jumps combined.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'PS1 · Turn Probes',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB vs BTN, T72r checked back, turn 8, hero A7o" action="Probe 33–40%" actionVariant="bet">Bucket A draw-completer: third pair top kicker bets small — value from 55/KQo, denies overcards. Linear, small, with 9x/6x/Jx draws and all Tx+.</HandExample>
<HandExample spot="BB vs BTN, T72r checked back, turn A, hero 32o (two pair)" action="Overbet ~200%" actionVariant="bet">Bucket B: never small "blocker" bets on the turned Ace. Tell the story that beats top pair: two pair+ for value, or a big bluff with 53/43/QJ-type missed draws.</HandExample>
<HandExample spot="BB vs LJ, AK8tt checked back, turn 4♠, hero 76s no flush draw" action="Check-fold" actionVariant="fold">Raiser-favorable flop: the check-back means medium hands, not air. You have nuts advantage only — probe rarely, and this hand has no equity story.</HandExample>
<HandExample spot="BB vs LJ, 654tt checked back, turn 3, hero 87o" action="Probe" actionVariant="bet">Even/unfavorable flop: they checked because they had to. Any pair for value/protection, no-pair with backdoors as bluffs — check the Ace-highs.</HandExample>
<HandExample spot="40bb — BB vs CO, 983r checked back, turn T (straight-completing)" action="Bet often and bigger than solver" actionVariant="bet">Population always c-bets their JQ/QJ-type draws — so their check-back is even more capped than GTO assumes. Probe more aggressively than baseline.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'PS2 · Vs Probes',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="LJ vs BB on AK8hh — you checked back K6s, turn 4♦, BB bets 130% pot" action="Call" actionVariant="call">Any Ace is the premium bluff-catch vs a big probe — it blocks BB's two-pair/set value region. K6s calls; the gutshot folds.</HandExample>
<HandExample spot="BTN vs BB on 654tt — you checked back JJ, turn 9♠, BB bets 33%" action="Call at MDF" actionVariant="call">Do not raise — your range is capped and BB's stab is mostly marginal pairs/draws. Raise is the least-used option from a capped range; the bigger the probe, the rarer the raise.</HandExample>
<HandExample spot="LJ vs BB on AK8hh — you checked back A9s, turn 4♦, BB checks" action="Bet 50% thin value" actionVariant="bet">Bucket D payoff: the second check promotes your hand. Hands that mixed on the flop become pure bets after BB checks the turn too.</HandExample>
<HandExample spot="LJ vs BB on AK8hh — you checked back 76♠♠, 130% probe on the 4-turn vs a loose-passive reg" action="Fold" actionVariant="fold">Gutshot calls vs overbets lean on river-bluff EV that only materializes vs sophisticated, disciplined opponents. Vs most humans, folding is the low-risk exploit.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'PS3 · XC-X River',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB vs BTN, J85dd XC, 7h XX, 2s river, hero J9" action="Lead 33%" actionVariant="bet">Top pair, thin value — IP's give-up range pays with A/K-high and 8x/5x. Small-bet geometry of the XC-X-B line.</HandExample>
<HandExample spot="BB vs BTN, 963ss XC 50%, XX, T♠ river (flush in), hero As7s" action="Check (trap)" actionVariant="check">A-high flushes check on flush-completing rivers — they block IP's spade-holding reopening range. Q/J-suit flushes bet: they unblock IP's betting region.</HandExample>
<HandExample spot="BB vs BTN, Q85tt XC 33%, blank XX, brick river, hero 76cc missed draw" action="Check-fold" actionVariant="fold">Small-call range is high-card heavy — you're not out of air, you're out of story. Bluff the missed draw only when it's the last air standing.</HandExample>
<HandExample spot="BB vs UTG, AJ5ss XC 75%, XX, 2♦ river, hero KQ♠♠ missed" action="Lead-bluff small" actionVariant="bet">The big flop call filtered your range until missed draws are nearly your only air — and prefer K-high draws over A-high (the Ace blocks their missed draws).</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'PS4 · Cbet-X River',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="40bb BTN vs BB, A97-75 runout — you range-bet flop, checked back turn, BB checks river, top pair vs a known non-check-raiser" action="Bet pot" actionVariant="bet">No check-raise threat = thin value festival: sims even jam two pair as weak as A5 and pot-size one pair when raising is prohibited (~6% pot EV gain).</HandExample>
<HandExample spot="Same node vs a balanced reg who check-raises rivers" action="Bet ~50%" actionVariant="bet">Equilibrium staple when the CR threat is live: your edge is the middle of the equity distribution, so bet the middle sizes.</HandExample>
<HandExample spot="BTN vs BB — the flop's diamond draw bricks, hero 67♥♥ (no diamonds)" action="All-in bluff" actionVariant="allIn">You unblock their busted diamond draws (the hands that fold) and your bet-flop/check-turn line still contains nutted hands. A bluff needs a fold target, range interaction, and the right blockers.</HandExample>
<HandExample spot="BTN vs BB — you bet pot with top pair, a nit check-raises big" action="Fold" actionVariant="fold">An opponent who raises only the nuts might as well not be raising at all — fold regardless of price. Any hand good enough to call the shove is a hand you should have shoved.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'PS5 · XR-X River',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB vs BTN, Qt3cc XR with 33 (set), turn 2 XX, brick river" action="Lead 75%" actionVariant="bet">Villain's flop-call of a check-raise is a filtered, capped range below your set — and passive villains check back too often to trap. Value bet the unimproved region confidently.</HandExample>
<HandExample spot="BB vs BTN, Qt3cc XR with Ac5c, turn XX, river brings the 4th club" action="Check-raise jam" actionVariant="raise">Bucket A: OOP nut hands check-raise; they don't build overbet ranges. Vs passive players who check back, lead big instead.</HandExample>
<HandExample spot="BB vs BTN, Qt3cc XR with Kc7c (missed FD), turn 2 XX, 9♦ river (KJ now the nuts)" action="Bluff-jam" actionVariant="allIn">The King blocks a large portion of villain's calling region, and the missed draw is nearly your only air — blockers to the rivered nuts make it print.</HandExample>
<HandExample spot="BB vs BTN, Qt3cc XR with 76cc, turn XX, offsuit brick river" action="Check-fold" actionVariant="fold">Your missed draw blocks the busted draws you need villain to hold — the wrong missed draw. K-high before A-high.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'PS6 · XX-XX OOP',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB vs UTG, 652tt XX-XX, brick river, hero 54s (second pair)" action="Lead 33%" actionVariant="bet">Your range contains all the sets and suited straights on this board — nutted companions protect even middle-pair leads. Lead ~11% of range is GTO here.</HandExample>
<HandExample spot="BB vs UTG, AT2r XX-XX, brick river, hero T9o" action="Check-call small stabs" actionVariant="call">The canonical anti-donk board: leading sets a price, hand-reads face-up — villain folds everything worse, continues with everything better, and raises at will. No nuts advantage, no lead.</HandExample>
<HandExample spot="BB vs BTN, KJ5tt flop, 8 turn, T river (four to a straight), XX-XX, hero 55 (set)" action="Check-raise jam" actionVariant="raise">Dynamic rivers reward traps, not leads — a block bet is a check wearing a costume; the jam replaces the 200% lead.</HandExample>
<HandExample spot="IP side — CO vs BB, BB leads 60% on a 652tt XX-XX river, you hold 88" action="Raise" actionVariant="raise">Condensed leads get raised by solvers even with JJ-strength hands (near-100% raise vs condensed donks, ~39% of responses all-in).</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'PS7 · XX-XX IP',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BTN vs BB 40bb, K72r-5-3 runout XX-XX, hero AK vs unknown" action="Check back" actionVariant="check">Thin value faces the check-raise threat, and the hands that suffer most from a raise are the thin-value hands themselves. The free showdown is the win.</HandExample>
<HandExample spot="Same node vs an opponent who never check-raises and calls too much" action="Bet ~50%" actionVariant="bet">The exploit unlocks: block-bet all medium hands for value. Player type first, frequencies second.</HandExample>
<HandExample spot="BTN vs BB, QJ9tt-8-6 runout (everything drew), XX-XX, hero A5 no diamonds" action="Bluff big / jam" actionVariant="allIn">You unblock their busted flush draws (the folding region) and the runout fills your checked-back range with missed draws that tell the story.</HandExample>
<HandExample spot="BTN vs BB, XX-XX, river pairs the bottom, hero 44 (second pair)" action="Check back" actionVariant="check">Bucket B SDV. Don't turn showdown value into bluffs without a plan — realize the zero-cost showdown.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'PS8 · Versatility',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="100bb cash — BB vs BTN, T72r checked back, turn A, hero two pair" action="200%+ polar probe" actionVariant="bet">Deep: the full menu exists. Same four questions (capped? nuts? card class? blockers?) — the sizing ladder is what depth edits.</HandExample>
<HandExample spot="40bb MTT — same node, turn A" action="Jam" actionVariant="allIn">The 250% polar overbet becomes a jam — overbets become jams, block bets persist, card-class logic unchanged.</HandExample>
<HandExample spot="20bb MTT — same node, turn A" action="Check-raise jam" actionVariant="raise">Under 25bb everything is jam-or-check: the probe itself dies at this SPR.</HandExample>
<HandExample spot="FT 25bb, XX-XX river, nutted OOP" action="Check-raise jam (trap)" actionVariant="raise">ICM makes villain's stabs honest, so value concentrates in their thin bets. At NL200 200bb the same hand checks, then check-raises small to induce — deep stacks reward the extra street of money.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW1 · BB Donk',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="LJ opens, SB + BB call, 100bb, flop 654tt — SB donks 33%" action="Continue tight" actionVariant="call">Bucket A working as designed: SB's range is full of straights, sets, pair+draws. Not a donk-spaz — their calling range is loaded with this board.</HandExample>
<HandExample spot="EP opens, BTN + BB call, 40bb, flop 7♦5♥2♣ — BB checks, EP checks 81%" action="IP takes the clock" actionVariant="bet">The clock went all the way around and nobody small-stabbed — when EP does bet here it's large (4.7–7bb into ~7bb). BB checks entire range by default.</HandExample>
<HandExample spot="BB vs HJ vs BTN, 50bb, Q♦J♦5♥ — BB checks, HJ checks ~45%" action="BTN bets 33% with ~55%" actionVariant="bet">The clock's default owner (IP) took it. HJ's check is nearly always with an uncapped range including the literal nuts — the middle seat is a freeze-out.</HandExample>
<HandExample spot="CO opens, SB + BB call, 50bb, K♦9♥2♣" action="CO c-bets 66% small" actionVariant="bet">The BB check did not cap the blinds — but only the opener can have a set of kings here. Dry-high boards are opener-only nut advantage.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW2 · Flop Bets',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB/HJ/BTN, Q♦J♦5♥, 50bb — BTN in position" action="Bet 33% with ~55% of range" actionVariant="bet">Sets/two pair pure-bet, and a large fraction of bottom pair bets too (blocker + backdoor draw — "closer to a thin bluff than a value bet"). 33% pot is used 56% of the time; 65% pot barely exists.</HandExample>
<HandExample spot="CO vs SB+BB, K♦9♥2♣, 50bb, hero Q♣9♣" action="Bet small 55%, bet 60–70% 25%" actionVariant="bet">Middle pair is NOT a high-frequency check — most players over-check it. 99, 22, K9 are all pure bets; the checking range (55–88) is deliberately capped.</HandExample>
<HandExample spot="BTN vs SB+BB, A♠K♠4♦, hero AQ" action="Bet 60–66%" actionVariant="bet">Big-bet window: nut edge (TPGK+overpairs) + closing action. Outperforms the automatic small c-bet — extracts from AT/AJ, punishes Kx, prices out floats.</HandExample>
<HandExample spot="BTN vs SB+BB, 7♣5♣3♦, hero AA" action="Check more" actionVariant="check">Nut-disadvantaged: you have overpairs but the blinds have proportionally more sets, two pair and straights. If you bet, keep it small.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW3 · Flop Raises',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB vs HJ vs BTN, Q♦J♦5♥ — BTN bets 33%, hero BB" action="Fold ~69% / call ~31%" actionVariant="fold">Raises essentially never — the HJ still acts behind. "That is not an exploitable tendency — it is the structurally correct response to being sandwiched."</HandExample>
<HandExample spot="HJ after BTN bet + BB call on Q♦J♦5♥" action="Raise 30.7%" actionVariant="raise">The raise is used more than twice as often as the overcall (14.5%): value linearly plus medium-pair blocker bluffs. The last raise owns the pot — be the last raise.</HandExample>
<HandExample spot="BB vs CO vs BTN, K♥J♦Q♦ — BTN bets 28%, hero BB K♦T♦" action="Raise (rare top-of-range)" actionVariant="raise">The board is too threatening for a wide raising range: only a few combos raise — pair+open-ender, top two. Even T9dd calls are miserable.</HandExample>
<HandExample spot="Facing a raise holding KJ on QJ5r as the cold-caller" action="Fold" actionVariant="fold">One pair is behind the honest raising range that just priced out two players. A raise through two ranges is a confession of strength — believe it.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW4 · Squeezes',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="CO, BTN bets 28% + BB calls on K♥J♦Q♦, hero A♦A♣" action="Squeeze — always" actionVariant="raise">Even monsters squeeze: two capped ranges are paying maximum. "I would feel so miserable" — do it anyway; two opponents drawing at your overpair is the most expensive free card in poker.</HandExample>
<HandExample spot="HJ, BTN bets 33% + BB calls on Q♦J♦5♥, hero J♠T♠" action="Squeeze" actionVariant="raise">Middle pair + blocker: folds out both capped ranges often enough to pay for itself immediately. If you'd call, ask why you wouldn't raise — often there's no answer.</HandExample>
<HandExample spot="Same pot, hero Q♠J♠" action="Overcall" actionVariant="call">The exception: dominates the BTN's thin value, realizes deep, keeps both in. Plan the turn now — take the lead when the bettor checks (MW8).</HandExample>
<HandExample spot="Same pot, hero K♠J♠ (no flush draw)" action="Fold" actionVariant="fold">Top pair + gutshot is crushed by the combined continuation once bet–call happens. Pot odds lie multiway — equity falls faster than the price improves.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW5 · BB Calls',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="EP/BTN/BB, 7♦5♥2♣ — EP c-bets, hero BB K♦Q♦" action="Call for coverage" actionVariant="call">Turn J♣ → check-call once (this is the draw); turn 3♣ → check-fold. The call range is pre-loaded with the turn plan — KQo blocks the K/Q turns the opener will barrel.</HandExample>
<HandExample spot="CO/SB/BB, K♦9♥2♣ — c-bet, SB calls, hero BB 8♠8♦" action="Call — the stubborn undercard pair" actionVariant="call">"If you're always folding pocket fours through eights on this flop, you're probably folding too much." It survives one bet — not a double barrel into two players.</HandExample>
<HandExample spot="CO/BTN/BB, K♥J♦Q♦ — BTN bets 28%, hero T♠9♠" action="Call (barely)" actionVariant="call">"The board is just so threatening, it's too miserable to call all the time. Even if you have T9 you should call, but... can I really just call?" Continuance is equity-based, not stubbornness-based.</HandExample>
<HandExample spot="Same 752 flop, hero 2♠3♠" action="Call — every 2x continues" actionVariant="call">Turn 2♥ → check-call confidently: trips blocker, unblocks folds — the best check-call on the card that helps you.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW6 · BB Folds',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="CO/BTN/BB, K♥J♦Q♦ — BTN bets 28%, BB folds, hero CO Q♠9♣" action="Pure call" actionVariant="call">One street ago (BB still in) this was a pure fold. The fold changed the math, not the hand — every hand near the margin improves a full grade when the field thins.</HandExample>
<HandExample spot="Same hand, hero BTN after BB folds, brick turn" action="Barrel 50–66% with AJ/AT" actionVariant="bet">Thin value that the BB's presence made unprofitable is now the mainline — the bettor faces a single capped, documented range.</HandExample>
<HandExample spot="BB/HJ/BTN, Q♦J♦5♥ — BTN bets, BB folds, hero HJ J♠T♠" action="Call, and call one brick barrel" actionVariant="call">Marginal 3-way becomes a functional bluff-catcher: the QJ5 labeled ranges (bettor condensed-nut-tilted, caller capped-blocker-rich) replace generic HU priors.</HandExample>
<HandExample spot="You were the caller and the bettor checks the turn" action="Take the clock" actionVariant="bet">The clock is yours — stab 50–60% with the medium hands that just gained showdown value (bridge to MW8). The upgrade is defensive, not a bluff-raise license.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW7 · Turn Probes',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB-CO-BTN, K♠7♦6♣ checks around, turn 5♦" action="Probe ~always, 100% pot" actionVariant="bet">Straights and two pair only BB holds. Polar: 53/43 value-protected, bluffs with a 5 or straight blockers. Nut edge bets big.</HandExample>
<HandExample spot="BB-CO-BTN, 7♦6♣5♦ checks around, turn K♠" action="Probe, split 67/100%" actionVariant="bet">Same cards, different order, different size: BTN's check-back range gained Kx — your edge is thinner. Order-flip runouts are different strategic hands.</HandExample>
<HandExample spot="BB-CO-BTN, K♠7♦6♣ checks around, turn 2♣" action="Check entire range" actionVariant="check">"A blank like the 2♣ isn't good enough" — the blank didn't give you the nut hands CO's uncapped range forces you to have.</HandExample>
<HandExample spot="BB-CO-BTN, T75r checks around, turn 6" action="Probe small, linear" actionVariant="bet">The exception: 54s/64s pair+draw hands push CO off A5 and retain equity vs BTN calls — and your trips/two-pair make raising dangerous for opponents.</HandExample>
<HandExample spot="BB-CO-BTN, T98r checks around, any turn" action="No probe — ever" actionVariant="check">BB is at a nuts disadvantage on this texture regardless of the runout: even nutty hands prefer checking to give opponents another opportunity to bet.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW8 · Turn Cbets',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="EP/BTN/BB, 7♦5♥2♣ — EP c-bets, both call; turn J♣, EP checks" action="Stab 40% with any pair+" actionVariant="bet">The J is the card EP barrels "aggressively" — the check is a genuine give-up. They checked the card they wanted; believe the weakness.</HandExample>
<HandExample spot="BB/HJ/BTN, Q♦J♦5♥ — BTN bets, calls around; turn T♦ (flush completes), BTN checks" action="Check behind" actionVariant="check">Trap-tilted: monsters pot-controlling into two players. Take the free card; stab only rivers that help you — and fold everything but the nuts to the delayed check-raise.</HandExample>
<HandExample spot="CO/SB/BB, K♦9♥2♣ — CO c-bets, SB calls, BB folds; turn 4♦, CO checks" action="SB stabs 33–50%" actionVariant="bet">CO's condensed range on a blank — SB is now last (BB folded) and stabs with 9x/underpairs to the board card.</HandExample>
<HandExample spot="Same pot, turn checks all the way, river 7♠" action="Bluff aggressively with blockers" actionVariant="bet">Three capped ranges checked down — the river is the bluffing lane. The field over-folds and over-value-bets-thin in practice; value bet thin too.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW9 · River OOP',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB-SB-BTN, K72r checks flop and turn, river 2♦, hero BB with A♠7♣" action="Lead 60%" actionVariant="bet">Bucket A — the deuce pairs your defended range: top pair plus trips-blocker bluffs. Lead your card.</HandExample>
<HandExample spot="Same line, flush completes on the river, hero A7" action="Check — trap the stabs" actionVariant="check">Bucket C: check-call with blockers, check-raise your few flushes. Leading top pair into the completed region is a donation.</HandExample>
<HandExample spot="Full check-down on T75r-6-4, hero BB with missed 89" action="Blocker bluff 50%" actionVariant="bet">The 9 blocks the straights that call — merged with your two-pair value. Checked-down rivers fold too much: tax them.</HandExample>
<HandExample spot="Hero BB with 33 on K72-2 river after check-down" action="Check-raise the stabs" actionVariant="raise">Trap-eligible monster: two players behind means stab frequency pays you better than a lead.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW10 · River IP',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BTN, K72r checked down, river 2♦, hero A♠K♣" action="Bet 75%" actionVariant="bet">Bucket A — board paired under your top pair. The field's Kx and stubborn pairs pay; there is no next street, every check is final.</HandExample>
<HandExample spot="BTN, T75r-6-4 checked down, hero A♠8♦ (ace-high)" action="Check" actionVariant="check">Unblocked air with no draw history has no case vs two ranges — realize the zero-cost showdown instead.</HandExample>
<HandExample spot="BTN, flush draw bricked on 9♣7♣4♦-K♠-2♥, hero Q♠J♣" action="Bet 50% merged" actionVariant="bet">Bucket C: the J♣ blocks straight calls and your line bluffs credibly. Blocker bluffs ride the same sizes as value.</HandExample>
<HandExample spot="BTN, bet flop called twice, turn checked to you, brick river, hero 9♠9♣ on T84r-K-3" action="Bet 40%" actionVariant="bet">Bucket B — second pair below the overcard still beats the check-down region. Thin value lives on passive lines.</HandExample>
<HandExample spot="Live table, 3-way checked-down river, hero top two on 8♦7♦5♦-2♠-2♣" action="Bet 100%+" actionVariant="bet">Under-defending field: live and ICM-scared pools under-defend large multiway bets — value wider, bluff narrower, one size up from every row.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'MW11 · River Calls',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB/HJ/BTN, Q♦J♦5♥-K-T — BTN bets 40% river, hero BB with A♠J♣" action="Fold without ceremony" actionVariant="fold">Early seat: the HJ behind carries more burden and the BTN's line was honest. No one has to be the sheriff — one bettor, many deputies, only the last one is on duty.</HandExample>
<HandExample spot="Same pot, hero HJ (last) with A♠J♣" action="Call" actionVariant="call">Closing action: the ace blocks the missed-AK value/ace-high bluff region, and your seat owns the defense.</HandExample>
<HandExample spot="Bettor jams 90% on a flush-completing river, hero bluff-catcher with one flush card" action="Fold" actionVariant="fold">The polar range plus the scary runout ("too miserable to call all the time") puts your medium behind. Big multiway bets are honest — respect the confession.</HandExample>
<HandExample spot="Early player calls a 33% river bet; hero middle with second pair" action="Fold" actionVariant="fold">The overcall beats two ranges or nothing — the bettor's honest range AND the caller's signaled strength.</HandExample>
<HandExample spot="BB-CO-BTN, 765tt-K-4 (flush bricked), BTN stabs 50%, hero BB with 8♠6♠" action="Call" actionVariant="call">Last-relevant seat with a blocker to the missed straight/flush region that bluffs — blockers call; bare medium folds.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'LP1 · Limp/Fold',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="SB 10bb, 44" action="Shove" actionVariant="allIn">Middle-of-range hands are the jam class at short depth — limp polar short, shove the middle.</HandExample>
<HandExample spot="SB 10bb, AA" action="Limp" actionVariant="check">Bait for a limp-shove vs an aggressive BB — premiums limp at 10bb, raise at 30bb, trap at 60bb.</HandExample>
<HandExample spot="SB 20bb, A4o" action="Raise 3bb" actionVariant="raise">Blocker bluff-raise (two cards above a 7) that folds to a 3-bet; AQo is the limp-shove at this depth.</HandExample>
<HandExample spot="SB 30bb, QQ" action="Raise 4bb" actionVariant="raise">The pure-raise depth for big pairs: builds a pot efficiently while keeping postflop room.</HandExample>
<HandExample spot="SB 60bb, AA" action="Limp" actionVariant="check">Trap for the limp-raise vs a BB isolation — the deep-stack weapon. KQs raises 4bb linearly instead.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'LP2 · SB Flop Bet',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="SB vs BB, AJ6r, 60bb, K9o" action="Bet 33%" actionVariant="bet">Bucket A linear attack — K-high has showdown-plus value and denies equity. Nearly the whole range can bet small.</HandExample>
<HandExample spot="SB vs BB, 742r, 25bb, 99" action="Overbet or check" actionVariant="bet">The overpair is the rare pure value hand on a low board — overbet polar, never half-pot stab.</HandExample>
<HandExample spot="SB vs BB, 742r, 25bb, A5o" action="Check" actionVariant="check">A-high has equity but no edge on this texture — the low-board illusion: BB's checked range retains the low cards.</HandExample>
<HandExample spot="SB vs BB, 762tt, 60bb, 88" action="Bet 50%" actionVariant="bet">Top of the dynamic-board value region: already-strong hands bet, QJdd-type candidates stay capped by dynamism.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'LP3 · SB Checks',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="SB vs BB, 762tt, 60bb, A♥3♥" action="Check, fold to a bet" actionVariant="fold">~45% equity but a pure check-fold — realization is poor and the BB checks back over half the time. Likely ahead is a reason not to bet.</HandExample>
<HandExample spot="SB vs BB, 762tt, 60bb, K♣5♣" action="Check, call 33%" actionVariant="call">Bucket B: backdoor flush + straight, two overcards to the 7 — rank and clean outs realize.</HandExample>
<HandExample spot="SB vs BB, AJ6r, 60bb, KQo" action="Check or bet — if checked, call one" actionVariant="call">Near the A/B boundary; K-high retains value on the flop that favors you.</HandExample>
<HandExample spot="SB vs BB, any, 25bb, 5♠4♠ no draw" action="Check-fold" actionVariant="fold">Bucket D — its bluff equity belongs to the river on favorable boards (LP7), not this flop.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'LP4 · BB Defense',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BB vs SB stab, Q86r, K5o" action="Call" actionVariant="call">Bucket A — the king is one of only two overcards to the queen: rare and valuable.</HandExample>
<HandExample spot="BB vs SB stab, Q86r, 54o" action="Call — gutshot" actionVariant="call">Draws are tiebreakers: the gutshot to a seven saves a hand that fails the overcard test. Never fold a pair, never fold two sixes-plus.</HandExample>
<HandExample spot="BB vs SB stab, Q86r, J5o" action="Fold" actionVariant="fold">Bucket C — one undercard to the low, one below the high, no BDFD: fails both tests.</HandExample>
<HandExample spot="BB after SB check, 762tt, 94o" action="Bet" actionVariant="bet">Bluff from the low-hand-with-draw region (gutshot + live cards) — 87o bluffs better than 82o.</HandExample>
<HandExample spot="BB after SB check, AJ6r, A8o" action="Check" actionVariant="check">Top pair weak kicker checks for pot control — the bigger the pair, the safer to check.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'LP5 · Vs Iso',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="SB 60bb, AA, BB isolates 4bb" action="Limp-reraise ~12bb" actionVariant="raise">The trap fires — premium hands limp-reraise at 50bb+.</HandExample>
<HandExample spot="SB 15bb, 88, BB isolates" action="Limp-shove" actionVariant="allIn">Short-depth trap — mid pairs shove rather than reraise small.</HandExample>
<HandExample spot="SB 40bb, 76s, BB isolates 3bb" action="Limp-call" actionVariant="call">Playability bucket: realize equity, keep the iso's junk in. Suited hands wait for 50bb to iso themselves — they hate folding to limp-shoves.</HandExample>
<HandExample spot="BTN 20bb, K5o, BB isolates" action="Fold" actionVariant="fold">Blocker middles die vs polar isos at this depth — the weak end is disposable by design.</HandExample>
<HandExample spot="BB vs SB limp, 25bb, 72o" action="Iso (solver baseline!)" actionVariant="raise">Polar structure: 72o raises, 76s checks — junky offsuit is the disposable end of the iso range.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'LP6 · Turn Geometry',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="SB bet 33% on 742r with 99, called; turn 3" action="Barrel bigger than geometric" actionVariant="bet">Frontload value, deny the live overcards their easy river decision — hypergeometric equity denial.</HandExample>
<HandExample spot="SB bet 33% on AJ6r with A9, called; turn K" action="Check the weak top pair" actionVariant="check">Overcard bucket — the caller's range improved; only nut+ or blocker bluffs continue.</HandExample>
<HandExample spot="Flop checked through 762tt, SB has K-high" action="Check-fold" actionVariant="fold">Unfavorable board: the flop-favored player's worst hands stay indifferent — bluffs are unprofitable here.</HandExample>
<HandExample spot="Flop checked through AJ6r, SB has 5-high" action="Bluff the turn" actionVariant="bet">Favorable board: the flop-favored player's trash is a profitable bluff — the edge survives the check-through.</HandExample>
<HandExample spot="SPR 2, two streets, nut hand" action="Bet ~73% pot twice" actionVariant="bet">The geometric all-in path: 73% now, 73% of the new pot on the river — the fraction that lands exactly all-in.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'LP7 · LP River',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="SB, checked-down AJ6r river, 5-high" action="Bluff" actionVariant="bet">Favorable board — trash that didn't bluff earlier is the profitable river bluff. One voucher, one bluff.</HandExample>
<HandExample spot="SB, checked-down 762tt river, 5-high" action="Check-fold" actionVariant="fold">Unfavorable board: the same trash is indifferent at best. The board decides who bluffs.</HandExample>
<HandExample spot="BB, called a flop stab, turn checked through, river, missed BD flush draw" action="Candidate bluff" actionVariant="bet">Your flop call was the risk, the checked turn the lucky branch — the voucher is live.</HandExample>
<HandExample spot="SB river, top set on 742r" action="Jam" actionVariant="allIn">Polar texture, geometric all-in for the last act — the river forgives only one size.</HandExample>
<HandExample spot="SB river, second pair on AJ6r" action="Check" actionVariant="check">The second tier never bets — betting folds out worse and gets called by better.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'LP8 · LP Exploits',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="BTN limp 14bb, BB half-pot stabs 8♥6♥3♦, hero 99" action="Shove" actionVariant="allIn">Nodelock response vs the pair-heavy stabber: BB's over-bet range is top/second-pair heavy with no monsters — mid pairs put it to the test (their error costs ~10bb/100).</HandExample>
<HandExample spot="BTN limp, weak-checking BB checks AJ6r, hero K5o" action="Bet 29–33%" actionVariant="bet">Their checking range is weakened by the deviation — equilibrium would check more. Bet small into weak checks.</HandExample>
<HandExample spot="SB limp, BB iso only 'good hands' (linear), hero 87s" action="Call, bet many flops" actionVariant="call">Bucket B: their checked-back range is overly weak by construction — the flop edge inflates.</HandExample>
<HandExample spot="SB 20bb, BB never raises limps, hero A8o" action="Limp (and expand shoves)" actionVariant="check">Bucket D population exploit: their passivity pays for every extra hand — apestyles' labeled exploit.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'RS1 · Symmetric',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="SPR 1, river, hero nuts" action="Jam" actionVariant="allIn">The geometric size is exactly pot at SPR 1 — one bluff per two value bets.</HandExample>
<HandExample spot="SPR 1, hero air, 2 value combos in range" action="Include exactly 1 bluff combo" actionVariant="bet">33% of the betting range — the α-exact bluff ratio at pot-sized.</HandExample>
<HandExample spot="SPR 1, hero bluff-catcher vs pot jam" action="Call half the time" actionVariant="call">MDF 50% — the equilibrium mix. The middle of a symmetric range always checks.</HandExample>
<HandExample spot="SPR 5, hero air with a clean runout" action="Geometric triple-barrel ~82%" actionVariant="bet">Per-street geometric keeps the final all-in honest — the cumulative ratio stays α-exact at the river.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'RS2 · Cond. IP',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="IP condensed, OOP jams pot, hero top-pair-good-kicker" action="Call" actionVariant="call">A-tier — the quota requires it. The wall pays from the top.</HandExample>
<HandExample spot="IP condensed, OOP bets 33% pot, hero median pair" action="Call" actionVariant="call">B-tier mixed at MDF 75% — the size sets the math; the story only re-sorts the wall.</HandExample>
<HandExample spot="IP condensed, OOP checks, hero second pair" action="Bet 25–33%" actionVariant="bet">Their check is air-heavy — charge it a little. Thin value from the top of the wall.</HandExample>
<HandExample spot="IP condensed, OOP bets 2x pot, hero weakest catcher" action="Fold" actionVariant="fold">C-tier — the 2/3 fold quota starts here. Hero-calling with the bottom is the classic condensed-range donation.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'RS3 · Cond. OOP',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="OOP condensed, IP jams pot, hero best catcher" action="Check-call" actionVariant="call">Top of the wall — MDF 50% requires it. Position was the salary; OOP can't protect showdowns.</HandExample>
<HandExample spot="OOP condensed, IP jams 2x pot, hero weakest catcher" action="Check-fold" actionVariant="fold">The quota region — fold from the bottom, never pay with C and fold A.</HandExample>
<HandExample spot="OOP condensed, hero second pair, checked to" action="Check — never lead the middle" actionVariant="check">Betting into a polar range feeds the traps and forfeits the bluff-catch: "betting the middle pays twice for the same showdown."</HandExample>
<HandExample spot="OOP condensed with a nut hand (range drift), SPR 1" action="Lead / jam" actionVariant="allIn">Leads come from the ends, not the wall — nut region + blocker bluffs only.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'RS4 · IP Traps',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="IP trap, OOP bets 60% pot (90/10 wall-trap mix)" action="Call" actionVariant="call">Let the polar range keep barreling into the trap region — IP traps can wait; OOP must walk into them.</HandExample>
<HandExample spot="IP trap, OOP checks, SPR 1" action="Bet ~120% pot" actionVariant="bet">The trap-capped optimum band: 123% at t=10%, with 100–150% nearly equal in EV.</HandExample>
<HandExample spot="OOP jams 3x pot into the 90/10 mix" action="Traps raise, wall folds to quota" actionVariant="raise">The overbet crossed the trap cap — take the max. Defense never drops below the trap percentage.</HandExample>
<HandExample spot="IP air with fold-blockers, OOP checks" action="Small blocker bluff only" actionVariant="bet">Only if it unblocks their folds — blocking the wall while betting into traps is backwards.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'RS5 · OOP Traps',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="OOP trap, SPR 1, IP bets 60% pot" action="Check-call" actionVariant="call">The geometric jam comes on the next decision anyway — shallow traps call.</HandExample>
<HandExample spot="OOP trap, SPR 2.5, IP bets 50% pot" action="Check-raise to ~3x" actionVariant="raise">Deep traps raise geometric — set up the river all-in; a click raise gives them a cheap re-decision.</HandExample>
<HandExample spot="OOP trap, IP overbets 2.5x pot" action="Check-raise / jam" actionVariant="raise">The size crossed the trap cap and already paid the tax — take the max.</HandExample>
<HandExample spot="OOP trap, IP checks behind (river)" action="Take the pot" actionVariant="check">No extraction available — the trap's value is the bet it induces, not the bet it makes.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'RS6 · Small IP',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="IP vs passive OOP checker, hero second pair, 60bb" action="Bet 25–33%" actionVariant="bet">Thin value stream — they defend too little. At 25% pot the bluff share is only ~11%: merged, not polar.</HandExample>
<HandExample spot="IP, hero ace-high vs capped OOP" action="Bet 25%" actionVariant="bet">Merged value vs their under-defending folds — thin value needs a small price and a passive foe.</HandExample>
<HandExample spot="IP, hero missed flush draw with the ace of the suit" action="Blocker bluff" actionVariant="bet">Blocks their flush-catchers — the few bluff slots belong to hands like this, not dead air.</HandExample>
<HandExample spot="IP vs a check-raising reg, hero third pair" action="Check" actionVariant="check">The stream is dead vs proper raising — take the showdown. If they check-raise: fold C-tier instantly, defend A.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        {
          label: 'RS7 · Capstone',
          content: (
            <>

      <ExampleBrowser>
<HandExample spot="OOP strong polar (nut region), IP weak wall + ~10% traps, SPR 1" action="Lead ~pot" actionVariant="bet">Inside the solved band — jams only pay the traps. Leading is mandatory; the only question is the size.</HandExample>
<HandExample spot="IP trap vs a 2x pot lead" action="Raise" actionVariant="raise">The size crossed the cap — extract the maximum. Standard-size leads get called instead.</HandExample>
<HandExample spot="IP wall-top vs a pot lead" action="Call" actionVariant="call">c = max(50%, 10%) = 50% from the top of the wall.</HandExample>
<HandExample spot="OOP nuts, SPR 5" action="Frontload 150%+, geometric river" actionVariant="bet">Deny the positional rivers — larger-than-geometric bets reduce betting rounds when position hurts you.</HandExample>
<HandExample spot="IP air, any SPR" action="Fold vs leads" actionVariant="fold">The weak condensed range does not bluff here — fold or call, nothing else.</HandExample>
      </ExampleBrowser>
            </>
          ),
        },
        ]}
      />
    </Section>
  )
}

export default ExamplesPage
