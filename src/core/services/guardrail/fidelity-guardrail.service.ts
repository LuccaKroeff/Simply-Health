import { Inject, Injectable, Logger } from '@nestjs/common'
import { LLM_GUARDRAIL_PROVIDER } from '@src/core/constants/llm.constants'
import { parseJsonFromLLMResponse, validateGuardrailResult } from '@src/core/helpers/json-parser.helper'
import { LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { buildGuardrailSystemPrompt, buildGuardrailUserMessage } from '@src/prompts/guardrail-prompt'
import { PatientProfile } from '@src/types/patient'
import { GuardrailResult } from '@src/types/guardrail'

const GUARDRAIL_TEMPERATURE = 0.1

export interface GuardrailInput {
  originalText: string
  generatedText: string
  patientProfile?: PatientProfile
  attemptNumber: number
}

@Injectable()
export class FidelityGuardrailService {
  private readonly logger = new Logger(FidelityGuardrailService.name)

  constructor(@Inject(LLM_GUARDRAIL_PROVIDER) private readonly llmProvider: LLMProvider) {}

  async evaluate({ originalText, generatedText, attemptNumber }: GuardrailInput): Promise<GuardrailResult> {
    this.logger.log(`Guardrail avaliando tentativa ${attemptNumber} via ${this.llmProvider.name}`)

    const systemPrompt = buildGuardrailSystemPrompt()
    const userMessage = buildGuardrailUserMessage(originalText, generatedText)

    const raw = await this.llmProvider.complete({ text: userMessage }, systemPrompt, GUARDRAIL_TEMPERATURE)

    const result = parseJsonFromLLMResponse(raw, validateGuardrailResult)

    this.logger.log(`Guardrail resultado: ${result.verdict} (confiança: ${result.confidence}) — ${result.summary}`)

    if (result.verdict === 'rejected') {
      this.logRejectionDetails(result)
    }

    return result
  }

  private logRejectionDetails(result: GuardrailResult): void {
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
        `Informações críticas omitidas: ${result.omittedCriticalInformation.map(o => o.missingInformation).join('; ')}`,
      )
    }
  }
}
