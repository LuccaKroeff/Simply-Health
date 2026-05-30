export type PatientResultStatus = 'processing' | 'approved' | 'error'

export interface PatientResult {
  status: PatientResultStatus
  simplifyResult: SimplifyResponse | null
  questions: Question[] | null
  questionsError: boolean
  error: string | null
}

export type EducationLevel = 'fundamental' | 'medio' | 'superior'
export type DetailLevel = 'short' | 'medium' | 'detailed'
export type Comorbidity = 'cardiovascular' | 'respiratory' | 'diabetes'
export type EducationArea = 'health' | 'technology' | 'humanities' | 'business' | 'education' | 'other'

export interface Patient {
  id: string
  name: string
  age: number
  educationLevel: EducationLevel
  comorbidities?: Comorbidity[]
  educationArea?: EducationArea
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

export interface ReadabilityMetrics {
  fleschScore: number
  fleschLabel: string
  avgWordsPerSentence: number
  wordCount: number
  sentenceCount: number
  syllablesPerContentWord?: number
  contentDensity?: number
  lexicalDiversity?: number
}

export interface SimplificationMetrics extends ReadabilityMetrics {
  syllablesPerContentWord: number
  contentDensity: number
  lexicalDiversity: number
}

export interface MetricsDelta {
  fleschScore: number
  avgWordsPerSentence: number
  wordCount: number
  sentenceCount: number
  syllablesPerContentWord: number
  contentDensity: number
  lexicalDiversity: number
}

export interface MetricsComparison {
  original: SimplificationMetrics
  simplified: SimplificationMetrics
  delta: MetricsDelta
  fleschGain: number
  wordsPerSentenceReduction: number
  analyzer: string
  shortText: boolean
}

export interface ComplexityComparison {
  original: ReadabilityMetrics
  simplified: ReadabilityMetrics
  fleschGain: number
  wordsPerSentenceReduction: number
  analyzer: string
  delta?: MetricsDelta
  shortText?: boolean
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
    patientProfile: Patient
    imagesFound: number
    attemptCount?: number
    usedFallback?: boolean
  }
}

export interface QuestionsResponse {
  questions: Question[]
  metadata: {
    model: string
    processingTimeMs: number
    patientProfile: Patient
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  answer: string
  blocked: boolean
  blockReason?: string
  metadata: {
    model: string
    processingTimeMs: number
  }
}
