import type { Question } from '../types'

interface Props {
  questions: Question[] | null
  onSelect: (question: Question) => void
  disabled: boolean
}

export default function SuggestedQuestions({ questions, onSelect, disabled }: Props) {
  if (questions !== null && questions.length === 0) return null

  return (
    <div>
      <p className="section-label">Perguntas sugeridas</p>
      <div className="suggested-questions">
        {questions === null
          ? [1, 2, 3].map(i => <div key={i} className="question-pill-skeleton" />)
          : questions.map((q, i) => (
              <button key={i} type="button" className="question-pill" onClick={() => onSelect(q)} disabled={disabled}>
                {q.question}
              </button>
            ))}
      </div>
    </div>
  )
}
