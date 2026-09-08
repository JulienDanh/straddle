import { useState } from 'react'
import type { QuizQuestion } from './ui'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui-shadcn/accordion'
import { Card } from '@/components/ui-shadcn/card'
import { Progress } from '@/components/ui-shadcn/progress'
import { Button } from '@/components/ui-shadcn/button'

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
        pages: [{ id: 'conclusion', label: 'Cross-System Principles', num: '·' }],
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
          { id: 'bm2', label: 'Opening Into Covered', num: '2' },
          { id: 'bm3', label: 'Opening Into Covering', num: '3' },
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
]

function courseOfPage(pageId: string): string {
  for (const c of COURSES) {
    if (c.groups.some((g) => g.pages.some((p) => p.id === pageId))) return c.id
  }
  return COURSES[0].id
}

export function Sidebar({ activePage, onNavigate, open }: SidebarProps) {
  const activeCourse = courseOfPage(activePage)

  const handleNavigate = (page: string) => onNavigate(page)

  return (
    <aside
      className={`w-[260px] flex-shrink-0 bg-dark border-r border-line sticky top-0 h-screen overflow-y-auto py-[18px] [@media(max-width:760px)]:fixed [@media(max-width:760px)]:left-[-270px] [@media(max-width:760px)]:z-30 [@media(max-width:760px)]:transition-all [@media(max-width:760px)]:duration-200 ${open ? '[@media(max-width:760px)]:!left-0' : ''}`}
    >
      <div className="px-[18px] pb-3.5 border-b border-line mb-2.5">
        <h1 className="text-[15px] tracking-wide">Poker Study Guide</h1>
        <div className="text-[11px] text-muted mt-0.5">{COURSES.length} courses · {COURSES.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.pages.length, 0), 0)} pages</div>
      </div>
      <Accordion type="single" defaultValue={activeCourse} collapsible className="w-full">
        {COURSES.map((course) => {
          const isActiveCourse = course.id === activeCourse
          return (
            <AccordionItem key={course.id} value={course.id} className="border-b border-line">
              <AccordionTrigger className="flex items-center gap-2 px-[18px] py-3 cursor-pointer hover:bg-panel2 hover:no-underline [&>svg]:hidden">
                <span className={`flex-1 text-[13px] font-semibold tracking-tight ${isActiveCourse ? 'text-accent' : 'text-txt'}`}>{course.label}</span>
                <span className="text-[10px] text-muted bg-dark border border-line rounded-full px-1.5 py-px">{course.groups.reduce((n, g) => n + g.pages.length, 0)}</span>
              </AccordionTrigger>
              <AccordionContent className="py-0.5 pb-2.5">
                {course.groups.map((group) => (
                  <div key={group.label} className="px-2.5 my-2.5">
                    <div className="text-[10px] uppercase tracking-widest text-muted px-2 py-1 mb-1">{group.label}</div>
                    {group.pages.map((p) => (
                      <div
                        key={p.id}
                        className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-[12.5px] cursor-pointer border border-transparent transition-colors select-none ${activePage === p.id ? 'bg-panel2 text-accent border-line' : 'text-muted hover:bg-panel2 hover:text-txt'}`}
                        onClick={() => handleNavigate(p.id)}
                      >
                        <span className={`text-[10px] w-5 text-center bg-dark border rounded px-0 py-px ${activePage === p.id ? 'text-accent border-accent' : 'text-muted border-line'}`}>{p.num}</span>
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
        <div
          className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-[12.5px] cursor-pointer border border-transparent transition-colors select-none ${activePage === 'rangeviewer' ? 'bg-panel2 text-accent border-line' : 'text-muted hover:bg-panel2 hover:text-txt'}`}
          onClick={() => handleNavigate('rangeviewer')}
        >
          <span className="text-[10px] w-5 text-center bg-dark border border-line rounded px-0 py-px">·</span> Range Viewer
        </div>
        <div
          className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-[12.5px] cursor-pointer border border-transparent transition-colors select-none ${activePage === 'sandbox' ? 'bg-panel2 text-accent border-line' : 'text-muted hover:bg-panel2 hover:text-txt'}`}
          onClick={() => handleNavigate('sandbox')}
        >
          <span className="text-[10px] w-5 text-center bg-dark border border-line rounded px-0 py-px">·</span> Design System
        </div>
      </div>
    </aside>
  )
}

export function Flashcards({ cards }: { cards: [string, string][] }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  if (!cards.length) return null

  return (
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
      {cards.map((card: [string, string], i: number) => (
        <div
          key={i}
          className="h-[150px] cursor-pointer [perspective:1000px]"
          onClick={() => toggle(i)}
        >
          <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped.has(i) ? '[transform:rotateY(180deg)]' : ''}`}>
            <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl border border-line p-3.5 flex flex-col justify-center items-center text-center bg-panel2">
              <div className="font-semibold text-[13.5px]">{card[0]}</div>
              <div className="text-[11px] text-muted mt-2">tap to reveal</div>
            </div>
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border border-line p-3.5 flex flex-col justify-center items-center text-center bg-dark">
              <div className="text-[12.5px] text-accent">{card[1]}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null))

  if (!questions.length) return null

  const score = answers.filter((a, i) => a === questions[i].a).length
  const allAnswered = answers.every((a) => a !== null)

  const handlePick = (qIdx: number, optIdx: number) => {
    if (answers[qIdx] !== null) return
    setAnswers(answers.map((a, i) => (i === qIdx ? optIdx : a)))
  }

  const reset = () => setAnswers(questions.map(() => null))

  const btnClass = (answered: boolean, isPicked: boolean, isAnswer: boolean) => {
    let cls = 'bg-panel border border-line text-txt px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors hover:border-accent2'
    if (answered) {
      if (isAnswer) cls = 'border-good bg-[#16352c] text-good cursor-default opacity-70'
      else if (isPicked) cls = 'border-bad bg-[#3a1f24] text-bad cursor-default opacity-70'
      else cls = 'border-line bg-panel text-txt cursor-default opacity-70'
    }
    return cls
  }

  return (
    <>
      <Progress value={(score / questions.length) * 100} className="h-1.5 my-1.5 mb-4 bg-panel2 [&>div]:bg-accent" />
      <div className="text-[13px] text-muted text-right">Score {score} / {questions.length}</div>
      {questions.map((item, qIdx) => {
        const picked = answers[qIdx]
        const answered = picked !== null
        const isCorrect = answered && picked === item.a
        return (
          <Card key={qIdx} className="bg-panel2 border-line rounded-xl p-4 my-3.5 gap-0">
            <div className="text-[13px] text-muted mb-2">Q{qIdx + 1}/{questions.length}. {item.q}</div>
            <div className="flex gap-2.5 flex-wrap mt-3">
              {item.o.map((opt, i) => (
                <button
                  key={i}
                  className={btnClass(answered, i === picked, i === item.a)}
                  disabled={answered}
                  onClick={() => handlePick(qIdx, i)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {answered && (
              <div className="mt-3 p-3 bg-dark rounded-lg border border-line text-[13px]">
                <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong>{' '}
                {item.why}
              </div>
            )}
          </Card>
        )
      })}
      {allAnswered && (
        <Card className="bg-panel2 border-line rounded-xl p-4 my-3.5 text-center gap-0">
          <h3 className="text-lg font-bold mb-1">Done — {score} / {questions.length}</h3>
          <p className="text-muted text-[13px]">
            {score === questions.length
              ? 'Clean run.'
              : score >= questions.length * 0.7
              ? 'Solid. Review the flashcards.'
              : 'Re-read this system and retry.'}
          </p>
          <Button variant="outline" className="mt-3" onClick={reset}>Retake</Button>
        </Card>
      )}
    </>
  )
}
