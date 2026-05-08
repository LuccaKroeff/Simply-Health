export type EducationLevel = 'fundamental' | 'medio' | 'superior'
export type LiteracyLevel = 'low' | 'medium' | 'high'

export interface Patient {
  id: string
  name: string
  age: number
  educationLevel: EducationLevel
  healthLiteracyLevel: LiteracyLevel
}

export interface GlossaryEntry {
  term: string
  definition: string
}

export interface Question {
  question: string
  answer: string
}

export interface ExtractedImage {
  id: string
  data: string
  mimeType: 'image/png'
}

export interface SimplifyResponse {
  simplifiedText: string
  originalText: string
  glossary?: GlossaryEntry[]
  images?: ExtractedImage[]
  metadata: {
    model: string
    processingTimeMs: number
    patientProfile: Patient
    imagesFound: number
  }
}

export interface QuestionsResponse {
  questions: Question[]
  metadata: {
    model: string
    processingTimeMs: number
    patientProfile: Patient
  }
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
