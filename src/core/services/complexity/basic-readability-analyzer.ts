import { Injectable } from '@nestjs/common'
import type { ComplexityComparison, ReadabilityMetrics } from '@src/types/complexity'
import type { TextComplexityAnalyzer } from './text-complexity-analyzer.interface'

@Injectable()
export class BasicReadabilityAnalyzer implements TextComplexityAnalyzer {
  readonly name = 'basic'

  async analyze(text: string): Promise<ReadabilityMetrics> {
    const sentences = this.splitSentences(text)
    const words = this.splitWords(text)

    const sentenceCount = Math.max(1, sentences.length)
    const wordCount = words.length
    const avgWordsPerSentence = wordCount / sentenceCount

    const totalSyllables = words.reduce((sum, w) => sum + this.countSyllablesPT(w), 0)
    const avgSyllablesPerWord = wordCount > 0 ? totalSyllables / wordCount : 1

    const fleschScore = this.computeFlesch(avgWordsPerSentence, avgSyllablesPerWord)

    return {
      fleschScore: Math.round(fleschScore * 10) / 10,
      fleschLabel: this.fleschLabel(fleschScore),
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      wordCount,
      sentenceCount,
    }
  }

  async compare(original: string, simplified: string): Promise<ComplexityComparison> {
    const [orig, simp] = await Promise.all([this.analyze(original), this.analyze(simplified)])
    return {
      original: orig,
      simplified: simp,
      fleschGain: Math.round((simp.fleschScore - orig.fleschScore) * 10) / 10,
      wordsPerSentenceReduction: Math.round((orig.avgWordsPerSentence - simp.avgWordsPerSentence) * 10) / 10,
      analyzer: this.name,
    }
  }

  private splitSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 2)
  }

  private splitWords(text: string): string[] {
    return text
      .split(/\s+/)
      .map(w => w.replace(/[^a-záàãâéêíóôõúüçñ]/gi, ''))
      .filter(w => w.length > 0)
  }

  private countSyllablesPT(word: string): number {
    const cleaned = word.toLowerCase()
    if (cleaned.length === 0) return 0
    const vowelGroups = cleaned.replace(/[aáàãâeéêiíoóôõuúü]+/g, 'V')
    const count = (vowelGroups.match(/V/g) ?? []).length
    return Math.max(1, count)
  }

  private computeFlesch(asl: number, asw: number): number {
    const raw = 206.835 - 1.015 * asl - 84.6 * asw
    return Math.max(0, Math.min(100, raw))
  }

  private fleschLabel(score: number): string {
    if (score >= 75) return 'Muito fácil'
    if (score >= 50) return 'Fácil'
    if (score >= 25) return 'Pouco difícil'
    return 'Muito difícil'
  }
}
