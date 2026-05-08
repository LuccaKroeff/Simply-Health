import type { ComplexityComparison } from './complexity'
import type { PatientProfile } from './patient'

export interface SimplifyRequest {
  text: string
  patientId?: string
  patientProfile?: PatientProfile
  glossary?: boolean
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
  complexity?: ComplexityComparison
  metadata: {
    model: string
    processingTimeMs: number
    patientProfile: PatientProfile
    imagesFound: number
  }
}

export interface GlossaryEntry {
  term: string
  definition: string
}
