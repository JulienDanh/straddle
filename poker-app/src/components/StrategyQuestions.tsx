import { useState, useCallback } from 'react'
import { Button } from '@/components/ui-shadcn/button'
import { Card } from '@/components/ui-shadcn/card'

export interface StrategyQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export function StrategyQuestions({
  title = 'Questions',
  questions,
}: {
  title?: string
  questions: StrategyQuestion[]
}) {
  const [order, setOrder] = useState(() => shuffle(questions.map((_, i) => i)))
  const [pos, setPos] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const q = questions[order[pos]]

  const handlePick = useCallback((idx: number) => {
    if (picked !== null) return
    setPicked(idx)
    setAttempts(a => a + 1)
    if (idx === q.correct) setScore(s => s + 1)
  }, [picked, q])

  const handleNext = useCallback(() => {
    setPicked(null)
    if (pos + 1 >= order.length) {
      setOrder(shuffle(order))
      setPos(0)
    } else {
      setPos(pos + 1)
    }
  }, [pos, order])

  const isCorrect = picked !== null && picked === q.correct

  return (
    <Card className="bg-panel border-line rounded-[14px] p-5 my-4 shadow-lg gap-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold border-l-[3px] border-accent pl-2.5">{title}</h2>
        <span className="text-sm text-muted">{score}/{attempts}</span>
      </div>

      {/* Question */}
      <div className="mb-4">
        <p className="text-[15px] text-txt font-medium">{q.question}</p>
      </div>

      {/* Options */}
      {picked === null ? (
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className="text-left text-sm bg-panel2 border border-line text-txt px-4 py-2.5 rounded-lg cursor-pointer transition-colors hover:border-accent2 hover:bg-[#1d2738]"
              onClick={() => handlePick(i)}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Reveal options */}
          <div className="flex flex-col gap-2 mb-4">
            {q.options.map((opt, i) => {
              const isThisCorrect = i === q.correct
              const isThisPicked = i === picked
              let cls = 'opacity-50'
              if (isThisCorrect) cls = 'border-good bg-[rgba(95,208,168,0.15)] text-good'
              else if (isThisPicked && !isThisCorrect) cls = 'border-bad bg-[rgba(239,111,111,0.15)] text-bad'
              return (
                <div
                  key={i}
                  className={`text-left text-sm border px-4 py-2.5 rounded-lg ${cls}`}
                >
                  {opt}
                  {isThisPicked && !isThisCorrect && ' — your pick'}
                  {isThisCorrect && !isThisPicked && ' — correct'}
                  {isThisCorrect && isThisPicked && ' — correct'}
                </div>
              )
            })}
          </div>

          {/* Explanation */}
          <div className={`p-3 rounded-lg border mb-4 ${isCorrect ? 'border-good bg-[rgba(95,208,168,0.08)]' : 'border-bad bg-[rgba(239,111,111,0.08)]'}`}>
            <span className="text-sm font-bold text-txt">
              {isCorrect ? 'Correct. ' : 'Not quite. '}
            </span>
            <span className="text-sm text-muted">{q.explanation}</span>
          </div>

          {/* Next button */}
          <div className="flex justify-center">
            <Button variant="default" className="px-6 py-2" onClick={handleNext}>
              Next question
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default StrategyQuestions
