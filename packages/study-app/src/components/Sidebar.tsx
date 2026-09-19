import { useEffect, useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@poker/design-system/src/components/ui-shadcn/accordion'

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
  open: boolean
}

interface NavPage {
  id: string
  label: string
  num: string
}
interface NavGroup {
  label: string
  pages: NavPage[]
}
interface Course {
  id: string
  label: string
  groups: NavGroup[]
}

const COURSES: Course[] = [
  {
    id: 'nlh',
    label: 'No-Limit Systems',
    groups: [
      {
        label: 'Fundamentals',
        pages: [{ id: 'primer', label: 'Preflop Primer', num: '·' }],
      },
      {
        label: 'Systems',
        pages: [
          { id: 's1', label: 'UTG vs BB · C-bet', num: '1' },
          { id: 's2', label: 'BTN vs BB · C-bet', num: '2' },
          { id: 's3', label: 'BB vs SB Limp Stab', num: '3' },
          { id: 's4', label: 'River Bluffing', num: '4' },
          { id: 's5', label: 'Barreling Med Hands', num: '5' },
          { id: 's6', label: 'Check-Raising Top Pair', num: '6' },
          { id: 's7', label: 'C-bet Folding Flops', num: '7' },
          { id: 's8', label: 'Bet Sizing IP', num: '8' },
          { id: 's9', label: 'Defending Flops', num: '9' },
          { id: 's10', label: 'River Value Betting', num: '10' },
          { id: 's11', label: 'Hero Calling', num: '11' },
          { id: 's12', label: 'Defending 3-Bets OOP', num: '12' },
        ],
      },
      {
        label: 'Summary',
        pages: [
          { id: 'conclusion', label: 'Cross-System Principles', num: '·' },
          { id: 'sizing', label: 'Sizing — The Bet-Size Tree', num: '·' },
          { id: 'examples', label: 'Examples — Every System', num: '·' },
        ],
      },
    ],
  },
  {
    id: 'bm',
    label: 'Bubble Mastery',
    groups: [
      {
        label: 'Foundations',
        pages: [
          { id: 'bmprimer', label: 'ICM & FGS Foundations', num: '·' },
          { id: 'bm1', label: 'ICM vs ChipEV Preflop', num: '1' },
        ],
      },
      {
        label: 'Preflop',
        pages: [
          { id: 'bm2', label: 'Open vs Bigger Stacks', num: '2' },
          { id: 'bm3', label: 'Open vs Smaller Stacks', num: '3' },
          { id: 'bm4', label: 'Blind vs Blind', num: '4' },
          { id: 'bm5', label: 'Blinds Facing Open', num: '5' },
          { id: 'bm6', label: 'Dealing With 3-Bets', num: '6' },
        ],
      },
      {
        label: 'Postflop',
        pages: [
          { id: 'bm7', label: 'Identifying Bubble Impact', num: '7' },
          { id: 'bm8', label: 'BTN Covers BB', num: '8' },
          { id: 'bm9', label: 'BB Covers BTN', num: '9' },
          { id: 'bm10', label: 'UTG Covers BB', num: '10' },
          { id: 'bm11', label: 'Polar Opens · Split Range', num: '11' },
        ],
      },
    ],
  },
  {
    id: 'ps',
    label: 'Pressure Systems',
    groups: [
      {
        label: 'Systems',
        pages: [
          { id: 'p1', label: 'Preflop Squeezing', num: '1' },
          { id: 'p2', label: 'Facing Squeezes', num: '2' },
          { id: 'p3', label: 'Flop Big-Betting vs BB', num: '3' },
          { id: 'p4', label: 'Flop Check-Raising', num: '4' },
        ],
      },
    ],
  },
  {
    id: 'passive',
    label: 'Passive Poker Systems',
    groups: [
      {
        label: 'Turn',
        pages: [
          { id: 'ps1', label: 'BB Turn Probe Betting', num: '1' },
          { id: 'ps2', label: 'Defending vs Probes', num: '2' },
        ],
      },
      {
        label: 'River',
        pages: [
          { id: 'ps3', label: 'OOP after XC-X', num: '3' },
          { id: 'ps4', label: 'IP after Cbet-X', num: '4' },
          { id: 'ps5', label: 'OOP after XR-X', num: '5' },
          { id: 'ps6', label: 'OOP after XX-XX', num: '6' },
          { id: 'ps7', label: 'IP after XX-XX', num: '7' },
        ],
      },
      {
        label: 'Synthesis',
        pages: [{ id: 'ps8', label: 'Versatility', num: '8' }],
      },
    ],
  },
  {
    id: 'bounty',
    label: 'Bounty MTT',
    groups: [
      {
        label: 'Foundations',
        pages: [{ id: 'b1', label: 'Bounty Math & Risk Premiums', num: '1' }],
      },
      {
        label: 'Systems',
        pages: [
          { id: 'b2', label: 'PKO Preflop Adjustments', num: '2' },
          { id: 'b3', label: 'PKO Phase Strategy', num: '3' },
          { id: 'b4', label: 'Mystery Bounty System', num: '4' },
        ],
      },
    ],
  },
  {
    id: 'mw',
    label: 'Multiway Systems',
    groups: [
      {
        label: 'Flop',
        pages: [
          { id: 'mw1', label: 'Missed BB Donk Bets', num: '1' },
          { id: 'mw2', label: 'Missed Flop Bets', num: '2' },
          { id: 'mw3', label: 'Poor Flop Raises', num: '3' },
          { id: 'mw4', label: 'Missed Flop Squeezes', num: '4' },
          { id: 'mw5', label: 'Flop Calls from BB', num: '5' },
          { id: 'mw6', label: 'Flop Folds from BB', num: '6' },
        ],
      },
      {
        label: 'Turn & River',
        pages: [
          { id: 'mw7', label: 'Missed Turn Probes', num: '7' },
          { id: 'mw8', label: 'Missed Turn Cbets', num: '8' },
          { id: 'mw9', label: 'River Bets as OOP', num: '9' },
          { id: 'mw10', label: 'River Bets as IP', num: '10' },
          { id: 'mw11', label: 'Missed River Calls', num: '11' },
        ],
      },
    ],
  },
  {
    id: 'lp',
    label: 'SB Mastery · Limped Pots',
    groups: [
      {
        label: 'Preflop & Flop',
        pages: [
          { id: 'lp1', label: 'SB Limp Raise or Fold', num: '1' },
          { id: 'lp2', label: 'SB Flop Betting', num: '2' },
          { id: 'lp3', label: 'SB Flop Checks', num: '3' },
          { id: 'lp4', label: 'BB Defense', num: '4' },
          { id: 'lp5', label: 'Vs the BB Isolation', num: '5' },
        ],
      },
      {
        label: 'Turn, River & Exploits',
        pages: [
          { id: 'lp6', label: 'Turn Barrels · Geometry', num: '6' },
          { id: 'lp7', label: 'River Value & Bluffing', num: '7' },
          { id: 'lp8', label: 'Exploiting Errors', num: '8' },
        ],
      },
    ],
  },
  {
    id: 'rs',
    label: 'River Simplifications',
    groups: [
      {
        label: 'Toy games',
        pages: [
          { id: 'rs1', label: 'Symmetric Ranges by SPR', num: '1' },
          { id: 'rs2', label: 'Condensed IP', num: '2' },
          { id: 'rs3', label: 'Condensed OOP', num: '3' },
          { id: 'rs4', label: 'Condensed IP + Traps', num: '4' },
          { id: 'rs5', label: 'Condensed OOP + Traps', num: '5' },
          { id: 'rs6', label: 'Small Bets IP', num: '6' },
          { id: 'rs7', label: 'Polar OOP vs Condensed IP', num: '7' },
        ],
      },
    ],
  },
]

