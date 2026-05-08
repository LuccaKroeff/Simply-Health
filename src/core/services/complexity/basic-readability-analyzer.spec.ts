import { BasicReadabilityAnalyzer } from './basic-readability-analyzer'

describe('BasicReadabilityAnalyzer', () => {
  let analyzer: BasicReadabilityAnalyzer

  beforeEach(() => {
    analyzer = new BasicReadabilityAnalyzer()
  })

  describe('analyze', () => {
    it('retorna métricas para texto simples', async () => {
      const text = 'O médico receitou um remédio. Tome uma vez ao dia.'
      const result = await analyzer.analyze(text)

      expect(result.sentenceCount).toBe(2)
      expect(result.wordCount).toBeGreaterThan(0)
      expect(result.avgWordsPerSentence).toBeGreaterThan(0)
      expect(result.fleschScore).toBeGreaterThanOrEqual(0)
      expect(result.fleschScore).toBeLessThanOrEqual(100)
      expect(result.fleschLabel).toBeTruthy()
    })

    it('texto simples tem Flesch maior que texto complexo', async () => {
      const simples = 'Tome um comprimido por dia. Beba água.'
      const complexo =
        'A administração do fármaco prescrito deve ser realizada mediante ingestão oral de comprimido revestido de liberação prolongada com intervalo posológico de vinte e quatro horas.'

      const [r1, r2] = await Promise.all([analyzer.analyze(simples), analyzer.analyze(complexo)])
      expect(r1.fleschScore).toBeGreaterThan(r2.fleschScore)
    })

    it('retorna mínimo 1 sentença para texto sem pontuação', async () => {
      const result = await analyzer.analyze('texto sem pontuação final')
      expect(result.sentenceCount).toBe(1)
    })
  })

  describe('compare', () => {
    it('fleschGain positivo quando simplificado é mais fácil', async () => {
      const original =
        'A hipertensão arterial sistêmica é uma condição crônica multifatorial que requer monitoramento contínuo da pressão arterial e adesão rigorosa ao tratamento farmacológico prescrito.'
      const simplified = 'Pressão alta precisa de acompanhamento médico. Tome os remédios como indicado.'

      const result = await analyzer.compare(original, simplified)
      expect(result.fleschGain).toBeGreaterThan(0)
      expect(result.wordsPerSentenceReduction).toBeGreaterThan(0)
      expect(result.analyzer).toBe('basic')
    })
  })
})
