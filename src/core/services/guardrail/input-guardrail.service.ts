import { Inject, Injectable, Logger } from '@nestjs/common'
import { LLM_GUARDRAIL_PROVIDER } from '@src/core/constants/llm.constants'
import {
  parseJsonFromLLMResponse,
  validateNumberField,
  validateStringField,
} from '@src/core/helpers/json-parser.helper'
import { LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { buildInputGuardrailSystemPrompt, buildInputGuardrailUserMessage } from '@src/prompts/input-guardrail-prompt'
import { InputGuardrailClassification, InputGuardrailResult } from '@src/types/chat'

const INPUT_GUARDRAIL_TEMPERATURE = 0.1

const VALID_CLASSIFICATIONS: InputGuardrailClassification[] = [
  'allowed',
  'out_of_scope',
  'insufficient_context',
  'medical_advice',
  'emergency',
]

@Injectable()
export class InputGuardrailService {
  private readonly logger = new Logger(InputGuardrailService.name)

  constructor(@Inject(LLM_GUARDRAIL_PROVIDER) private readonly llmProvider: LLMProvider) {}

  async classify(question: string, originalText: string): Promise<InputGuardrailResult> {
    this.logger.log(`Guardrail de entrada classificando pergunta via ${this.llmProvider.name}`)

    const systemPrompt = buildInputGuardrailSystemPrompt(originalText)
    const userMessage = buildInputGuardrailUserMessage(question)

    const raw = await this.llmProvider.complete({ text: userMessage }, systemPrompt, INPUT_GUARDRAIL_TEMPERATURE)

    const result = parseJsonFromLLMResponse(raw, this.validateInputGuardrailResult)

    this.logger.log(
      `Guardrail de entrada: ${result.classification} (confiança: ${result.confidence}) — ${result.reason}`,
    )

    return result
  }

  private validateInputGuardrailResult(parsed: unknown): InputGuardrailResult {
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Guardrail de entrada: resposta não é um objeto JSON.')
    }

    const obj = parsed as Record<string, unknown>
    const classification = validateStringField(obj, 'classification') as InputGuardrailClassification

    if (!VALID_CLASSIFICATIONS.includes(classification)) {
      throw new Error(`Guardrail de entrada: classificação inválida: "${classification}"`)
    }

    return {
      classification,
      confidence: validateNumberField(obj, 'confidence'),
      reason: validateStringField(obj, 'reason'),
      safeResponse: typeof obj['safeResponse'] === 'string' ? obj['safeResponse'] : null,
    }
  }
}
