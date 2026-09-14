import { Section, Callout, Action, Subhead, StackMatrix, DataTable } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { SB_RFI_BUBBLE, BB_VS_SB_LIMP, BB_VS_SB_RAISE_BUBBLE } from '@poker/design-system/src/data/ranges'

export function BM4Page() {
  return (
    <Section title="Blind vs Blind on the Bubble">
      <p>SB vs BB, one stack covers the other. The covered stack plays very tight (shove/fold, almost no limping short); the covering stack leverages chip advantage with aggressive open-shoving and raising to deny free equity. Limping only reappears at ~18bb+ effective and especially deeper.</p>

      <>
              <StackMatrix
                colAxisLabel="Who covers"
                rowAxisLabel="Stack depth"
                colLabels={['SB covers BB', 'SB covered by BB']}
                rows={[
                  { label: 'Short (≤12bb)', cells: [
                    { content: <><Action variant="bet">Aggressive shove/raise</Action> — No limps. BB overfolds ~85%.</>, variant: 'bet' },
                    { content: <><Action variant="fold">Tight shove/fold</Action> — ~33% VPIP. No limps. Folding has value.</>, variant: 'fold' },
                  ]},
                  { label: 'Close (14-17bb)', cells: [
                    { content: <><Action variant="bet">High VPID</Action> — Game of chicken; more open-shoving.</>, variant: 'bet' },
                    { content: <><Action variant="call">Wider VPID</Action> — Game of chicken; BB can't defend wide.</>, variant: 'call' },
                  ]},
                  { label: 'Deeper (18-22bb)', cells: [
                    { content: <><Action variant="call">More raising, some limps</Action> — Less ISO leverage for BB.</>, variant: 'call' },
                    { content: <><Action variant="call">Limping begins</Action> — ~18bb threshold. Raise-fold marginal.</>, variant: 'call' },
                  ]},
                  { label: 'Deep (37+bb)', cells: [
                    { content: <><Action variant="bet">Lots of limps</Action> — BB can't pile; SB limp range weak/uncapped.</>, variant: 'bet' },
                    { content: <><Action variant="bet">Pure limp</Action> — BB ISO ~49.5%. No limp-shove — limp-call pairs.</>, variant: 'bet' },
                  ]},
                ]}
              />

              <Callout variant="bad"><strong>Limping is a MISTAKE when you cover a short stack on the bubble.</strong>

<p className="mt-6 mb-1 text-sm text-muted">The blind-vs-blind decisions, solved — SB's first-in (limp or raise), BB's iso-or-check vs the limp, and BB's defense vs the 3bb raise. Toggle cEV / ICM to see bubble pressure halve BB's call frequency:</p>
              <RangeBrowser ranges={SB_RFI_BUBBLE} />
              <RangeBrowser ranges={BB_VS_SB_LIMP} />
              <RangeBrowser ranges={BB_VS_SB_RAISE_BUBBLE} /> BB overfolds ~85%. Limping gives free equity realization to hands that would fold to a shove. Shove/raise instead.</Callout>

              <Subhead>Core rules</Subhead>
              <DataTable columns={[{ header: 'Rule' }, { header: 'Detail' }]} rows={[[<><strong>BB calls only ~10-22%</strong></>, <>vs ~37% call rate in chip model. ICM pressure roughly halves BB call frequency.</>],
                [<><strong>Open-shove selection shifts UP in ICM</strong></>, <>Drop A2s/A3s; threshold shifts past AJo to AQo. Bluffs shift up with value.</>],
                [<><strong>Limp-shove disappears at 40+bb</strong></>, <>Limp-call pairs instead — BB can't pile vs uncapped, trapping range.</>],
                [<><strong>Covering SB at ~22bb</strong></>, <>Shove vs limp depends on other-table ICM pressure. More pressure = more shoving.</>]]} />

              <Subhead>Risk factors</Subhead>
              <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Other-table short stacks</strong></>, <>Covering SB leans harder into shoving/raising (max ICM pressure on BB).</>],
                [<><strong>BB call frequency</strong></>, <>BB calls only ~10-22% when covered (vs ~37% in chip model). Limping gives free equity to folders.</>],
                [<><strong>At 25% field left</strong></>, <>Limping reappears for covered short stacks; on direct bubble, gone.</>]]} />

              <Subhead>Sizing</Subhead>
              <p>Short covered: pure shove/fold. Close stacks: more open-shoving. Deeper covered (~18bb+): limping begins. Deep (37+bb): pure limp, no limp-shove — limp-call pairs. BB ISO ~49.5% (vs 42% chips) when SB is covered deep.</p>
            </>
    </Section>
  )
}

export default BM4Page
