import { BadRequestException } from '@nestjs/common'
import { PatientProfile } from '@src/types/patient'

export interface SimplifyRequestDto {
  text?: string
  patientId?: string
  patientProfile?: PatientProfile
  glossary: boolean
  includeImages: boolean
}

const VALID_EDUCATION_LEVELS = ['fundamental', 'medio', 'superior']
const VALID_LITERACY_LEVELS = ['low', 'medium', 'high']

function validatePatientProfile(profile: unknown): asserts profile is PatientProfile {
  if (typeof profile !== 'object' || profile === null) {
    throw new BadRequestException('patientProfile deve ser um objeto.')
  }

  const p = profile as Record<string, unknown>

  if (typeof p.id !== 'string' || !p.id) {
    throw new BadRequestException('patientProfile.id é obrigatório.')
  }
  if (typeof p.name !== 'string' || !p.name) {
    throw new BadRequestException('patientProfile.name é obrigatório.')
  }
  if (typeof p.age !== 'number' || !Number.isInteger(p.age) || p.age < 1) {
    throw new BadRequestException('patientProfile.age deve ser um inteiro positivo.')
  }
  if (!VALID_EDUCATION_LEVELS.includes(p.educationLevel as string)) {
    throw new BadRequestException('patientProfile.educationLevel deve ser: fundamental, medio ou superior.')
  }
  if (!VALID_LITERACY_LEVELS.includes(p.healthLiteracyLevel as string)) {
    throw new BadRequestException('patientProfile.healthLiteracyLevel deve ser: low, medium ou high.')
  }
}

export function validateSimplifyRequest(body: Record<string, unknown>): SimplifyRequestDto {
  const { text, patientId, patientProfile, glossary, includeImages } = body

  if (text !== undefined && (typeof text !== 'string' || text.length === 0)) {
    throw new BadRequestException('Campo "text" deve ser uma string não vazia.')
  }

  if (patientId !== undefined && typeof patientId !== 'string') {
    throw new BadRequestException('Campo "patientId" deve ser uma string.')
  }

  if (patientProfile !== undefined) {
    validatePatientProfile(patientProfile)
  }

  if (!patientId && !patientProfile) {
    throw new BadRequestException('Informe patientId ou patientProfile.')
  }

  return {
    text: text as string | undefined,
    patientId: patientId as string | undefined,
    patientProfile: patientProfile as PatientProfile | undefined,
    glossary: glossary === true || glossary === 'true',
    includeImages: includeImages === true || includeImages === 'true',
  }
}
