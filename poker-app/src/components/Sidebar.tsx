import { useState } from 'react'
import type { QuizQuestion } from './ui'

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
  const [manual, setManual] = useState<Record<string, boolean>>({})
  const [seen, setSeen] = useState<string | null>(null)

  // Auto-expand when the active course changes (via navigation); keep manual toggles otherwise.
  if (activeCourse !== seen) {
    setSeen(activeCourse)
  }
  const isExpanded = (id: string) => (manual[id] !== undefined ? manual[id] : id === activeCourse)

  const toggleCourse = (id: string) => {
    setManual((prev) => ({ ...prev, [id]: !isExpanded(id) }))
  }

  const handleNavigate = (page: string) => onNavigate(page)

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">
        <h1>Poker Study Guide</h1>
        <div className="sub">{COURSES.length} courses · {COURSES.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.pages.length, 0), 0)} pages</div>
      </div>
      {COURSES.map((course) => {
        const expanded = isExpanded(course.id)
        const isActiveCourse = course.id === activeCourse
        return (
          <div key={course.id} className={`course ${expanded ? 'expanded' : ''} ${isActiveCourse ? 'active-course' : ''}`}>
            <div
              className="course-header"
              onClick={() => toggleCourse(course.id)}
            >
              <span className={`chevron ${expanded ? 'open' : ''}`}>›</span>
              <span className="course-label">{course.label}</span>
              <span className="course-count">{course.groups.reduce((n, g) => n + g.pages.length, 0)}</span>
            </div>
            {expanded && (
              <div className="course-body">
                {course.groups.map((group) => (
                  <div key={group.label} className="nav-group">
                    <div className="nav-label">{group.label}</div>
                    {group.pages.map((p) => (
                      <div
                        key={p.id}
                        className={`nav-item ${activePage === p.id ? 'active' : ''}`}
                        onClick={() => handleNavigate(p.id)}
                      >
                        <span className="num">{p.num}</span> {p.label}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
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
    <div className="cards-grid">
      {cards.map((card: [string, string], i: number) => (
        <div
          key={i}
          className={`flip ${flipped.has(i) ? 'flipped' : ''}`}
          onClick={() => toggle(i)}
        >
          <div className="flip-inner">
            <div className="face">
              <div className="q">{card[0]}</div>
              <div className="hint">tap to reveal</div>
            </div>
            <div className="face back">
              <div className="a">{card[1]}</div>
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

  return (
    <>
      <div className="progress">
        <div style={{ width: `${(score / questions.length) * 100}%` }} />
      </div>
      <div className="score">
        Score {score} / {questions.length}
      </div>
      {questions.map((item, qIdx) => {
        const picked = answers[qIdx]
        const answered = picked !== null
        const isCorrect = answered && picked === item.a
        return (
          <div key={qIdx} className="quiz-card">
            <div className="quiz-q">
              Q{qIdx + 1}/{questions.length}. {item.q}
            </div>
            <div className="choices">
              {item.o.map((opt, i) => {
                let cls = ''
                if (answered) {
                  if (i === item.a) cls = 'correct'
                  else if (i === picked) cls = 'wrong'
                }
                return (
                  <button
                    key={i}
                    className={`btn ${cls}`}
                    disabled={answered}
                    onClick={() => handlePick(qIdx, i)}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className="explanation" style={{ display: 'block' }}>
                <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong>{' '}
                {item.why}
              </div>
            )}
          </div>
        )
      })}
      {allAnswered && (
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          <h3 style={{ border: 'none', padding: 0 }}>
            Done — {score} / {questions.length}
          </h3>
          <p className="muted">
            {score === questions.length
              ? 'Clean run.'
              : score >= questions.length * 0.7
              ? 'Solid. Review the flashcards.'
              : 'Re-read this system and retry.'}
          </p>
          <button className="btn" onClick={reset}>Retake</button>
        </div>
      )}
    </>
  )
}
