import { Section, Callout, Subhead, DataTable, Small } from '@poker/design-system/src/components/ui'

export function SizingPage() {
  return (
    <>
      <Section title="Sizing — The Bet-Size Tree">
        <p>Every size the course uses, one per decision point, in % of pot. The bb figures come from the solved spots: 40bb single-raised pot, 5.5bb after antes, so 20% pot = 1.1bb.</p>

        <Callout>
          <strong>Frequency dictates size, never the reverse.</strong> 100%-range strategies use a small size; polarized strategies use pot or bigger. If you know the frequency, the size follows — a solver confirms it, it doesn't choose it.
        </Callout>

        <Subhead>Preflop</Subhead>
        <DataTable
          compact
          columns={[{ header: 'Node' }, { header: 'Size' }, { header: 'Source' }]}
          rows={[
            ['RFI UTG–CO', '2bb (2.1 at 100bb)', 'Primer'],
            ['RFI BTN', '2.1–2.5bb · SB 3–3.5bb', 'Primer'],
            ['3-bet in position (CO/BTN vs open)', '5.5–6.5bb', 'BM6'],
            ['3-bet from the blinds', '7.5–9bb (8.5bb = 120% pot at 40bb) — size UP in ICM: deny equity, lower SPR', 'BM5'],
            ['4-bet', '~10–13.65bb IP · 15–18bb vs the blinds (jam-shaped)', 'BM6'],
          ]}
        />

        <Subhead>Flop</Subhead>
        <DataTable
          compact
          columns={[{ header: 'Node' }, { header: 'Size' }, { header: 'Source' }]}
          rows={[
            ['IP c-bet — range branch (T-high+ clean)', '20% pot (1.1bb)', 'S1/S2'],
            ['IP c-bet — polar branch (AKx · 9-high & below · straights)', '~73% pot (4bb)', 'S1'],
            ['Soft risk factors (monotone ace-high · high-low-low)', 'still 20% — handle the risk by checking more, not by sizing up', 'S1'],
            ['C-bet in 3-bet pots', '20–33% pot', 'S12'],
            ['OOP flop lead', 'None — BB checks on almost every texture', 'S1'],
            ['BB check-raise vs the small c-bet', 'to ~5.7bb — a small CR that keeps the c-bettor\'s range wide', 'S6'],
            ['BB check-raise vs the big c-bet', 'jam', 'S6'],
            ['Facing a check-raise', 'jam below ~35bb; above that call/fold per MDF — never min-raise', 'S7'],
          ]}
        />

        <Subhead>Turn</Subhead>
        <DataTable
          compact
          columns={[{ header: 'Node' }, { header: 'Size' }, { header: 'Source' }]}
          rows={[
            ['IP barrel', 'pot to geometric ~115% (the solver\'s "116% pot or check")', 'S5/S8'],
            ['IP small bets', 'Don\'t exist — "1/3 pot IP is almost never correct, the solver doesn\'t choose it"', 'S8'],
            ['Geometric stack-off', 'pot on turn + pot on river = all-in (~45bb eff. behind, 15bb pot)', 'S8'],
            ['OOP donk after calling the small c-bet', '~113% pot (8.7bb into 7.7)', 'solved spots'],
            ['OOP block bet (medium hands that can\'t check-raise)', '33% pot — forces ~75% defense', 'S10'],
            ['OOP check-raise vs the IP turn bet', 'pot or jam', 'S6'],
          ]}
        />

        <Subhead>River</Subhead>
        <DataTable
          compact
          columns={[{ header: 'Node' }, { header: 'Size' }, { header: 'Source' }]}
          rows={[
            ['IP bet — default value/bluff', '67% pot (a pot-sized bet needs 33% bluffs to be balanced)', 'S4/S11'],
            ['IP bet — villain capped (checked back, low nut ratio)', 'pot to overbet 130%+', 'S4/S10'],
            ['OOP block bet', '33% pot', 'S10'],
            ['OOP value/bluff', '67% pot', 'S4'],
            ['On the bubble when covered', 'non-all-in sizings — leave tournament equity behind, same size for value and bluffs', 'BM8/BM10'],
          ]}
        />

        <Subhead>Facing bets — defense calibration</Subhead>
        <DataTable
          compact
          columns={[{ header: 'Villain bets' }, { header: 'Defend' }, { header: 'Source' }]}
          rows={[
            ['25–33% pot', '~70–80% of range', 'S9'],
            ['50% pot', '~60–65%', 'S9'],
            ['83%+ pot', '~40–50% — fold more pairs and draws', 'S9'],
          ]}
        />
        <Small>MDF gives the ceiling: fold% = bet / (pot + bet). Fold <em>less</em> than MDF in practice — villain\'s bluffs carry equity (S7). Against very small bets the fold% approaches zero: "2bb into 6bb — almost nothing folds."</Small>

        <Callout variant="bad">
          <strong>Small bets are OOP tools.</strong> OOP block-bets 1/3 pot to deny a free polarized bet; IP betting small at the same spot reopens the action to check-raises for little reward — S10\'s named leak.
        </Callout>

        <Small>
          bb figures drift with depth: the range bet is 1.1bb (20%) at 40bb, 1.8bb (33%) at 50bb, ~2bb at 100bb —
          when the solver asks in bb, use the solved number for the depth; the % of pot holds. On the bubble, ICM
          bends every river size away from all-in (BM8/BM10).
        </Small>
      </Section>
    </>
  )
}

export default SizingPage
