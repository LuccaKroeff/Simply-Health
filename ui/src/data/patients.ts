export interface PatientMeta {
  id: string
  name: string
  age: number
  educationLabel: string
  literacyLabel: string
  literacyLevel: 'low' | 'medium' | 'high'
  avatar: string
}

export const PATIENTS: PatientMeta[] = [
  {
    id: 'patient-1',
    name: 'Maria Silva',
    age: 68,
    educationLabel: 'Fundamental',
    literacyLabel: 'Baixa literacia',
    literacyLevel: 'low',
    avatar: '/maria-silva.png',
  },
  {
    id: 'patient-2',
    name: 'Carlos Oliveira',
    age: 45,
    educationLabel: 'Ensino Médio',
    literacyLabel: 'Literacia moderada',
    literacyLevel: 'medium',
    avatar: '/carlos-oliveira.png',
  },
  {
    id: 'patient-3',
    name: 'Ana Souza',
    age: 30,
    educationLabel: 'Ensino Superior',
    literacyLabel: 'Alta literacia',
    literacyLevel: 'high',
    avatar: '/ana-souza.png',
  },
]

export const findPatient = (id: string): PatientMeta | undefined =>
  PATIENTS.find(p => p.id === id)
