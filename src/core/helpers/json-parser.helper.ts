import { GuardrailResult } from '@src/types/guardrail'

export function validateGuardrailResult(parsed: unknown): GuardrailResult {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Guardrail: resposta do avaliador não é um objeto JSON.')
  }

  const obj = parsed as Record<string, unknown>

  if (obj['verdict'] !== 'approved' && obj['verdict'] !== 'rejected') {
    throw new Error(`Guardrail: campo "verdict" inválido ou ausente: ${String(obj['verdict'])}`)
  }

  if (typeof obj['confidence'] !== 'number') {
    throw new Error('Guardrail: campo "confidence" ausente ou não numérico.')
  }

  if (typeof obj['summary'] !== 'string') {
    throw new Error('Guardrail: campo "summary" ausente ou não é string.')
  }

  return {
    verdict: obj['verdict'] as GuardrailResult['verdict'],
    confidence: obj['confidence'] as number,
    summary: obj['summary'] as string,
    unsupportedClaims: Array.isArray(obj['unsupportedClaims'])
      ? (obj['unsupportedClaims'] as GuardrailResult['unsupportedClaims'])
      : [],
    alteredCriticalInformation: Array.isArray(obj['alteredCriticalInformation'])
      ? (obj['alteredCriticalInformation'] as GuardrailResult['alteredCriticalInformation'])
      : [],
    omittedCriticalInformation: Array.isArray(obj['omittedCriticalInformation'])
      ? (obj['omittedCriticalInformation'] as GuardrailResult['omittedCriticalInformation'])
      : [],
    suggestedFixes: Array.isArray(obj['suggestedFixes']) ? (obj['suggestedFixes'] as string[]) : [],
  }
}

export function parseJsonFromLLMResponse<T>(raw: string, validate: (parsed: unknown) => T): T {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  const match = stripped.match(/\{[\s\S]*\}/)
  if (!match) {
    throw new Error(`Resposta do LLM não contém JSON válido. Raw: ${raw.slice(0, 200)}`)
  }

  const parsed: unknown = JSON.parse(match[0])
  return validate(parsed)
}

export function validateStringField(obj: Record<string, unknown>, field: string): string {
  if (typeof obj[field] !== 'string') {
    throw new Error(`Campo "${field}" ausente ou não é string.`)
  }
  return obj[field] as string
}

export function validateNumberField(obj: Record<string, unknown>, field: string): number {
  if (typeof obj[field] !== 'number') {
    throw new Error(`Campo "${field}" ausente ou não numérico.`)
  }
  return obj[field] as number
}

export function validateArrayField<T>(obj: Record<string, unknown>, field: string): T[] {
  return Array.isArray(obj[field]) ? (obj[field] as T[]) : []
}
