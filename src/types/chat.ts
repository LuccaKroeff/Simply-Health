export type InputGuardrailClassification =
  | 'allowed'
  | 'out_of_scope'
  | 'insufficient_context'
  | 'medical_advice'
  | 'emergency'

export interface InputGuardrailResult {
  classification: InputGuardrailClassification
  confidence: number
  reason: string
  safeResponse: string | null
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  answer: string
  blocked: boolean
  blockReason?: string
  metadata: {
    model: string
    processingTimeMs: number
  }
}
