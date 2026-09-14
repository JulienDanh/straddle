import { Section, Callout, Leak, Action, Subhead, DataTable } from '@poker/design-system/src/components/ui'

export function BM8Page() {
  return (
    <Section title="BTN Covers BB — Postflop">
      <p className="mb-1"><strong className="text-good">BTN covers BB</strong> — the BTN can bust the BB, never the reverse.</p>
      <p>BTN (50bb) covers BB (20bb) on the bubble. Two sides: BB defense (modules 11) and BTN c-betting (module 12). The covering stack range-bets far more flops than in chip EV; the covered BB check-raises far less and plays protection-oriented.</p>

      <Leak items={[
        ['Smash-betting every board without developing a check range'],
        ['Using overbet sizing on boards with open-enders or flush draws'],
        ['Shoving the river with the nuts and raising non-all-in with bluffs', 'exploitable'],
        ['Not recognizing the protection element under ICM'],
      ]} />

      <>
              <Callout variant="good"><strong>Bet MORE air when covered, not less.</strong> Because BB can't check-raise you, your c-bet frequency goes UP under ICM — the opposite of what most players do.</Callout>

                      <Subhead>Board class × side</Subhead>
<DataTable columns={[{ header: 'Board class' }, { header: 'BB defense (covered)' }, { header: 'BTN c-bet (covering)' }]} rows={[[<><strong>Ace-high (A-K-x, A-Q-x)</strong></>, <><Action variant="call">Pure check-call top pair</Action> — ~88-90% equity, lockdown. No protection.</>, <><Action variant="bet">Range bet</Action> — BB has no check-raise value range.</>],
                  [<><strong>Q-high / J-high</strong></>, <><Action variant="raise">Check-raise 80%+</Action> — K/A turn can outdraw → protection.</>, <><Action variant="bet">Range bet (or near)</Action> — BB XR only ~5% (vs ~20% chip).</>],
                  [<><strong>Low boards</strong></>, <><Action variant="raise">Check-shove strong value</Action> — Maximize protection. No small raises.</>, <><Action variant="bet">Range bet</Action> — BB has near-zero connection. XR ~11%.</>],
                  [<><strong>Paired, high-high-low (A-A-8)</strong></>, <><Action variant="call">Pure check-call</Action> — No XR range — BB lacks the pair.</>, <><Action variant="bet">Range bet</Action> — K-K-2/K-K-4 ~95%. K-K-9 checks some.</>],
                  [<><strong>Monotone connecting OOP</strong></>, <><Action variant="raise">Check-call / check-shove</Action> — Case by case.</>, <><Action variant="check">Check back some</Action> — A-K-8♣, A-9-8♣, K-J-3♣, Q-8-3♣.</>],
                  [<><strong>Middling Broadway (K-Q-10)</strong></>, <><Action variant="raise">Check-raise some</Action> — Board connects both.</>, <><Action variant="check">Check ~60%</Action> — Bet strongest + weakest ace-highs; check mid.</>]]} />

<Subhead>Core Rules — BB Defense (covered)</Subhead>
              <DataTable columns={[{ header: 'Board class' }, { header: 'Default' }]} rows={[[<><strong>Ace-high lockdown</strong></>, <>Pure check-call top pair. ~88-90% equity, no outdraw.</>],
                  [<><strong>Q-high / J-high</strong></>, <>Check-raise top pairs with 80%+ equity. K/A turn can outdraw.</>],
                  [<><strong>Low boards</strong></>, <>Check-shove strong value + few semi-bluffs. Maximize protection.</>],
                  [<><strong>Paired high-high-low (A-A-8)</strong></>, <>Pure check-call. BB lacks the pair → no XR value.</>],
                  [<><strong>Paired high-low-low (A-8-8)</strong></>, <>Check-raise the pair (8x). BB has the pair.</>],
                  [<><strong>Turns</strong></>, <>Almost never donk-lead (~≤10%).</>],
                  [<><strong>Rivers</strong></>, <>Donk-jam only if opponent under-bluffs; default check.</>]]} />
                      <Callout variant="bad"><strong>A smaller raise size for IP kills your check-raise range.</strong> When IP can click-raise (not just jam), OOP check-raise freq collapses. Non-all-in check-raises 'really suck in ICM.'</Callout>
              

<Subhead>Core Rules — BTN C-bet (covering)</Subhead>
              <p><strong>Range-bet boards:</strong> Ace-high (A-K-x, A-Q-x, A-7-x), K-high disconnected (K-9-3, K-J-2, K-4-3), Q-high disconnected, low boards (7-5-2, 8-5-3, 5-3-2), low paired (4-4-3, 6-6-3), high-high-low paired (K-K-2, K-K-4), A-side monotone (A-5-2♣).</p>
                      <p><strong>Check-back boards:</strong> Middling Broadway rainbow (K-Q-10: ~60% check), high-high-mid paired (K-K-9, K-K-8), monotone connecting OOP (A-K-8♣, A-9-8♣, K-J-3♣, K-9-8♣, Q-8-3♣, J-10-8♣), 10-9-8♣ monotone (~20% check threshold).</p>
              

<Subhead>Risk Factors (BTN c-bet)</Subhead>
              <p>In chip EV, BTN c-bet risk factors are: paired boards (high check-raise), low boards (BB doesn't fold enough), monotone boards (check back). In ICM these are largely <strong>neutralized</strong> because BB check-raises far less and BTN has more board coverage.</p>
                      <DataTable columns={[{ header: 'Remaining risk factor' }, { header: 'Effect' }]} rows={[[<><strong>Monotone connecting OOP</strong></>, <>Check back some (A-K-8♣, K-J-3♣, Q-8-3♣, J-10-8♣).</>],
                  [<><strong>Middling Broadway rainbow (K-Q-10)</strong></>, <>~60% check.</>],
                  [<><strong>High-high-mid paired (K-K-9)</strong></>, <>Mid card gives BB some pairs → check back.</>],
                  [<><strong>Deeper effective stacks</strong></>, <>More reverse implied odds when check-raised; check-back freq rises.</>]]} />
                      <Callout variant="good"><strong>If you cover by more than ~2x their stack, "closing your eyes and always range-betting" is approximately correct.</strong></Callout>
              

<Subhead>Sizing</Subhead>
              <p>BTN c-bet ~quarter pot (~1.8bb into ~5.5bb pot). BB check-raise on low boards: all-in (check-shove), not small. BB check-raise on ace-high: pure check-call — no raise. Equities that flip check-call → check-raise on Q/J-high: ~80%+. Equities that stay check-call on ace-high: ~88-90% (lockdown).</p>
            </>
    </Section>
  )
}

export default BM8Page
