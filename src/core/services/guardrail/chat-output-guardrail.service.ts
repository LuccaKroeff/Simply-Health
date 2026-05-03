import { Inject, Injectable, Logger } from '@nestjs/common'
import { LLM_GUARDRAIL_PROVIDER } from '@src/core/constants/llm.constants'
import { parseJsonFromLLMResponse, validateGuardrailResult } from '@src/core/helpers/json-parser.helper'
import { LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import {
  buildChatOutputGuardrailSystemPrompt,
  buildChatOutputGuardrailUserMessage,
} from '@src/prompts/guardrail-prompt'
import { GuardrailResult } from '@src/types/guardrail'

const CHAT_OUTPUT_GUARDRAIL_TEMPERATURE = 0.1

@Injectable()
export class ChatOutputGuardrailService {
  private readonly logger = new Logger(ChatOutputGuardrailService.name)

  constructor(@Inject(LLM_GUARDRAIL_PROVIDER) private readonly llmProvider: LLMProvider) {}

  async evaluate(originalText: string, question: string, answer: string, attempt: number): Promise<GuardrailResult> {
    this.logger.log(`Guardrail de saída do chat avaliando tentativa ${attempt} via ${this.llmProvider.name}`)

    const systemPrompt = buildChatOutputGuardrailSystemPrompt()
    const userMessage = buildChatOutputGuardrailUserMessage(originalText, question, answer)

    const raw = await this.llmProvider.complete({ text: userMessage }, systemPrompt, CHAT_OUTPUT_GUARDRAIL_TEMPERATURE)

    const result = parseJsonFromLLMResponse(raw, validateGuardrailResult)

    this.logger.log(`Guardrail de saída: ${result.verdict} (confiança: ${result.confidence}) — ${result.summary}`)

    if (result.verdict === 'rejected') {
      if (result.unsupportedClaims.length > 0) {
        this.logger.warn(`Afirmações sem suporte: ${result.unsupportedClaims.map(c => c.claim).join('; ')}`)
      }
      if (result.alteredCriticalInformation.length > 0) {
        this.logger.warn(
          `Informações críticas alteradas: ${result.alteredCriticalInformation.map(a => `"${a.original}" → "${a.generated}"`).join('; ')}`,
        )
      }
      if (result.omittedCriticalInformation.length > 0) {
        this.logger.warn(
          `Informações de segurança omitidas: ${result.omittedCriticalInformation.map(o => o.missingInformation).join('; ')}`,
        )
      }
    }

    return result
  }
}
