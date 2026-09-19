import { Section, Callout, Leak, Subhead, DataTable } from '@poker/design-system/src/components/ui'

export const PS8_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Importing cash sizings into MTT short stacks', 'the 250% overbet that should be a jam'],
  ['Importing MTT jam-or-fold habits into deep cash', 'missing the full trap/induce ladder'],
  ['Treating bubble rivers like cEV rivers', 'bluffing/hero-calling at cEV frequency'],
  ['Abandoning the four questions in an unfamiliar format', 're-run them — no format exception exists'],
  ['Forgetting checked-down pots increase under ICM', 'passive lines are a final-table skill'],
]

export function PS8Page() {
  return (
    <Section title="PS8 — Versatility: Same Principles Across Formats">
      <p>Passive-line strategy is built from <strong>four questions that never change</strong>. The systems were derived in 100bb cash or specific MTT configurations — but the four questions, and the shapes they produce (linear small bets, polar big bets, traps, check-raise jams), port across every format. What changes between formats is only the <strong>sizing ladder and the aggression budget</strong>.</p>

      <Leak items={PS8_LEAKS} />

      <DataTable
        columns={[{ header: 'Question' }, { header: 'What it asks' }, { header: 'What it licenses' }]}
        rows={[
          [
            <><strong>1 · Capping</strong></>,
            <>What did each action remove from each range?</>,
            <>A check-back removes nutted hands; a big-bet call removes trash; an XR call removes both folds and monsters</>,
          ],
          [
            <><strong>2 · Nut vs equity advantage</strong></>,
            <>Who holds the nutted region vs who holds raw equity?</>,
            <>Nut advantage licenses polar bets and traps; equity advantage licenses frequent thin bets — <strong>confusing them is the root error</strong></>,
          ],
          [
            <><strong>3 · Card classes</strong></>,
            <>Draw-completers / overcards / bricks / pairers</>,
            <>Equity shifts in known directions after checked flops</>,
          ],
          [
            <><strong>4 · Blockers</strong></>,
            <>Suit and rank interactions with their folded/calling/raising regions</>,
            <>Which bluffs, which calls, which traps</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>"Four questions, every format: capped? nuts? card class? blockers?"</strong> — Stack depth sets the sizing ladder, never the shapes. OOP = small bets + check-raises; IP = big bets + checks — everywhere.</Callout>

      <Subhead>The sizing ladder by context</Subhead>
      <DataTable
        columns={[{ header: 'Context' }, { header: 'Ladder' }]}
        rows={[
          [
            <><strong>Deep cash (100bb+)</strong></>,
            <>Full menu: 10% block · 33% linear · 50–75% value · 150–250% polar overbets; blockers gain power</>,
          ],
          [
            <><strong>MTT mid (30–60bb)</strong></>,
            <>Overbets become jams; block bets persist; card-class logic unchanged</>,
          ],
          [
            <><strong>MTT short (15–30bb)</strong></>,
            <>Jam-or-check; XC-X thin leads matter most; traps compress to CR-jams</>,
          ],
          [
            <><strong>ICM-heavy (bubble/FT)</strong></>,
            <>Same ladders, smaller bluff/hero-call budget — value bets and traps keep EV</>,
          ],
        ]}
      />

      <Subhead>One node, five formats — BB vs BTN, T72r, checked-back flop</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Context' }, { header: 'Turn decision' }]}
        rows={[
          ['100bb cash, turn 8', 'Probe 33% linear (PS1 Bucket A)'],
          ['40bb MTT, turn A', '250% polar overbet becomes a jam with two pair+ / nut-blocker bluffs'],
          ['20bb MTT, turn A', 'Check-raise jam replaces the probe entirely at this SPR'],
          ['Bubble 35bb, brick turn', 'Probe small for thin value stands; the polar bluff portion checks instead'],
          ['FT 25bb river, XX-XX, nutted OOP', 'Trap via check-raise jam — ICM makes villain\u2019s stabs honest'],
          ['NL200 200bb, same river', 'Check, check-raise small to induce — deep stacks reward the extra street of money'],
        ]}
      />

      <Subhead>Population reads per format</Subhead>
      <ul>
        <li><strong>Cash regs:</strong> balanced check-backs, some river CRs — closest to solver shapes.</li>
        <li><strong>MTT fields:</strong> over-c-bet draws, under-bluff rivers, rarely CR rivers — the PS4/PS7 exploit ladder runs hot.</li>
        <li><strong>Recreational/spins:</strong> condensed leads (raise them — PS6), under-folded small bets (block bets become pure value tools).</li>
        <li><strong>Format incentives:</strong> antes → wider ranges → more thin value; rake → tighter ranges → probe more often; FT pay jumps → the most capped, checked-down rivers in poker.</li>
      </ul>

      <Callout variant="bad"><strong>ICM mutes bluffs and hero-calls, never value and traps.</strong> And the more everyone checks, the more passive-line skill pays — checked-down pots spike in frequency at final tables as every range condenses.</Callout>
    </Section>
  )
}

export default PS8Page
