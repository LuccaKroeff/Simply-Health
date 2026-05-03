import { Test, TestingModule } from '@nestjs/testing'
import { LLM_GUARDRAIL_PROVIDER } from '@src/core/constants/llm.constants'
import { LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { GuardrailResult } from '@src/types/guardrail'
import { FidelityGuardrailService, GuardrailInput } from './fidelity-guardrail.service'

const APPROVED_RESULT: GuardrailResult = {
  verdict: 'approved',
  confidence: 0.97,
  summary: 'O texto simplificado preserva fielmente o significado do original.',
  unsupportedClaims: [],
  alteredCriticalInformation: [],
  omittedCriticalInformation: [],
  suggestedFixes: [],
}

const REJECTED_UNSUPPORTED: GuardrailResult = {
  verdict: 'rejected',
  confidence: 0.91,
  summary: 'O texto simplificado contém informação clínica não presente no original.',
  unsupportedClaims: [
    { claim: 'Tome o medicamento com leite', reason: 'Não há menção a isso no original.', severity: 'high' },
  ],
  alteredCriticalInformation: [],
  omittedCriticalInformation: [],
  suggestedFixes: ['Remova a instrução sobre tomar com leite, pois não consta no texto original.'],
}

const REJECTED_ALTERED_DOSE: GuardrailResult = {
  verdict: 'rejected',
  confidence: 0.95,
  summary: 'A dosagem foi alterada entre o original e o simplificado.',
  unsupportedClaims: [],
  alteredCriticalInformation: [
    {
      original: '2 comprimidos a cada 8 horas',
      generated: '2 comprimidos por dia',
      reason: 'A frequência foi reduzida de 3x ao dia para 1x ao dia.',
      severity: 'high',
    },
  ],
  omittedCriticalInformation: [],
  suggestedFixes: ['Corrigir para "2 comprimidos a cada 8 horas".'],
}

const REJECTED_OMISSION: GuardrailResult = {
  verdict: 'rejected',
  confidence: 0.88,
  summary: 'Alerta de segurança importante foi omitido.',
  unsupportedClaims: [],
  alteredCriticalInformation: [],
  omittedCriticalInformation: [
    {
      missingInformation: 'Não use em caso de alergia à penicilina.',
      reason: 'Contraindicação presente no original foi removida.',
      severity: 'high',
    },
  ],
  suggestedFixes: ['Incluir a contraindicação para alergia à penicilina.'],
}

const SAMPLE_INPUT: GuardrailInput = {
  originalText: 'Tome 2 comprimidos a cada 8 horas por 7 dias.',
  generatedText: 'Tome 2 comprimidos 3 vezes ao dia durante uma semana.',
  attemptNumber: 1,
}

describe('FidelityGuardrailService', () => {
  let service: FidelityGuardrailService
  let mockLlmProvider: jest.Mocked<LLMProvider>

  beforeEach(async () => {
    mockLlmProvider = { name: 'mock', complete: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [FidelityGuardrailService, { provide: LLM_GUARDRAIL_PROVIDER, useValue: mockLlmProvider }],
    }).compile()

    service = module.get<FidelityGuardrailService>(FidelityGuardrailService)
  })

  it('aprova simplificação fiel', async () => {
    mockLlmProvider.complete.mockResolvedValue(JSON.stringify(APPROVED_RESULT))

    const result = await service.evaluate(SAMPLE_INPUT)

    expect(result.verdict).toBe('approved')
    expect(result.confidence).toBe(0.97)
    expect(result.unsupportedClaims).toHaveLength(0)
  })

  it('rejeita por informação inventada', async () => {
    mockLlmProvider.complete.mockResolvedValue(JSON.stringify(REJECTED_UNSUPPORTED))

    const result = await service.evaluate(SAMPLE_INPUT)

    expect(result.verdict).toBe('rejected')
    expect(result.unsupportedClaims).toHaveLength(1)
    expect(result.unsupportedClaims[0].severity).toBe('high')
    expect(result.suggestedFixes).toHaveLength(1)
  })

  it('rejeita por alteração de dose', async () => {
    mockLlmProvider.complete.mockResolvedValue(JSON.stringify(REJECTED_ALTERED_DOSE))

    const result = await service.evaluate(SAMPLE_INPUT)

    expect(result.verdict).toBe('rejected')
    expect(result.alteredCriticalInformation).toHaveLength(1)
    expect(result.alteredCriticalInformation[0].severity).toBe('high')
  })

  it('rejeita por omissão de alerta importante', async () => {
    mockLlmProvider.complete.mockResolvedValue(JSON.stringify(REJECTED_OMISSION))

    const result = await service.evaluate(SAMPLE_INPUT)

    expect(result.verdict).toBe('rejected')
    expect(result.omittedCriticalInformation).toHaveLength(1)
    expect(result.omittedCriticalInformation[0].severity).toBe('high')
  })

  it('faz strip de markdown fences antes de parsear', async () => {
    mockLlmProvider.complete.mockResolvedValue(`\`\`\`json\n${JSON.stringify(APPROVED_RESULT)}\n\`\`\``)

    const result = await service.evaluate(SAMPLE_INPUT)

    expect(result.verdict).toBe('approved')
  })

  it('lança erro quando a resposta não contém JSON válido', async () => {
    mockLlmProvider.complete.mockResolvedValue('Não consegui avaliar o texto.')

    await expect(service.evaluate(SAMPLE_INPUT)).rejects.toThrow('não contém JSON válido')
  })

  it('chama o LLM com temperatura 0.1', async () => {
    mockLlmProvider.complete.mockResolvedValue(JSON.stringify(APPROVED_RESULT))

    await service.evaluate(SAMPLE_INPUT)

    expect(mockLlmProvider.complete).toHaveBeenCalledWith(
      expect.objectContaining({ text: expect.any(String) }),
      expect.any(String),
      0.1,
    )
  })
})
