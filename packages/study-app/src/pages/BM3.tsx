import { Section, Callout, Action, Collapsible, StackMatrix, DataTable } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { UTG_RFI_COVERING } from '@poker/design-system/src/data/ranges'

export function BM3Page() {
  return (
    <Section title="Opening Into Covering Stacks (You Cover)">
      <p>You cover most/all stacks behind. Open significantly wider than the ICM equal-stack baseline — often 2x+ from EP. Key adjustments: how much you cover and whether the blinds are deep or very short.</p>

      <>
              <StackMatrix
                colAxisLabel="BB stack depth"
                rowAxisLabel="Your cover ratio"
                colLabels={['BB deep (40-68bb)', 'BB very short (sub-5bb)']}
                rows={[
                  { label: 'Cover by 2x+ (BTN)', cells: [
                    { content: <><Action variant="bet">~75% VPIP</Action> — Low suited connectors, low pairs, suited high-low all OK.</>, variant: 'bet' },
                    { content: <><Action variant="bet">~75% + heavy shoves</Action> — High-card dense, Ax-heavy. Drop speculative for raw equity.</>, variant: 'bet' },
                  ]},
                  { label: 'Cover but close (BTN)', cells: [
                    { content: <><Action variant="call">~68%</Action> — Dial back — losing leaves you short (7bb).</>, variant: 'call' },
                    { content: <><Action variant="call">~68% + shoves</Action> — Closer stacks still allow shoves but less freely.</>, variant: 'call' },
                  ]},
                  { label: 'Cover by 2x+ (UTG)', cells: [
                    { content: <><Action variant="bet">~35%</Action> — 2x+ baseline. Like a 30bb CO open.</>, variant: 'bet' },
                    { content: <><Action variant="call">~18-20%</Action> — High-card heavy; drop suited connectors.</>, variant: 'call' },
                  ]},
                  { label: 'Cover but close (UTG)', cells: [
                    { content: <><Action variant="call">~25-26%</Action> — Wider than baseline; trim thinnest.</>, variant: 'call' },
                    { content: <><Action variant="call">~13-14%</Action> — Tighter; closer stacks hurt.</>, variant: 'call' },
                  ]},
                ]}
              />

              <Callout variant="warn"><strong>Open shoves are heavily underused by regs when covering on the bubble.</strong>

<p className="mt-6 mb-1 text-sm text-muted">Solved covering opens — UTG at 50bb covering 12&ndash;24bb stacks (BB 4bb) opens ~28%, and at 100bb covering the table ~32%, roughly double the equal-stack bubble baseline. These nodes also carry a half-stack raise option; the panels show the primary 2bb open:</p>
              <RangeBrowser ranges={UTG_RFI_COVERING} /> When blinds are sub-20-25bb and you cover, open-shove a huge chunk of your range. Defaulting to min-raise/fold with 70-85% of hands leaves massive raise-fold equity on the table.</Callout>
              <Callout variant="good"><strong>Being covered by one or two players does NOT mean play tight.</strong> If you cover the rest (especially the BB), you still open wider than baseline. The covering player folds ~80%; you then pressure everyone you cover.</Callout>

              <Collapsible title="Composition by BB depth (when you cover)">
                <DataTable columns={[{ header: 'BB stack' }, { header: 'Open range composition' }]} rows={[[<><strong>Deep (40-68bb)</strong></>, <>Low suited connectors (54s, 76s), suited high-low (Q4s, J7s), lowest pairs (22-33) all acceptable — want playability.</>],
                  [<><strong>Mid (26bb)</strong></>, <>Sliver of low pairs, marginal suited connectors, marginal high-low suited.</>],
                  [<><strong>Very short (sub-5bb)</strong></>, <>High-card dense, Ace-X heavy. Drop suited connectors and low pairs — want raw equity.</>]]} />
              </Collapsible>

              <Collapsible title="Risk factors">
                <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Stacks behind close to yours</strong></>, <>Dial back top-line frequency; losing a pot hurts more.</>],
                  [<><strong>Blinds sub-20-25bb</strong></>, <>Heavy open shoving appears. Commonly missed by regs — a major leak.</>],
                  [<><strong>Blinds 30bb+</strong></>, <>Little/no open shove; min-raise range.</>],
                  [<><strong>Micro stack about to hit blinds (other table)</strong></>, <>Blinds disincentivized to play — ramp up opens.</>],
                  [<><strong>Covering and called</strong></>, <>Not a disaster — you still cover; losing the pot doesn't end your tournament.</>]]} />
              </Collapsible>

              <Collapsible title="Sizing">
                <p>Min-raise when blinds are 30bb+ (fold to reshoves, preserve optionality). Open shove a heavy chunk when blinds are sub-20-25bb — BB calls &lt;10%. UTG baseline ~16.5%; covering by 2x+ expands to ~35%.</p>
              </Collapsible>
            </>
    </Section>
  )
}

export default BM3Page
