import type { Comorbidity, EducationArea } from '../types'

export interface PatientMeta {
  id: string
  name: string
  age: number
  educationLabel: string
  comorbidities?: Comorbidity[]
  comorbiditiesLabels?: string[]
  educationArea?: EducationArea
  educationAreaLabel?: string
  avatar: string
}

const COMORBIDITY_LABELS: Record<Comorbidity, string> = {
  cardiovascular: 'Cardiovascular',
  respiratory: 'Respiratório',
  diabetes: 'Diabetes',
}

const EDUCATION_AREA_LABELS: Record<EducationArea, string> = {
  health: 'Área da Saúde',
  technology: 'Tecnologia',
  humanities: 'Humanas',
  business: 'Negócios',
  education: 'Educação',
  other: 'Outra área',
}

function makePatient(
  p: Omit<PatientMeta, 'comorbiditiesLabels' | 'educationAreaLabel'>,
): PatientMeta {
  return {
    ...p,
    comorbiditiesLabels: p.comorbidities?.map(c => COMORBIDITY_LABELS[c]),
    educationAreaLabel: p.educationArea ? EDUCATION_AREA_LABELS[p.educationArea] : undefined,
  }
}

export const PATIENTS: PatientMeta[] = [
  makePatient({
    id: 'patient-1',
    name: 'Maria Silva',
    age: 68,
    educationLabel: 'Fundamental',
    comorbidities: ['cardiovascular'],
    educationArea: 'other',
    avatar: '/maria-silva.png',
  }),
  makePatient({
    id: 'patient-2',
    name: 'Carlos Oliveira',
    age: 45,
    educationLabel: 'Ensino Médio',
    comorbidities: ['diabetes'],
    educationArea: 'business',
    avatar: '/carlos-oliveira.png',
  }),
  makePatient({
    id: 'patient-3',
    name: 'Ana Souza',
    age: 30,
    educationLabel: 'Ensino Superior',
    educationArea: 'health',
    avatar: '/ana-souza.png',
  }),
]

export const findPatient = (id: string): PatientMeta | undefined =>
  PATIENTS.find(p => p.id === id)
