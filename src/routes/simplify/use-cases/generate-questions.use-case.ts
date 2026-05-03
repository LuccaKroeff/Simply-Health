import { Inject, Injectable } from '@nestjs/common'
import { LLM_PROVIDER } from '@src/core/constants/llm.constants'
import { parseQuestions } from '@src/core/helpers/questions-parser.helper'
import { FileInput, LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { buildQuestionsPrompt } from '@src/prompts/questions-prompt'
import { PatientProfile } from '@src/types/patient'
import { QuestionsResponse } from '@src/types/questions'

interface GenerateQuestionsParams {
  text?: string
  file?: FileInput
  patient: PatientProfile
}

@Injectable()
export class GenerateQuestionsUseCase {
  constructor(@Inject(LLM_PROVIDER) private readonly llmProvider: LLMProvider) {}

  async exec({ text, file, patient }: GenerateQuestionsParams): Promise<QuestionsResponse> {
    const systemPrompt = buildQuestionsPrompt(patient)
    const startTime = Date.now()

    const input = file
      ? { text: 'Com base no texto médico a seguir, gere as perguntas (o conteúdo está no documento em anexo):', file }
      : { text: `Com base no texto médico a seguir, gere as perguntas:\n\n${text}` }

    const raw = await this.llmProvider.complete(input, systemPrompt)
    const questions = parseQuestions(raw)

    return {
      questions,
      metadata: {
        model: this.llmProvider.name,
        processingTimeMs: Date.now() - startTime,
        patientProfile: patient,
      },
    }
  }
}
