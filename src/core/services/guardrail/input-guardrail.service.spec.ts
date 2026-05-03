import { Test, TestingModule } from '@nestjs/testing'
import { LLM_GUARDRAIL_PROVIDER } from '@src/core/constants/llm.constants'
import { LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { InputGuardrailResult } from '@src/types/chat'
import { InputGuardrailService } from './input-guardrail.service'

const ORIGINAL_TEXT = 'Tome 2 comprimidos de amoxicilina 500mg a cada 8 horas por 7 dias. Não interrompa o tratamento.'

function mockResult(partial: Partial<InputGuardrailResult>): InputGuardrailResult {
  return {
    classification: 'allowed',
    confidence: 0.95,
    reason: 'Mock.',
    safeResponse: null,
    ...partial,
  }
}

describe('InputGuardrailService', () => {
  let service: InputGuardrailService
  let mockLlmProvider: jest.Mocked<LLMProvider>

  beforeEach(async () => {
    mockLlmProvider = { name: 'mock', complete: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [InputGuardrailService, { provide: LLM_GUARDRAIL_PROVIDER, useValue: mockLlmProvider }],
    }).compile()

    service = module.get<InputGuardrailService>(InputGuardrailService)
  })

  it('classifica pergunta sobre o plano de cuidado como allowed', async () => {
    mockLlmProvider.complete.mockResolvedValue(JSON.stringify(mockResult({ classification: 'allowed' })))

    const result = await service.classify('Quantos comprimidos devo tomar por dia?', ORIGINAL_TEXT)

    expect(result.classification).toBe('allowed')
    expect(result.safeResponse).toBeNull()
  })

  it('classifica pergunta fora do escopo como out_of_scope', async () => {
    mockLlmProvider.complete.mockResolvedValue(
      JSON.stringify(
        mockResult({
          classification: 'out_of_scope',
          reason: 'Pergunta sobre futebol, não relacionada ao plano.',
          safeResponse: 'Só consigo responder dúvidas relacionadas ao plano de cuidado informado.',
        }),
      ),
    )

    const result = await service.classify('Qual time ganhou o campeonato?', ORIGINAL_TEXT)

    expect(result.classification).toBe('out_of_scope')
    expect(result.safeResponse).toBeTruthy()
  })

  it('classifica pedido de diagnóstico como medical_advice', async () => {
    mockLlmProvider.complete.mockResolvedValue(
      JSON.stringify(
        mockResult({
          classification: 'medical_advice',
          reason: 'Pergunta pede diagnóstico.',
          safeResponse:
            'Essa pergunta exige orientação de um profissional de saúde. Não posso recomendar mudanças de tratamento, doses ou condutas médicas.',
        }),
      ),
    )

    const result = await service.classify('Acho que estou com infecção, o que devo fazer?', ORIGINAL_TEXT)

    expect(result.classification).toBe('medical_advice')
    expect(result.safeResponse).toContain('profissional de saúde')
  })

  it('classifica pedido de alteração de dose como medical_advice', async () => {
    mockLlmProvider.complete.mockResolvedValue(
      JSON.stringify(
        mockResult({
          classification: 'medical_advice',
          reason: 'Pergunta solicita mudança de dose.',
          safeResponse:
            'Essa pergunta exige orientação de um profissional de saúde. Não posso recomendar mudanças de tratamento, doses ou condutas médicas.',
        }),
      ),
    )

    const result = await service.classify('Posso tomar 1000mg em vez de 500mg?', ORIGINAL_TEXT)

    expect(result.classification).toBe('medical_advice')
  })

  it('classifica pergunta sobre assunto não coberto como insufficient_context', async () => {
    mockLlmProvider.complete.mockResolvedValue(
      JSON.stringify(
        mockResult({
          classification: 'insufficient_context',
          reason: 'A informação não consta no material.',
          safeResponse:
            'O material fornecido não traz essa informação. Para evitar uma orientação incorreta, confirme essa dúvida com um profissional de saúde.',
        }),
      ),
    )

    const result = await service.classify('Posso tomar esse remédio em jejum?', ORIGINAL_TEXT)

    expect(result.classification).toBe('insufficient_context')
    expect(result.safeResponse).toContain('não traz essa informação')
  })

  it('classifica situação de urgência como emergency', async () => {
    mockLlmProvider.complete.mockResolvedValue(
      JSON.stringify(
        mockResult({
          classification: 'emergency',
          reason: 'Paciente relata sintomas graves.',
          safeResponse:
            'Essa situação pode exigir atendimento imediato. Procure um serviço de emergência ou entre em contato com um profissional de saúde.',
        }),
      ),
    )

    const result = await service.classify('Estou com dificuldade para respirar e tontura forte', ORIGINAL_TEXT)

    expect(result.classification).toBe('emergency')
    expect(result.safeResponse).toContain('emergência')
  })

  it('chama o LLM com temperatura 0.1', async () => {
    mockLlmProvider.complete.mockResolvedValue(JSON.stringify(mockResult({})))

    await service.classify('Quantos comprimidos?', ORIGINAL_TEXT)

    expect(mockLlmProvider.complete).toHaveBeenCalledWith(
      expect.objectContaining({ text: expect.any(String) }),
      expect.any(String),
      0.1,
    )
  })
})
