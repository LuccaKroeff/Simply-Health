import type { ComplexityComparison, ReadabilityMetrics } from '@src/types/complexity'

export interface TextComplexityAnalyzer {
  readonly name: string
  analyze(text: string): Promise<ReadabilityMetrics>
  compare(original: string, simplified: string): Promise<ComplexityComparison>
}

export const TEXT_COMPLEXITY_ANALYZER = Symbol('TEXT_COMPLEXITY_ANALYZER')
