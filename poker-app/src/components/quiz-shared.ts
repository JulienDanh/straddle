// Shared helpers for StrategyQuiz and StrategyQuestions

export function revealOptionClass(isCorrect: boolean, isPicked: boolean): string {
  if (isCorrect) return 'border-good bg-[rgba(95,208,168,0.15)] text-good'
  if (isPicked && !isCorrect) return 'border-bad bg-[rgba(239,111,111,0.15)] text-bad'
  return 'opacity-50'
}

export function feedbackBoxClass(isCorrect: boolean): string {
  return isCorrect
    ? 'border-good bg-[rgba(95,208,168,0.08)]'
    : 'border-bad bg-[rgba(239,111,111,0.08)]'
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
