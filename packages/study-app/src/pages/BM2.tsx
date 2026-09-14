import { Section, Callout, Leak, Action, Subhead, StackMatrix, DataTable } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { BTN_RFI_COVERED, CO_RFI_COVERED } from '@poker/design-system/src/data/ranges'

export function BM2Page() {
  return (
    <Section title="Open vs Bigger Stacks — You Are Covered">
      <p className="mb-1"><strong className="text-bad">Covered = they can bust you.</strong> A bigger stack behind you covers your entire stack — losing the pot ends your tournament.</p>
      <p>A stack (or several) behind covers you. You open much tighter than baseline, with the degree of tightness driven by how much the BB covers you, position of covering stacks, and presence of shorter stacks elsewhere.</p>

      <Leak items={[
        ['Autopilot shoving K7s/T9s/KTo at 12bb covered', 'offsuit Ax very poor and almost no open shoves — cut low pairs and the worst Ax'],
        ['Being way too tight at 30-40bb covered', "losing a raise-fold costs <10% of your stack — still open ~35%"],
      ]} />

      <>
              <StackMatrix
                colAxisLabel="BB stack relationship"
                rowAxisLabel="Your stack"
                colLabels={['Covered by heaps (BB 2x+ you)', 'Covered but close (game of chicken)']}
                rows={[
                  { label: 'BTN 9-12bb', cells: [
                    { content: <><Action variant="fold">~20%</Action> — Fold ~80%. No open shoves. Offsuit Ax very poor.</>, variant: 'fold' },
                    { content: <><Action variant="call">~28%</Action> — More open shoving. BB handicapped by risk.</>, variant: 'call' },
                  ]},
                  { label: 'BTN 25-30bb', cells: [
                    { content: <><Action variant="call">Tighter than baseline</Action> — Fringe trims; BB must risk heavily to pressure you.</>, variant: 'call' },
                    { content: <><Action variant="call">Moderate</Action> — Closer stacks widen slightly.</>, variant: 'call' },
                  ]},
                  { label: 'BTN 33-40bb', cells: [
                    { content: <><Action variant="bet">~35%</Action> — Don't over-tighten. BB must risk a lot to pressure you.</>, variant: 'bet' },
                    { content: <><Action variant="bet">~35%+</Action> — Forgiving at depth.</>, variant: 'bet' },
                  ]},
                  { label: 'UTG 16-29bb', cells: [
                    { content: <><Action variant="fold">~7-9%</Action> — Fold nines, AJo, KQo, A9s in some configs.</>, variant: 'fold' },
                    { content: <><Action variant="call">~13-14%</Action> — Covering the BB helps even if covered behind.</>, variant: 'call' },
                  ]},
                ]}
              />

              <Callout variant="bad"><strong>Same stack, different range.</strong> 12bb on the button is not static. Into a 53bb BB you open ~20%; into a 16bb BB you open ~28%. The BB's depth, not just yours, drives your range.</Callout>

              <p className="mt-6 mb-1 text-sm text-muted">Solved bubble opens for the same dynamic — the 13bb BTN covered by a 75bb BB opens ~26%, the 12bb BTN with a close 16bb BB opens ~39%, and a 10bb CO covered by 50/40bb stacks behind opens ~24%:</p>
              <RangeBrowser ranges={BTN_RFI_COVERED} />
              <RangeBrowser ranges={CO_RFI_COVERED} />

              <Subhead>What tightens you</Subhead>
              <ul>
                <li><strong>BB covers you by heaps:</strong> open very tight — they can destroy you postflop, donk, float.</li>
                <li><strong>Very short / micro stacks at other tables:</strong> tighten (FGS overlay — folding has positive $EV).</li>
                <li><strong>Covered by a massive stack (120bb+) when you're mid:</strong> trim thinnest hands; no wider than ~35% on BTN.</li>
              </ul>

              <Subhead>What loosens you</Subhead>
              <ul>
                <li><strong>BB is close to your stack (game of chicken):</strong> you can open a bit more; they risk tournament life playing back.</li>
                <li><strong>You're deeper (30-50bb) and covered:</strong> more forgiving — losing a raise-fold costs &lt;10% of stack.</li>
                <li><strong>You're the shortest at the table:</strong> loosen back up — can't rely on others busting.</li>
              </ul>

              <Subhead>Risk factors</Subhead>
              <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Open-shove hand shift (covered)</strong></>, <>Shift stronger — AQ not AJ. Offsuit Ax shove terribly. Drop A2s/A3s.</>],
                [<><strong>Low pairs (22-33) when covered and short</strong></>, <>Often fold — they block the blinds' pair-folds, hurting your fold equity.</>],
                [<><strong>Covered by one but cover the rest</strong></>, <>Still wider than baseline — covering player folds ~80%; you pressure the rest.</>],
                [<><strong>FGS: short stacks at other tables</strong></>, <>Tighten further — folding has positive $EV when others may bust before you.</>]]} />
              <Callout><strong>Folding is not zero EV on the bubble.</strong> With shorter stacks elsewhere, folding has positive $EV — and you get free hands coming next. This makes the thinnest opens pass.</Callout>

              <Subhead>Sizing</Subhead>
              <p>Min-raise dominant when covered (preserve tournament life, fold to reshoves). Open shoves drop sharply — and shift stronger (AQ, not AJ) when they do appear. BB 3-bet size vs a covering opener can be large/polar (~14bb) to deny price with Ax.</p>
            </>
    </Section>
  )
}

export default BM2Page
