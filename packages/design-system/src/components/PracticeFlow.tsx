import { useState, useCallback } from 'react'
import { RandomBoard } from './ui-parts/cards'
import { Action } from './ui-parts/primitives'
import { Button } from './ui-shadcn/button'
import { Card } from './ui-shadcn/card'
import type { RandomBoardProps } from './ui-parts/cards'
import { revealOptionClass, feedbackBoxClass, shuffle } from './quiz-shared'

// ---- Shared types (re-exported from old components for compatibility) ----
export interface StrategyQuizOption {
  label: string
  variant: 'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'
}
export interface StrategyQuizScenario {
  board: RandomBoardProps
  correct: StrategyQuizOption
  explanation: string
}
export interface StrategyQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface PracticeFlowProps {
  title?: string
  quiz?: {
    options: StrategyQuizOption[]
    scenarios: StrategyQuizScenario[]
  }
  questions?: StrategyQuestion[]
}

export function PracticeFlow({ title = 'Practice', quiz, questions }: PracticeFlowProps) {
  const hasQuiz = !!quiz && quiz.scenarios.length > 0
  const hasQuestions = !!questions && questions.length > 0

  const [mode, setMode] = useState<'quiz' | 'questions'>(hasQuiz ? 'quiz' : 'questions')
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(() =>
    hasQuiz ? Math.floor(Math.random() * quiz!.scenarios.length) : 0,
  )

  // Questions state
  const [qOrder, setQOrder] = useState(() =>
    hasQuestions ? shuffle(questions!.map((_, i) => i)) : [],
  )
  const [qPos, setQPos] = useState(0)

  const switchMode = useCallback(
    (m: 'quiz' | 'questions') => {
      setMode(m)
      setPicked(null)
    },
    [],
  )

  // ---- Quiz mode ----
  const quizScenario = hasQuiz ? quiz!.scenarios[quizIndex] : null
  const quizOptions = hasQuiz ? quiz!.options : []

  const handleQuizPick = useCallback(
    (idx: number) => {
      if (picked !== null || !quizScenario) return
      setPicked(idx)
      setAttempts((a) => a + 1)
      if (quizOptions[idx].label === quizScenario.correct.label) setScore((s) => s + 1)
    },
    [picked, quizScenario, quizOptions],
  )

  const handleQuizNext = useCallback(() => {
    setPicked(null)
    setQuizIndex(Math.floor(Math.random() * quiz!.scenarios.length))
  }, [quiz])

  const quizCorrect = picked !== null && quizScenario && quizOptions[picked]?.label === quizScenario.correct.label

  // ---- Questions mode ----
  const currentQ = hasQuestions ? questions![qOrder[qPos]] : null

  const handleQPick = useCallback(
    (idx: number) => {
      if (picked !== null || !currentQ) return
      setPicked(idx)
      setAttempts((a) => a + 1)
      if (idx === currentQ.correct) setScore((s) => s + 1)
    },
    [picked, currentQ],
  )

  const handleQNext = useCallback(() => {
    setPicked(null)
    if (qPos + 1 >= qOrder.length) {
      setQOrder(shuffle(qOrder))
      setQPos(0)
    } else {
      setQPos(qPos + 1)
    }
  }, [qPos, qOrder])

  const qCorrect = picked !== null && currentQ && picked === currentQ.correct

  return (
    <Card className="bg-panel border-line rounded-[14px] p-5 my-4 shadow-lg gap-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold border-l-[3px] border-accent pl-2.5">{title}</h2>
        <span className="text-sm text-muted tabular-nums">{score}/{attempts}</span>
      </div>

      {/* Mode toggle */}
      {hasQuiz && hasQuestions && (
        <div className="flex gap-1 mb-5 bg-panel2 rounded-lg p-1 w-fit">
          <button
            onClick={() => switchMode('quiz')}
            className={`px-3 py-1 text-[12px] font-semibold rounded-md cursor-pointer transition-colors ${
              mode === 'quiz' ? 'bg-accent text-[#0c1117]' : 'text-muted hover:text-txt'
            }`}
          >
            Board spots
          </button>
          <button
            onClick={() => switchMode('questions')}
            className={`px-3 py-1 text-[12px] font-semibold rounded-md cursor-pointer transition-colors ${
              mode === 'questions' ? 'bg-accent text-[#0c1117]' : 'text-muted hover:text-txt'
            }`}
          >
            Rules Q&A
          </button>
        </div>
      )}

      {/* ---- Quiz mode ---- */}
      {mode === 'quiz' && quizScenario && (
        <>
          <div className="flex justify-center mb-6">
            <RandomBoard {...quizScenario.board} size="md" />
          </div>

          {picked === null ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {quizOptions.map((opt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="text-base px-5 py-2.5"
                  onClick={() => handleQuizPick(i)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {quizOptions.map((opt, i) => {
                  const isThisCorrect = opt.label === quizScenario.correct.label
                  const isThisPicked = i === picked
                  return (
                    <span
                      key={i}
                      className={`inline-block text-sm font-bold px-4 py-2 rounded-lg border ${revealOptionClass(isThisCorrect, isThisPicked)}`}
                    >
                      {opt.label}
                      {isThisPicked && !isThisCorrect && ' — your pick'}
                      {isThisCorrect && ' — correct'}
                    </span>
                  )
                })}
              </div>
              <div className={`p-3 rounded-lg border ${feedbackBoxClass(quizCorrect ?? false)}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Action variant={quizScenario.correct.variant}>{quizScenario.correct.label}</Action>
                  <span className="text-sm font-bold text-txt">
                    {quizCorrect ? 'Correct.' : 'Not quite.'}
                  </span>
                </div>
                <p className="text-sm text-muted">{quizScenario.explanation}</p>
              </div>
              <div className="flex justify-center">
                <Button variant="default" className="px-6 py-2" onClick={handleQuizNext}>
                  Next board
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ---- Questions mode ---- */}
      {mode === 'questions' && currentQ && (
        <>
          <div className="mb-4">
            <p className="text-[15px] text-txt font-medium">{currentQ.question}</p>
          </div>

          {picked === null ? (
            <div className="flex flex-col gap-2">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  className="text-left text-sm bg-panel2 border border-line text-txt px-4 py-2.5 rounded-lg cursor-pointer transition-colors hover:border-accent2 hover:bg-[#1d2738]"
                  onClick={() => handleQPick(i)}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                {currentQ.options.map((opt, i) => {
                  const isThisCorrect = i === currentQ.correct
                  const isThisPicked = i === picked
                  return (
                    <div
                      key={i}
                      className={`text-left text-sm border px-4 py-2.5 rounded-lg ${revealOptionClass(isThisCorrect, isThisPicked)}`}
                    >
                      {opt}
                      {isThisPicked && !isThisCorrect && ' — your pick'}
                      {isThisCorrect && ' — correct'}
                    </div>
                  )
                })}
              </div>
              <div className={`p-3 rounded-lg border ${feedbackBoxClass(qCorrect ?? false)}`}>
                <span className="text-sm font-bold text-txt">
                  {qCorrect ? 'Correct. ' : 'Not quite. '}
                </span>
                <span className="text-sm text-muted">{currentQ.explanation}</span>
              </div>
              <div className="flex justify-center">
                <Button variant="default" className="px-6 py-2" onClick={handleQNext}>
                  Next question
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}

export default PracticeFlow
