import { useState, useMemo } from 'react'
import { Section, Callout } from '../components/ui'

// ---- Hand grid helpers ----
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const
type Rank = typeof RANKS[number]

// 169 canonical hands in order: AA, AKs, AQs, ... KK, KQs, ... 22
function handLabel(r1: Rank, r2: Rank): string {
  if (r1 === r2) return `${r1}${r2}`
  // higher rank first; 's' if suited, 'o' if offsuit
  const [hi, lo] = r1 < r2 ? [r2, r1] : [r1, r2]
  return `${hi}${lo}`
}

// Build the 13x13 grid cells (row = first rank, col = second rank)
// Upper triangle (col > row) = suited, diagonal = pairs, lower = offsuit
function buildGrid(): { row: Rank; col: Rank; hand: string; suited: boolean; pair: boolean }[][] {
  return RANKS.map((row) =>
    RANKS.map((col) => {
      const suited = col > row
      const pair = col === row
      return { row, col, hand: handLabel(row, col), suited, pair }
    })
  )
}

const GRID = buildGrid()

// ---- Placeholder range data ----
// Each scenario defines a set of hands (by canonical label) that are "in range".
// This is placeholder data — replace with real ranges later.
interface RangeScenario {
  id: string
  label: string
  category: string
  description: string
  // Hands included in the range, as canonical labels (e.g. "AA", "AKs", "T9o")
  hands: Set<string>
}

function hands(...labels: string[]): Set<string> {
  return new Set(labels)
}

// Helper: all suited hands with high card X and kicker >= Y
function suitedFrom(high: Rank, kickers: Rank[]): string[] {
  return kickers.map((k) => `${high}${k}s`)
}
function offsuitFrom(high: Rank, kickers: Rank[]): string[] {
  return kickers.map((k) => `${high}${k}o`)
}
function pairsFrom(top: Rank): string[] {
  const idx = RANKS.indexOf(top)
  return RANKS.slice(idx).map((r) => `${r}${r}`)
}
const SCENARIOS: RangeScenario[] = [
  {
    id: 'rfi-utg-20bb',
    label: 'RFI · UTG · 20bb',
    category: 'Preflop RFI',
    description: 'Raise-first-in from UTG at 20bb effective. Linear range; blockers over playability.',
    hands: hands(
      ...pairsFrom('2'),
      ...suitedFrom('A', ['K', 'Q', 'J', 'T', '9', '8', '7', '5', '4']),
      'A2s', 'A3s',
      ...offsuitFrom('A', ['K', 'Q', 'J', 'T']),
      'A9o', 'A8o',
      ...suitedFrom('K', ['Q', 'J', 'T', '9', '8']),
      ...offsuitFrom('K', ['Q', 'J']),
      ...suitedFrom('Q', ['J', 'T', '9']),
      'QJo',
      ...suitedFrom('J', ['T', '9', '8']),
      'JTo',
      ...suitedFrom('T', ['9', '8']),
      'T9o',
      '98s',
    ),
  },
  {
    id: 'rfi-btn-20bb',
    label: 'RFI · BTN · 20bb',
    category: 'Preflop RFI',
    description: 'Raise-first-in from the button at 20bb. Wide; suited connectors and one-gappers.',
    hands: hands(
      ...pairsFrom('2'),
      ...suitedFrom('A', ['K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']),
      ...offsuitFrom('A', ['K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']),
      ...suitedFrom('K', ['Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']),
      ...offsuitFrom('K', ['Q', 'J', 'T', '9', '8', '7', '6', '5']),
      ...suitedFrom('Q', ['J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']),
      ...offsuitFrom('Q', ['J', 'T', '9', '8', '7']),
      ...suitedFrom('J', ['T', '9', '8', '7', '6', '5', '4', '3', '2']),
      ...offsuitFrom('J', ['T', '9', '8']),
      ...suitedFrom('T', ['9', '8', '7', '6', '5', '4', '3', '2']),
      ...offsuitFrom('T', ['9', '8', '7']),
      ...suitedFrom('9', ['8', '7', '6', '5', '4', '3', '2']),
      '98o', 'T8o',
      ...suitedFrom('8', ['7', '6', '5', '4', '3', '2']),
      ...suitedFrom('7', ['6', '5', '4', '3', '2']),
      ...suitedFrom('6', ['5', '4', '3', '2']),
      ...suitedFrom('5', ['4', '3', '2']),
      ...suitedFrom('4', ['3', '2']),
      ...suitedFrom('3', ['2']),
    ),
  },
  {
    id: 'bubble-shove-15bb-hj',
    label: 'Bubble Shove · HJ · 15bb',
    category: 'Bubble Preflop',
    description: 'Open-jam from HJ at 15bb on the direct bubble. Min-raise dominant; this is the shove-only subset.',
    hands: hands(
      ...pairsFrom('7'),
      'AJs', 'AQo', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
      'AJo', 'ATo', 'A9o',
      'KQs', 'KJs', 'KTs',
      'KJo', 'KQo',
      'QJs', 'QTs',
      'QJo',
      'JTs',
    ),
  },
  {
    id: 'placeholder',
    label: 'More ranges coming',
    category: 'Placeholder',
    description: 'This is a scaffold. Add real range data to src/pages/RangeViewer.tsx (SCENARIOS array).',
    hands: hands(),
  },
]

// ---- Cell color logic ----
function cellClass(inRange: boolean): string {
  return inRange ? 'rv-cell in-range' : 'rv-cell'
}

export function RangeViewerPage() {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(SCENARIOS.map((s) => s.category)))
    return cats
  }, [])

  const [activeId, setActiveId] = useState(SCENARIOS[0].id)
  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0]
  const inRangeCount = active.hands.size

  return (
    <>
      <Section title="Range Viewer">
        <p>Interactive preflop range grid. Select a scenario to highlight the hands in range. Placeholder data — replace with real ranges in <code>src/pages/RangeViewer.tsx</code>.</p>
        <Callout variant="warn"><strong>Scaffold.</strong> Ranges shown are illustrative placeholders, not solver-verified. Add real range data to the <code>SCENARIOS</code> array.</Callout>
      </Section>

      <Section title="Scenarios">
        <div className="rv-scenarios">
          {categories.map((cat) => (
            <div key={cat} className="rv-category">
              <div className="rv-cat-label">{cat}</div>
              {SCENARIOS.filter((s) => s.category === cat).map((s) => (
                <button
                  key={s.id}
                  className={`rv-scenario-btn ${s.id === activeId ? 'active' : ''}`}
                  onClick={() => setActiveId(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="rv-active-desc">
          <h3>{active.label}</h3>
          <p className="muted">{active.description}</p>
          <p className="rv-count">{inRangeCount} combos in range</p>
        </div>
      </Section>

      <Section title="Hand Grid">
        <div className="rv-grid-wrap">
          <table className="rv-grid">
            <thead>
              <tr>
                <th></th>
                {RANKS.map((r) => <th key={r}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {GRID.map((rowCells, ri) => (
                <tr key={ri}>
                  <th className="rv-rowhead">{RANKS[ri]}</th>
                  {rowCells.map((cell, ci) => {
                    const inRange = active.hands.has(cell.hand)
                    return (
                      <td
                        key={ci}
                        className={cellClass(inRange)}
                        title={cell.hand}
                      >
                        {cell.hand}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rv-legend">
          <span className="rv-legend-item"><span className="rv-swatch in-range" /> In range</span>
          <span className="rv-legend-item"><span className="rv-swatch" /> Out of range</span>
        </div>
      </Section>
    </>
  )
}

export default RangeViewerPage
