export type GuardrailVerdict = 'approved' | 'rejected'
export type ClaimSeverity = 'low' | 'medium' | 'high'
export type CriticalSeverity = 'medium' | 'high'

export interface UnsupportedClaim {
  claim: string
  reason: string
  severity: ClaimSeverity
}

export interface AlteredCriticalInformation {
  original: string
  generated: string
  reason: string
  severity: CriticalSeverity
}

export interface OmittedCriticalInformation {
  missingInformation: string
  reason: string
  severity: CriticalSeverity
}

export interface GuardrailResult {
  verdict: GuardrailVerdict
  confidence: number
  summary: string
  unsupportedClaims: UnsupportedClaim[]
  alteredCriticalInformation: AlteredCriticalInformation[]
  omittedCriticalInformation: OmittedCriticalInformation[]
  suggestedFixes: string[]
}
