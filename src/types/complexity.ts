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

export interface ComplexityComparison {
  original: ReadabilityMetrics
  simplified: ReadabilityMetrics
  fleschGain: number
  wordsPerSentenceReduction: number
  analyzer: string
  delta?: import('./nilc-metrics').MetricsDelta
  shortText?: boolean
}
