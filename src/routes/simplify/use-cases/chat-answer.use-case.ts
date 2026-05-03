import { Inject, Injectable, Logger } from '@nestjs/common'
import { LLM_PROVIDER } from '@src/core/constants/llm.constants'
import { detectCriticalAlterations } from '@src/core/helpers/deterministic-checker.helper'
import { InputGuardrailService } from '@src/core/services/guardrail/input-guardrail.service'
import { ChatOutputGuardrailService } from '@src/core/services/guardrail/chat-output-guardrail.service'
import { LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { buildChatSystemPrompt, buildChatUserMessage } from '@src/prompts/chat-prompt'
import { PatientProfile } from '@src/types/patient'
import { ChatMessage, ChatResponse } from '@src/types/chat'
import { GuardrailResult } from '@src/types/guardrail'

const MAX_ATTEMPTS = 3
const SAFE_FALLBACK =
  'Não foi possível gerar uma resposta segura com base no material informado. Por favor, consulte um profissional de saúde.'

interface ChatAnswerParams {
  question: string
  originalText: string
  patient: PatientProfile
  history: ChatMessage[]
}

@Injectable()
export class ChatAnswerUseCase {
  private readonly logger = new Logger(ChatAnswerUseCase.name)

  constructor(
    @Inject(LLM_PROVIDER) private readonly llmProvider: LLMProvider,
    private readonly inputGuardrail: InputGuardrailService,
    private readonly outputGuardrail: ChatOutputGuardrailService,
  ) {}

  async exec({ question, originalText, patient, history }: ChatAnswerParams): Promise<ChatResponse> {
    const startTime = Date.now()

    const inputResult = await this.inputGuardrail.classify(question, originalText)

    if (inputResult.classification !== 'allowed') {
      this.logger.log(`Pergunta bloqueada pelo guardrail de entrada: ${inputResult.classification}`)
      return {
        answer: inputResult.safeResponse ?? SAFE_FALLBACK,
        blocked: true,
        blockReason: inputResult.classification,
        metadata: { model: this.llmProvider.name, processingTimeMs: Date.now() - startTime },
      }
    }

    const systemPrompt = buildChatSystemPrompt(patient, originalText)
    let lastRejection: GuardrailResult | null = null

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const retryFeedback = lastRejection ? buildRetryFeedback(lastRejection) : undefined
      const userMessage = buildChatUserMessage(history, question, retryFeedback)

      this.logger.log(`Chat tentativa ${attempt}/${MAX_ATTEMPTS}`)
      const answer = await this.llmProvider.complete({ text: userMessage }, systemPrompt)

      const deterministicIssues = detectCriticalAlterations(originalText, answer)
      const guardrailResult = await this.outputGuardrail.evaluate(originalText, question, answer, attempt)

      if (guardrailResult.verdict === 'approved' && deterministicIssues.length === 0) {
        return {
          answer,
          blocked: false,
          metadata: { model: this.llmProvider.name, processingTimeMs: Date.now() - startTime },
        }
      }

      if (deterministicIssues.length > 0) {
        this.logger.warn(`Problemas determinísticos detectados: ${deterministicIssues.join('; ')}`)
      }

      lastRejection = guardrailResult
      this.logger.warn(`Tentativa ${attempt} rejeitada: ${guardrailResult.summary}`)
    }

    this.logger.error(`Chat: todas as ${MAX_ATTEMPTS} tentativas falharam. Retornando fallback.`)

    return {
      answer: SAFE_FALLBACK,
      blocked: true,
      blockReason: 'guardrail_failure',
      metadata: { model: this.llmProvider.name, processingTimeMs: Date.now() - startTime },
    }
  }
}

function buildRetryFeedback(rejection: GuardrailResult): string {
  const lines = ['\n\n---FEEDBACK DO GUARDRAIL---', `Resposta anterior rejeitada: ${rejection.summary}`]

  if (rejection.unsupportedClaims.length > 0) {
    lines.push('Afirmações sem suporte:')
    rejection.unsupportedClaims.forEach(c => lines.push(`- ${c.claim}: ${c.reason}`))
  }

  if (rejection.alteredCriticalInformation.length > 0) {
    lines.push('Informações alteradas:')
    rejection.alteredCriticalInformation.forEach(a =>
      lines.push(`- Original: "${a.original}" → Gerado: "${a.generated}"`),
    )
  }

  if (rejection.omittedCriticalInformation.length > 0) {
    lines.push('Informações de segurança omitidas:')
    rejection.omittedCriticalInformation.forEach(o => lines.push(`- ${o.missingInformation}: ${o.reason}`))
  }

  lines.push('Por favor, corrija os problemas e gere uma nova resposta.')
  return lines.join('\n')
}
