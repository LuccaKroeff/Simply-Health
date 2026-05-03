import type { PatientProfile } from './patient'

export interface Question {
  question: string
  answer: string
}

export interface QuestionsResponse {
  questions: Question[]
  metadata: {
    model: string
    processingTimeMs: number
    patientProfile: PatientProfile
  }
}
