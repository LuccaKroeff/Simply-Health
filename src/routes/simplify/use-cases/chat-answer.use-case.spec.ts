import { Test, TestingModule } from '@nestjs/testing'
import { LLM_PROVIDER } from '@src/core/constants/llm.constants'
import { ChatOutputGuardrailService } from '@src/core/services/guardrail/chat-output-guardrail.service'
import { InputGuardrailService } from '@src/core/services/guardrail/input-guardrail.service'
import { LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { PatientProfile } from '@src/types/patient'
import { GuardrailResult } from '@src/types/guardrail'
import { InputGuardrailResult } from '@src/types/chat'
import { ChatAnswerUseCase } from './chat-answer.use-case'

const PATIENT: PatientProfile = {
  id: 'p1',
  name: 'Maria',
  age: 50,
  educationLevel: 'medio',
  conditionGroup: 'general',
  educationArea: 'other',
}

const ORIGINAL_TEXT = 'Tome 1 comprimido de metformina 500mg ao dia com refeição. Não interrompa sem orientação médica.'

const ALLOWED_INPUT: InputGuardrailResult = {
  classification: 'allowed',
  confidence: 0.95,
  reason: 'Pergunta sobre o plano.',
  safeResponse: null,
}

const BLOCKED_INPUT: InputGuardrailResult = {
  classification: 'out_of_scope',
  confidence: 0.9,
  reason: 'Fora do escopo.',
  safeResponse: 'Só consigo responder dúvidas relacionadas ao plano de cuidado informado.',
}

const APPROVED_GUARDRAIL: GuardrailResult = {
  verdict: 'approved',
  confidence: 0.95,
  summary: 'Resposta fiel ao original.',
  unsupportedClaims: [],
  alteredCriticalInformation: [],
  omittedCriticalInformation: [],
  suggestedFixes: [],
}

const REJECTED_GUARDRAIL: GuardrailResult = {
  verdict: 'rejected',
  confidence: 0.85,
  summary: 'Resposta contém informação não presente no original.',
  unsupportedClaims: [{ claim: 'Tome em jejum', reason: 'Não consta no original.', severity: 'high' }],
  alteredCriticalInformation: [],
  omittedCriticalInformation: [],
  suggestedFixes: ['Remova a instrução sobre jejum.'],
}

describe('ChatAnswerUseCase', () => {
  let useCase: ChatAnswerUseCase
  let mockLlmProvider: jest.Mocked<LLMProvider>
  let mockInputGuardrail: jest.Mocked<InputGuardrailService>
  let mockOutputGuardrail: jest.Mocked<ChatOutputGuardrailService>

  beforeEach(async () => {
    mockLlmProvider = { name: 'mock', complete: jest.fn() }
    mockInputGuardrail = { classify: jest.fn() } as unknown as jest.Mocked<InputGuardrailService>
    mockOutputGuardrail = { evaluate: jest.fn() } as unknown as jest.Mocked<ChatOutputGuardrailService>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatAnswerUseCase,
        { provide: LLM_PROVIDER, useValue: mockLlmProvider },
        { provide: InputGuardrailService, useValue: mockInputGuardrail },
        { provide: ChatOutputGuardrailService, useValue: mockOutputGuardrail },
      ],
    }).compile()

    useCase = module.get<ChatAnswerUseCase>(ChatAnswerUseCase)
  })

  it('bloqueia pergunta fora do escopo via guardrail de entrada', async () => {
    mockInputGuardrail.classify.mockResolvedValue(BLOCKED_INPUT)

    const result = await useCase.exec({
      question: 'Quem ganhou a Copa?',
      originalText: ORIGINAL_TEXT,
      patient: PATIENT,
      history: [],
    })

    expect(result.blocked).toBe(true)
    expect(result.blockReason).toBe('out_of_scope')
    expect(result.answer).toBe(BLOCKED_INPUT.safeResponse)
    expect(mockLlmProvider.complete).not.toHaveBeenCalled()
  })

  it('retorna resposta aprovada na primeira tentativa', async () => {
    mockInputGuardrail.classify.mockResolvedValue(ALLOWED_INPUT)
    mockLlmProvider.complete.mockResolvedValue('Você deve tomar 1 comprimido ao dia com uma refeição.')
    mockOutputGuardrail.evaluate.mockResolvedValue(APPROVED_GUARDRAIL)

    const result = await useCase.exec({
      question: 'Quando devo tomar?',
      originalText: ORIGINAL_TEXT,
      patient: PATIENT,
      history: [],
    })

    expect(result.blocked).toBe(false)
    expect(result.answer).toBe('Você deve tomar 1 comprimido ao dia com uma refeição.')
    expect(mockLlmProvider.complete).toHaveBeenCalledTimes(1)
    expect(mockOutputGuardrail.evaluate).toHaveBeenCalledTimes(1)
  })

  it('faz retry e aprova na segunda tentativa', async () => {
    mockInputGuardrail.classify.mockResolvedValue(ALLOWED_INPUT)
    mockLlmProvider.complete
      .mockResolvedValueOnce('Resposta incorreta com informação inventada.')
      .mockResolvedValueOnce('Tome 1 comprimido ao dia com a refeição, conforme o material.')
    mockOutputGuardrail.evaluate.mockResolvedValueOnce(REJECTED_GUARDRAIL).mockResolvedValueOnce(APPROVED_GUARDRAIL)

    const result = await useCase.exec({
      question: 'Como devo tomar?',
      originalText: ORIGINAL_TEXT,
      patient: PATIENT,
      history: [],
    })

    expect(result.blocked).toBe(false)
    expect(mockLlmProvider.complete).toHaveBeenCalledTimes(2)
    expect(mockOutputGuardrail.evaluate).toHaveBeenCalledTimes(2)
  })

  it('retorna fallback após 3 tentativas com rejeição persistente', async () => {
    mockInputGuardrail.classify.mockResolvedValue(ALLOWED_INPUT)
    mockLlmProvider.complete.mockResolvedValue('Resposta incorreta.')
    mockOutputGuardrail.evaluate.mockResolvedValue(REJECTED_GUARDRAIL)

    const result = await useCase.exec({
      question: 'Qual a dose?',
      originalText: ORIGINAL_TEXT,
      patient: PATIENT,
      history: [],
    })

    expect(result.blocked).toBe(true)
    expect(result.blockReason).toBe('guardrail_failure')
    expect(mockLlmProvider.complete).toHaveBeenCalledTimes(3)
  })

  it('passa histórico de mensagens na segunda chamada ao LLM', async () => {
    mockInputGuardrail.classify.mockResolvedValue(ALLOWED_INPUT)
    mockLlmProvider.complete.mockResolvedValue('Não deve interromper sem orientação médica.')
    mockOutputGuardrail.evaluate.mockResolvedValue(APPROVED_GUARDRAIL)

    await useCase.exec({
      question: 'Posso parar de tomar?',
      originalText: ORIGINAL_TEXT,
      patient: PATIENT,
      history: [
        { role: 'user', content: 'Quando devo tomar?' },
        { role: 'assistant', content: 'Tome 1 comprimido ao dia com a refeição.' },
      ],
    })

    const calledWith = mockLlmProvider.complete.mock.calls[0][0]
    expect(calledWith.text).toContain('[Paciente]: Quando devo tomar?')
    expect(calledWith.text).toContain('[Assistente]: Tome 1 comprimido ao dia com a refeição.')
  })
})
