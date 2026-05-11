import type { NilcMetrixRawResponse, SimplificationMetrics, MetricsDelta, MetricsComparison } from '@src/types/nilc-metrics'

const SHORT_TEXT_WORD_THRESHOLD = 30
const SHORT_TEXT_SENTENCE_THRESHOLD = 3

export function mapNilcMetrixResponse(raw: NilcMetrixRawResponse): SimplificationMetrics {
  const words = raw.words ?? 0
  const sentences = Math.max(1, raw.sentences ?? 1)
  const fleschScore = clamp(raw.flesch ?? 0, 0, 100)

  return {
    fleschScore: round(fleschScore),
    fleschLabel: fleschLabel(fleschScore),
    avgWordsPerSentence: round(raw.mean_words_per_sentence ?? words / sentences),
    wordCount: words,
    sentenceCount: raw.sentences ?? 1,
    syllablesPerContentWord: round(raw.syllables_per_content_word ?? 0),
    contentDensity: round(raw.content_density ?? 0),
    lexicalDiversity: round(raw.ttr ?? 0, 3),
  }
}

export function computeMetricsComparison(
  original: SimplificationMetrics,
  simplified: SimplificationMetrics,
  analyzer: string,
): MetricsComparison {
  const delta: MetricsDelta = {
    fleschScore: round(simplified.fleschScore - original.fleschScore),
    avgWordsPerSentence: round(simplified.avgWordsPerSentence - original.avgWordsPerSentence),
    wordCount: simplified.wordCount - original.wordCount,
    sentenceCount: simplified.sentenceCount - original.sentenceCount,
    syllablesPerContentWord: round(simplified.syllablesPerContentWord - original.syllablesPerContentWord),
    contentDensity: round(simplified.contentDensity - original.contentDensity),
    lexicalDiversity: round(simplified.lexicalDiversity - original.lexicalDiversity, 3),
  }

  const shortText =
    original.wordCount < SHORT_TEXT_WORD_THRESHOLD ||
    original.sentenceCount < SHORT_TEXT_SENTENCE_THRESHOLD

  return {
    original,
    simplified,
    delta,
    fleschGain: delta.fleschScore,
    wordsPerSentenceReduction: round(original.avgWordsPerSentence - simplified.avgWordsPerSentence),
    analyzer,
    shortText,
  }
}

function fleschLabel(score: number): string {
  if (score >= 75) return 'Muito fácil'
  if (score >= 50) return 'Fácil'
  if (score >= 25) return 'Difícil'
  return 'Muito difícil'
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

function round(v: number, decimals = 1): number {
  const factor = 10 ** decimals
  return Math.round(v * factor) / factor
}
