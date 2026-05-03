import { Question } from '@src/types/questions'

export function parseQuestions(raw: string): Question[] {
  const jsonMatch = raw.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('Resposta do LLM não contém JSON válido.')
  }

  const parsed: unknown = JSON.parse(jsonMatch[0])

  if (!Array.isArray(parsed)) {
    throw new Error('Resposta do LLM não é um array.')
  }

  return parsed.map((item: Record<string, unknown>, i: number) => {
    if (typeof item.question !== 'string' || typeof item.answer !== 'string') {
      throw new Error(`Pergunta ${i + 1} não tem os campos "question" e "answer".`)
    }
    return { question: item.question, answer: item.answer }
  })
}
