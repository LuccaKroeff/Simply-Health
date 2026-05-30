import { Inject, Injectable, Logger } from '@nestjs/common'
import { LLM_PROVIDER } from '@src/core/constants/llm.constants'
import { parseQuestions } from '@src/core/helpers/questions-parser.helper'
import { FidelityGuardrailService } from '@src/core/services/guardrail/fidelity-guardrail.service'
import { FileInput, LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { buildQuestionsPrompt } from '@src/prompts/questions-prompt'
import { PatientProfile } from '@src/types/patient'
import { GuardrailResult } from '@src/types/guardrail'
import { QuestionsResponse } from '@src/types/questions'

const MAX_ATTEMPTS = 3

interface GenerateQuestionsParams {
  text?: string
  file?: FileInput
  patient: PatientProfile
}

@Injectable()
export class GenerateQuestionsUseCase {
  private readonly logger = new Logger(GenerateQuestionsUseCase.name)

  constructor(
    @Inject(LLM_PROVIDER) private readonly llmProvider: LLMProvider,
    private readonly guardrail: FidelityGuardrailService,
  ) {}

  async exec({ text, file, patient }: GenerateQuestionsParams): Promise<QuestionsResponse> {
    const systemPrompt = buildQuestionsPrompt(patient)
    const startTime = Date.now()
    const originalText = text ?? ''

    const baseInput = file
      ? { text: 'Com base no texto médico a seguir, gere as perguntas (o conteúdo está no documento em anexo):', file }
      : { text: `Com base no texto médico a seguir, gere as perguntas:\n\n${text}` }

    let lastRejection: GuardrailResult | null = null

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const input = lastRejection
        ? { ...baseInput, text: `${baseInput.text}${buildRetryFeedback(lastRejection)}` }
        : baseInput

      this.logger.log(`Tentativa ${attempt}/${MAX_ATTEMPTS} — gerando perguntas para "${patient.name.split(' ')[0]}"`)

      const raw = await this.llmProvider.complete(input, systemPrompt)
      const questions = parseQuestions(raw)

      const answersText = questions.map(q => `P: ${q.question}\nR: ${q.answer}`).join('\n\n')

      const guardrailResult = await this.guardrail.evaluate({
        originalText,
        generatedText: answersText,
        patientProfile: patient,
        attemptNumber: attempt,
      })

      if (guardrailResult.verdict === 'approved') {
        this.logger.log(`Perguntas aprovadas na tentativa ${attempt} em ${Date.now() - startTime}ms`)
        return {
          questions,
          metadata: {
            model: this.llmProvider.name,
            processingTimeMs: Date.now() - startTime,
            patientProfile: patient,
          },
        }
      }

      lastRejection = guardrailResult
      this.logger.warn(`Tentativa ${attempt} rejeitada pelo guardrail: ${guardrailResult.summary}`)
    }

    this.logger.error(`Todas as ${MAX_ATTEMPTS} tentativas falharam no guardrail. Retornando lista vazia.`)

    return {
      questions: [],
      metadata: {
        model: this.llmProvider.name,
        processingTimeMs: Date.now() - startTime,
        patientProfile: patient,
      },
    }
  }
}

function buildRetryFeedback(rejection: GuardrailResult): string {
  const lines = ['\n\n---FEEDBACK DO GUARDRAIL---', `A versão anterior foi rejeitada: ${rejection.summary}`]

  if (rejection.unsupportedClaims.length > 0) {
    lines.push('Respostas com afirmações sem suporte no texto original:')
    rejection.unsupportedClaims.forEach(c => lines.push(`- ${c.claim}: ${c.reason}`))
  }

  if (rejection.alteredCriticalInformation.length > 0) {
    lines.push('Informações críticas alteradas nas respostas:')
    rejection.alteredCriticalInformation.forEach(a =>
      lines.push(`- Original: "${a.original}" → Gerado: "${a.generated}": ${a.reason}`),
    )
  }

  if (rejection.suggestedFixes.length > 0) {
    lines.push('Correções sugeridas:')
    rejection.suggestedFixes.forEach(f => lines.push(`- ${f}`))
  }

  lines.push('Por favor, corrija os problemas acima e gere novas perguntas e respostas.')
  return lines.join('\n')
}
