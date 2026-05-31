import type { ClaimSeverity, CriticalSeverity } from './guardrail'
import type { ComplexityComparison } from './complexity'
import type { PatientProfile } from './patient'

export interface GuardrailRejection {
  attempt: number
  source: 'deterministic' | 'llm'
  summary: string
  unsupportedClaims: Array<{ claim: string; reason: string; severity: ClaimSeverity }>
  alteredCriticalInformation: Array<{ original: string; generated: string; reason: string; severity: CriticalSeverity }>
  omittedCriticalInformation: Array<{ missingInformation: string; reason: string; severity: CriticalSeverity }>
  suggestedFixes: string[]
}

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
    attemptCount?: number
    usedFallback?: boolean
    guardrailRejections?: GuardrailRejection[]
  }
}

export interface GlossaryEntry {
  term: string
  definition: string
}
