import { BadRequestException } from '@nestjs/common'
import { PatientProfile } from '@src/types/patient'
import { ChatMessage } from '@src/types/chat'

export interface ChatRequestDto {
  question: string
  originalText: string
  patientId?: string
  patientProfile?: PatientProfile
  history: ChatMessage[]
}

export function validateChatRequest(body: Record<string, unknown>): ChatRequestDto {
  const { question, originalText, patientId, patientProfile, history } = body

  if (typeof question !== 'string' || question.trim().length === 0) {
    throw new BadRequestException('Campo "question" é obrigatório e deve ser uma string não vazia.')
  }

  if (typeof originalText !== 'string' || originalText.trim().length === 0) {
    throw new BadRequestException('Campo "originalText" é obrigatório e deve ser uma string não vazia.')
  }

  if (!patientId && !patientProfile) {
    throw new BadRequestException('Informe patientId ou patientProfile.')
  }

  const validatedHistory: ChatMessage[] = []
  if (Array.isArray(history)) {
    for (const msg of history) {
      if (
        msg &&
        typeof msg === 'object' &&
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string'
      ) {
        validatedHistory.push({ role: msg.role, content: msg.content })
      }
    }
  }

  return {
    question: question.trim(),
    originalText,
    patientId: typeof patientId === 'string' ? patientId : undefined,
    patientProfile: patientProfile as PatientProfile | undefined,
    history: validatedHistory,
  }
}
