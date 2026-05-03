import { Inject, Injectable, Logger } from '@nestjs/common'
import { LLM_PROVIDER } from '@src/core/constants/llm.constants'
import { parseResponse } from '@src/core/helpers/glossary-parser.helper'
import { FileInput, LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { PdfImageExtractorService } from '@src/core/services/pdf-image-extractor/pdf-image-extractor.service'
import { buildSimplifyPrompt } from '@src/prompts/simplify-prompt'
import { PatientProfile } from '@src/types/patient'
import { SimplifyResponse } from '@src/types/simplification'

interface SimplifyTextParams {
  text?: string
  file?: FileInput
  patient: PatientProfile
  includeGlossary: boolean
  includeImages: boolean
}

@Injectable()
export class SimplifyTextUseCase {
  private readonly logger = new Logger(SimplifyTextUseCase.name)

  constructor(
    @Inject(LLM_PROVIDER) private readonly llmProvider: LLMProvider,
    private readonly pdfImageExtractor: PdfImageExtractorService,
  ) {}

  async exec({ text, file, patient, includeGlossary, includeImages }: SimplifyTextParams): Promise<SimplifyResponse> {
    const systemPrompt = buildSimplifyPrompt(patient, includeGlossary)
    const startTime = Date.now()

    this.logger.log(`Simplificando para paciente "${patient.name}" via ${this.llmProvider.name}`)
    this.logger.log(`Entrada: ${file ? `arquivo (${file.mimeType})` : `texto (${text?.length ?? 0} chars)`}`)
    this.logger.log(`Opções: glossário=${includeGlossary}, imagens=${includeImages}`)

    const images =
      includeImages && file?.mimeType === 'application/pdf'
        ? await this.pdfImageExtractor.extractImages(file.buffer)
        : []

    const imageHint =
      images.length > 0
        ? `Use os marcadores [IMAGEM_1] até [IMAGEM_${images.length}] para referenciar as imagens mostradas acima quando ajudarem o paciente a entender o conteúdo. Omita apenas as decorativas ou completamente irrelevantes.`
        : ''

    const userMessage = file
      ? `Simplifique o seguinte texto médico (o conteúdo está no documento em anexo).${imageHint}`
      : `Simplifique o seguinte texto médico:\n\n${text}`

    this.logger.log(`Mensagem do usuário: "${userMessage.slice(0, 120)}${userMessage.length > 120 ? '...' : ''}"`)
    if (images.length > 0) {
      this.logger.log(`Blocos enviados: 1 PDF + ${images.length} imagem(ns) rotulada(s) + 1 texto`)
    }

    const input = file
      ? {
          text: userMessage,
          file,
          labeledImages: images.map((img) => ({
            id: img.id,
            buffer: Buffer.from(img.data, 'base64'),
            mimeType: img.mimeType,
          })),
        }
      : { text: userMessage }

    const raw = await this.llmProvider.complete(input, systemPrompt)
    const { simplified, glossary } = parseResponse(raw, includeGlossary)

    const referencedImages = images.filter((img) => simplified.includes(`[${img.id}]`))

    this.logger.log(`Concluído em ${Date.now() - startTime}ms — ${referencedImages.length}/${images.length} imagem(ns) referenciada(s) pela LLM`)

    return {
      simplifiedText: simplified,
      glossary: includeGlossary ? glossary : undefined,
      images: referencedImages.length > 0 ? referencedImages : undefined,
      metadata: {
        model: this.llmProvider.name,
        processingTimeMs: Date.now() - startTime,
        patientProfile: patient,
        imagesFound: images.length,
      },
    }
  }
}