function courseOfPage(pageId: string): string {
  for (const c of COURSES) {
    if (c.groups.some((g) => g.pages.some((p) => p.id === pageId))) return c.id
  }
  return COURSES[0].id
}

export function Sidebar({ activePage, onNavigate, open }: SidebarProps) {
  const activeCourse = courseOfPage(activePage)
  // controlled so the accordion always reveals the active page's course,
  // even when navigation happens outside the sidebar (prev/next, keys)
  const [openCourse, setOpenCourse] = useState(activeCourse)
  useEffect(() => setOpenCourse(activeCourse), [activeCourse])

  return (
    <aside
      className={`w-[260px] flex-shrink-0 bg-dark border-r border-line sticky top-0 h-screen overflow-y-auto py-[18px] [@media(max-width:760px)]:fixed [@media(max-width:760px)]:left-[-270px] [@media(max-width:760px)]:z-30 [@media(max-width:760px)]:transition-all [@media(max-width:760px)]:duration-200 ${open ? '[@media(max-width:760px)]:!left-0' : ''}`}
    >
      <div className="px-[18px] pb-3.5 border-b border-line mb-2.5">
        <h1 className="text-[15px] tracking-wide">Poker Study Guide</h1>
        <div className="text-[11px] text-muted mt-0.5">{COURSES.length} courses · {COURSES.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.pages.length, 0), 0)} pages</div>
      </div>
      <Accordion type="single" value={openCourse} onValueChange={setOpenCourse} collapsible className="w-full">
        {COURSES.map((course) => {
          const isActiveCourse = course.id === activeCourse
          return (
            <AccordionItem key={course.id} value={course.id} className="border-b border-line">
              <AccordionTrigger className="flex items-center gap-2 px-[18px] py-3 cursor-pointer hover:bg-panel2 hover:no-underline [&>svg]:hidden">
                <span className={`flex-1 text-[13px] font-semibold tracking-tight ${isActiveCourse ? 'text-accent' : 'text-txt'}`}>{course.label}</span>
                <span className="text-[10px] text-muted bg-dark border border-line rounded-full px-1.5 py-px">{course.groups.reduce((n, g) => n + g.pages.length, 0)}</span>
                <span className="text-[9px] text-muted transition-transform [[data-state=open]>&]:rotate-90">▶</span>
              </AccordionTrigger>
              <AccordionContent className="py-0.5 pb-2.5">
                {course.groups.map((group) => (
                  <div key={group.label} className="px-2.5 my-2.5">
                    <div className="text-[10px] uppercase tracking-widest text-muted px-2 py-1 mb-1">{group.label}</div>
                    {group.pages.map((p) => (
                      <div
                        key={p.id}
                        className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-[12.5px] cursor-pointer border transition-colors select-none ${
                          activePage === p.id
                            ? 'bg-panel2 text-accent border-accent/40 shadow-[0_0_14px_rgba(0,240,255,0.10)]'
                            : 'text-muted border-transparent hover:bg-panel2 hover:text-txt'
                        }`}
                        onClick={() => onNavigate(p.id)}
                      >
                        {/^\d+$/.test(p.num) && (
                          <span className={`text-[10px] w-5 text-center bg-dark border rounded px-0 py-px ${activePage === p.id ? 'text-accent border-accent' : 'text-muted border-line'}`}>{p.num}</span>
                        )}
                        {p.label}
                      </div>
                    ))}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
      <div className="px-2.5 mt-4 border-t border-line pt-3">
        <div className="text-[10px] uppercase tracking-widest text-muted px-2 py-1 mb-1">Tools</div>
        {([
          { id: 'notes', label: 'Daily Notes' },
          { id: 'live', label: 'Live' },
          { id: 'liveasym', label: 'ICM asym' },
          { id: 'livepko', label: 'PKO' },
          { id: 'solvertrees', label: 'Solver Trees' },
        ] as const).map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-[12.5px] cursor-pointer border transition-colors select-none ${
              activePage === t.id
                ? 'bg-panel2 text-accent border-accent/40 shadow-[0_0_14px_rgba(0,240,255,0.10)]'
                : 'text-muted border-transparent hover:bg-panel2 hover:text-txt'
            }`}
            onClick={() => onNavigate(t.id)}
          >
            <span className="text-[10px] w-5 text-center bg-dark border border-line rounded px-0 py-px">&middot;</span> {t.label}
          </div>
        ))}
      </div>
    </aside>
  )
}
