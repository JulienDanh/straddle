import { Section, Callout, Subhead, DataTable, Small, Tag } from '@poker/design-system/src/components/ui'
import trees from '../data/solver-trees.json'

interface TreeEntry {
  name: string
  line: string
  system?: string
  pot: number
  effective_stack: number
  flop_oop: [string, string]
  flop_ip: [string, string]
  turn_donk: string | null
  ranges: { oop: string | null; ip: string | null }
  fidelity: string
  sources: string[]
}

const ENTRIES = trees as TreeEntry[]

function bb(pot: number, pct: string): string {
  const v = parseFloat(pct)
  if (Number.isNaN(v)) return pct
  return `${(pot * v / 100).toFixed(1)}bb`
}

function rangesCell(r: { oop: string | null; ip: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <Small>OOP {r.oop ?? '— pass --oop —'}</Small>
      <Small>IP {r.ip ?? '—'}</Small>
    </div>
  )
}

function sizesCell(t: TreeEntry) {
  const bet = t.flop_ip[0] === '' ? '—' : `${t.flop_ip[0]} (${bb(t.pot, t.flop_ip[0])})`
  const raise = t.flop_oop[1] === '' ? '—' : t.flop_oop[1]
  return (
    <div className="flex flex-col gap-0.5">
      <Small>IP bet {bet}</Small>
      <Small>OOP x-raise {raise}</Small>
      {t.turn_donk && <Small>Donk {t.turn_donk}</Small>}
    </div>
  )
}

export function SolverTreesPage() {
  const groups: { label: string; match: (t: TreeEntry) => boolean }[] = [
    { label: 'S1 · UTG vs BB call, 40bb', match: (t) => t.name.startsWith('s1-') },
    { label: 'UTG vs BB — depth ladder', match: (t) => t.name.startsWith('utg-bb-') },
    { label: 'S2 · BTN vs BB call', match: (t) => t.name.startsWith('s2-') || t.name.startsWith('btn-bb-') },
    { label: 'SB vs BB — blind battle', match: (t) => t.name.startsWith('sb-bb-') },
    { label: 'Vs 3-bet pots', match: (t) => t.name.startsWith('utg-vs-') },
  ]
  const rest = ENTRIES.filter((t) => !groups.some((g) => g.match(t)))

  return (
    <>
      <Section title="Solver Trees — Scenario Bet-Size Settings">
        <p>
          One bet-size tree per scenario for the open-source postflop solver (the <code>solver-runner</code> crate at the
          repo root). Sizes are read from the archived GTO Wizard captures cited per tree — not invented — and anything
          the captures do not cover is flagged as an approximation.
        </p>

        <Callout>
          <strong>Sizes come from captures, approximations are marked.</strong> The fidelity column tells you exactly
          what is real: where the flop, the check-raise and the turn donk were all captured, the tree is fully
          archive-derived; everything else says which parts are approximated. Solve with{' '}
          <code>solver-runner --config spot.json</code> after building the spot with{' '}
          <code>spot_from_store.py --tree &lt;name&gt;</code>.
        </Callout>

        {groups.map((g) => {
          const rows = ENTRIES.filter(g.match)
          if (rows.length === 0) return null
          return (
            <div key={g.label}>
              <Subhead>{g.label}</Subhead>
              <DataTable
                compact
                columns={[
                  { header: 'Tree' },
                  { header: 'Pot / Stack' },
                  { header: 'Flop sizes' },
                  { header: 'Ranges' },
                  { header: 'Fidelity' },
                ]}
                rows={rows.map((t) => [
                  <div className="flex flex-col gap-0.5">
                    <code className="text-[12px]">{t.name}</code>
                    <Small>{t.line}</Small>
                  </div>,
                  `${t.pot} / ${t.effective_stack}bb`,
                  sizesCell(t),
                  rangesCell(t.ranges),
                  <Tag>{t.fidelity}</Tag>,
                ])}
              />
            </div>
          )
        })}
        {rest.length > 0 && (
          <div>
            <Subhead>Other</Subhead>
            <DataTable compact columns={[{ header: 'Tree' }]} rows={rest.map((t) => [t.name])} />
          </div>
        )}
      </Section>
    </>
  )
}
