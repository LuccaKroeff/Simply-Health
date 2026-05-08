export interface ReadabilityMetrics {
  fleschScore: number
  fleschLabel: string
  avgWordsPerSentence: number
  wordCount: number
  sentenceCount: number
}

export interface ComplexityComparison {
  original: ReadabilityMetrics
  simplified: ReadabilityMetrics
  fleschGain: number
  wordsPerSentenceReduction: number
  analyzer: string
}
