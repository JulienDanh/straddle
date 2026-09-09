import { useState, useCallback } from 'react'
import { RandomBoard } from './ui-parts/cards'
import { Action } from './ui-parts/primitives'
import { Button } from '@/components/ui-shadcn/button'
import { Card } from '@/components/ui-shadcn/card'
import type { RandomBoardProps } from './ui-parts/cards'
import { revealOptionClass, feedbackBoxClass } from './quiz-shared'

export interface StrategyQuizOption {
  label: string
  variant: 'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'
}

export interface StrategyQuizScenario {
  // Board generator props
  board: RandomBoardProps
  // Correct action
  correct: StrategyQuizOption
  // Why this is correct
  explanation: string
}

export interface StrategyQuizProps {
  title?: string
  scenarios: StrategyQuizScenario[]
  // The actions the user can choose from (shared across all scenarios)
  options: StrategyQuizOption[]
}

export function StrategyQuiz({ title = 'Strategy Quiz', scenarios, options }: StrategyQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * scenarios.length))
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const scenario = scenarios[currentIndex]

  const handlePick = useCallback((idx: number) => {
    if (picked !== null) return
    setPicked(idx)
    setAttempts(a => a + 1)
    if (options[idx].label === scenario.correct.label) {
      setScore(s => s + 1)
    }
  }, [picked, scenario, options])

  const handleNext = useCallback(() => {
    setPicked(null)
    setCurrentIndex(Math.floor(Math.random() * scenarios.length))
  }, [])

  const isCorrect = picked !== null && options[picked].label === scenario.correct.label

  return (
    <Card className="bg-panel border-line rounded-[14px] p-5 my-4 shadow-lg gap-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold border-l-[3px] border-accent pl-2.5">{title}</h2>
        <span className="text-sm text-muted">{score}/{attempts}</span>
      </div>

      {/* Board display */}
      <div className="flex justify-center mb-6">
        <RandomBoard {...scenario.board} size="md" />
      </div>

      {/* Action buttons */}
      {picked === null ? (
        <div className="flex flex-wrap gap-2 justify-center">
          {options.map((opt, i) => (
            <Button
              key={i}
              variant="outline"
              className="text-base px-5 py-2.5"
              onClick={() => handlePick(i)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      ) : (
        <>
          {/* Reveal: show picked + correct */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 justify-center items-center">
              {options.map((opt, i) => {
                const isThisCorrect = opt.label === scenario.correct.label
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

            {/* Explanation */}
            <div className={`p-3 rounded-lg border ${feedbackBoxClass(isCorrect)}`}>
              <div className="flex items-center gap-2 mb-1">
                <Action variant={scenario.correct.variant}>{scenario.correct.label}</Action>
                <span className="text-sm font-bold text-txt">
                  {isCorrect ? 'Correct.' : 'Not quite.'}
                </span>
              </div>
              <p className="text-sm text-muted">{scenario.explanation}</p>
            </div>

            {/* Next button */}
            <div className="flex justify-center">
              <Button variant="default" className="px-6 py-2" onClick={handleNext}>
                Next board
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

export default StrategyQuiz
