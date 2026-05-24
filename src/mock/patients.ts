import type { PatientProfile } from '@src/types/patient'

export const mockPatients: readonly PatientProfile[] = [
  {
    id: 'patient-1',
    name: 'Maria Silva',
    age: 68,
    educationLevel: 'fundamental',
    comorbidities: ['cardiovascular'],
    educationArea: 'other',
  },
  {
    id: 'patient-2',
    name: 'Carlos Oliveira',
    age: 45,
    educationLevel: 'medio',
    comorbidities: ['diabetes'],
    educationArea: 'business',
  },
  {
    id: 'patient-3',
    name: 'Ana Souza',
    age: 30,
    educationLevel: 'superior',
    educationArea: 'health',
  },
]

export const findPatientById = (id: string): PatientProfile | undefined => mockPatients.find(p => p.id === id)
