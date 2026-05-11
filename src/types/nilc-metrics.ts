import type { ReadabilityMetrics } from './complexity'

export interface NilcMetrixRawResponse {
  flesch?: number
  words?: number
  sentences?: number
  mean_words_per_sentence?: number
  syllables_per_content_word?: number
  content_density?: number
  ttr?: number
  [key: string]: number | undefined
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
