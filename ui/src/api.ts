import type { SimplifyResponse, QuestionsResponse } from './types'

async function post(path: string, body: FormData): Promise<Response> {
  const res = await fetch(path, { method: 'POST', body })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(err.message ?? `Erro ${res.status}`)
  }
  return res
}

export async function simplifyText(
  input: { text: string } | { file: File },
  patientId: string,
  withGlossary: boolean,
  withImages: boolean,
): Promise<SimplifyResponse> {
  const body = new FormData()
  body.append('patientId', patientId)
  body.append('glossary', String(withGlossary))
  body.append('includeImages', String(withImages))
  if ('file' in input) {
    body.append('file', input.file)
  } else {
    body.append('text', input.text)
  }
  return (await post('/api/simplify', body)).json()
}

export async function generateQuestions(text: string, patientId: string): Promise<QuestionsResponse> {
  const body = new FormData()
  body.append('patientId', patientId)
  body.append('text', text)
  return (await post('/api/simplify/questions', body)).json()
}
