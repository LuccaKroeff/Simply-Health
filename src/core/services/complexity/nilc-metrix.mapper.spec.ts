import { mapNilcMetrixResponse, computeMetricsComparison } from './nilc-metrix.mapper'
import type { NilcMetrixRawResponse } from '@src/types/nilc-metrics'

const rawOriginal: NilcMetrixRawResponse = {
  flesch: 30.0,
  words: 180,
  sentences: 8,
  mean_words_per_sentence: 22.5,
  syllables_per_content_word: 2.4,
  content_density: 4.2,
  ttr: 0.71,
}

const rawSimplified: NilcMetrixRawResponse = {
  flesch: 62.0,
  words: 140,
  sentences: 14,
  mean_words_per_sentence: 10.0,
  syllables_per_content_word: 1.9,
  content_density: 3.1,
  ttr: 0.55,
}

describe('mapNilcMetrixResponse', () => {
  it('maps all fields from raw response', () => {
    const metrics = mapNilcMetrixResponse(rawOriginal)
    expect(metrics.fleschScore).toBe(30.0)
    expect(metrics.avgWordsPerSentence).toBe(22.5)
    expect(metrics.wordCount).toBe(180)
    expect(metrics.sentenceCount).toBe(8)
    expect(metrics.syllablesPerContentWord).toBe(2.4)
    expect(metrics.contentDensity).toBe(4.2)
    expect(metrics.lexicalDiversity).toBe(0.71)
  })

  it('assigns correct flesch label', () => {
    expect(mapNilcMetrixResponse({ flesch: 80 }).fleschLabel).toBe('Muito fácil')
    expect(mapNilcMetrixResponse({ flesch: 60 }).fleschLabel).toBe('Fácil')
    expect(mapNilcMetrixResponse({ flesch: 30 }).fleschLabel).toBe('Difícil')
    expect(mapNilcMetrixResponse({ flesch: 10 }).fleschLabel).toBe('Muito difícil')
  })

  it('clamps flesch score to 0–100', () => {
    expect(mapNilcMetrixResponse({ flesch: 120 }).fleschScore).toBe(100)
    expect(mapNilcMetrixResponse({ flesch: -5 }).fleschScore).toBe(0)
  })

  it('handles missing fields with fallback values', () => {
    const metrics = mapNilcMetrixResponse({})
    expect(metrics.fleschScore).toBe(0)
    expect(metrics.wordCount).toBe(0)
    expect(metrics.sentenceCount).toBe(1)
    expect(metrics.syllablesPerContentWord).toBe(0)
  })
})

describe('computeMetricsComparison', () => {
  const original = mapNilcMetrixResponse(rawOriginal)
  const simplified = mapNilcMetrixResponse(rawSimplified)

  it('computes correct deltas', () => {
    const result = computeMetricsComparison(original, simplified, 'nilc-metrix')
    expect(result.delta.fleschScore).toBe(32.0)
    expect(result.delta.avgWordsPerSentence).toBe(-12.5)
    expect(result.delta.wordCount).toBe(-40)
    expect(result.delta.sentenceCount).toBe(6)
    expect(result.delta.syllablesPerContentWord).toBe(-0.5)
  })

  it('sets fleschGain and wordsPerSentenceReduction as convenience aliases', () => {
    const result = computeMetricsComparison(original, simplified, 'nilc-metrix')
    expect(result.fleschGain).toBe(result.delta.fleschScore)
    expect(result.wordsPerSentenceReduction).toBe(-result.delta.avgWordsPerSentence)
  })

  it('marks shortText = false for long enough original', () => {
    const result = computeMetricsComparison(original, simplified, 'nilc-metrix')
    expect(result.shortText).toBe(false)
  })

  it('marks shortText = true when original has few words', () => {
    const shortOrig = mapNilcMetrixResponse({ ...rawOriginal, words: 15, sentences: 2 })
    const result = computeMetricsComparison(shortOrig, simplified, 'nilc-metrix')
    expect(result.shortText).toBe(true)
  })

  it('stores analyzer name', () => {
    const result = computeMetricsComparison(original, simplified, 'nilc-metrix')
    expect(result.analyzer).toBe('nilc-metrix')
  })
})
