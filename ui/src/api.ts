import type { SimplifyResponse, QuestionsResponse, ChatMessage, ChatResponse } from './types'

async function postForm(path: string, body: FormData): Promise<Response> {
  const res = await fetch(path, { method: 'POST', body })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(err.message ?? `Erro ${res.status}`)
  }
  return res
}

async function postJson(path: string, body: unknown): Promise<Response> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
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
  return (await postForm('/api/simplify', body)).json()
}

export async function generateQuestions(originalText: string, patientId: string): Promise<QuestionsResponse> {
  const body = new FormData()
  body.append('patientId', patientId)
  body.append('text', originalText)
  return (await postForm('/api/simplify/questions', body)).json()
}

export async function chatQuestion(
  question: string,
  originalText: string,
  patientId: string,
  history: ChatMessage[],
): Promise<ChatResponse> {
  return (await postJson('/api/simplify/chat', { question, originalText, patientId, history })).json()
}

export async function synthesizeSpeech(text: string): Promise<string> {
  const data = (await postJson('/api/simplify/tts', { text })).json() as Promise<{ audio: string }>
  return (await data).audio
}
