import { useState } from 'react'
import type { QuizQuestion } from './ui'

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
  open: boolean
}

const SYSTEMS = [
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
]

const BUBBLE = [
  { id: 'bmprimer', label: 'ICM & FGS Foundations', num: '·' },
  { id: 'bm1', label: 'ICM vs ChipEV Preflop', num: '1' },
  { id: 'bm2', label: 'Opening Into Covered', num: '2' },
  { id: 'bm3', label: 'Opening Into Covering', num: '3' },
  { id: 'bm4', label: 'Blind vs Blind', num: '4' },
  { id: 'bm5', label: 'Blinds Facing Open', num: '5' },
  { id: 'bm6', label: 'Dealing With 3-Bets', num: '6' },
  { id: 'bm7', label: 'Identifying Bubble Impact', num: '7' },
  { id: 'bm8', label: 'BTN Covers BB (Postflop)', num: '8' },
  { id: 'bm9', label: 'BB Covers BTN (Postflop)', num: '9' },
  { id: 'bm10', label: 'UTG Covers BB (Postflop)', num: '10' },
  { id: 'bm11', label: 'Polar Opens · Split Range', num: '11' },
]

export function Sidebar({ activePage, onNavigate, open }: SidebarProps) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">
        <h1>No-Limit Systems</h1>
        <div className="sub">Complete Study Guide</div>
      </div>
      <div className="nav-group">
        <div className="nav-label">Fundamentals</div>
        <div
          className={`nav-item ${activePage === 'primer' ? 'active' : ''}`}
          onClick={() => onNavigate('primer')}
        >
          <span className="num">·</span> Preflop Primer
        </div>
      </div>
      <div className="nav-group">
        <div className="nav-label">Systems</div>
        {SYSTEMS.map((s) => (
          <div
            key={s.id}
            className={`nav-item ${activePage === s.id ? 'active' : ''}`}
            onClick={() => onNavigate(s.id)}
          >
            <span className="num">{s.num}</span> {s.label}
          </div>
        ))}
      </div>
      <div className="nav-group">
        <div className="nav-label">Summary</div>
        <div
          className={`nav-item ${activePage === 'conclusion' ? 'active' : ''}`}
          onClick={() => onNavigate('conclusion')}
        >
          <span className="num">·</span> Cross-System Principles
        </div>
      </div>
      <div className="nav-group">
        <div className="nav-label">Bubble Mastery</div>
        {BUBBLE.map((s) => (
          <div
            key={s.id}
            className={`nav-item ${activePage === s.id ? 'active' : ''}`}
            onClick={() => onNavigate(s.id)}
          >
            <span className="num">{s.num}</span> {s.label}
          </div>
        ))}
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
