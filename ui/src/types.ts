export type EducationLevel = 'fundamental' | 'medio' | 'superior'
export type LiteracyLevel = 'low' | 'medium' | 'high'

export interface Patient {
  id: string
  name: string
  age: number
  educationLevel: EducationLevel
  healthLiteracyLevel: LiteracyLevel
  medicalCondition?: string
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
  glossary?: GlossaryEntry[]
  images?: ExtractedImage[]
  metadata: {
    model: string
    processingTimeMs: number
    patientProfile: Patient
    imagesFound: number
  }
  questions: Question[]
  metadata: {
    model: string
    processingTimeMs: number
    patientProfile: Patient
  }
}
