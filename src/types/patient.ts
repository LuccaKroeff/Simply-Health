export interface PatientProfile {
  id: string
  name: string
  age: number
  educationLevel: EducationLevel
  healthLiteracyLevel: HealthLiteracyLevel
}

export type EducationLevel = 'fundamental' | 'medio' | 'superior'

export type HealthLiteracyLevel = 'low' | 'medium' | 'high'
