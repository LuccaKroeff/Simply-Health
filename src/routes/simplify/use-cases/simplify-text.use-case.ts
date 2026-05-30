import { Inject, Injectable, Logger, Optional } from '@nestjs/common'
import { LLM_PROVIDER } from '@src/core/constants/llm.constants'
import { parseResponse } from '@src/core/helpers/glossary-parser.helper'
import { detectCriticalAlterations } from '@src/core/helpers/deterministic-checker.helper'
import {
  TEXT_COMPLEXITY_ANALYZER,
  TextComplexityAnalyzer,
} from '@src/core/services/complexity/text-complexity-analyzer.interface'
import { FidelityGuardrailService } from '@src/core/services/guardrail/fidelity-guardrail.service'
import { FileInput, LLMProvider } from '@src/core/services/llm/llm-provider.interface'
import { PdfImageExtractorService } from '@src/core/services/pdf-image-extractor/pdf-image-extractor.service'
import { TextExtractorService } from '@src/core/services/text-extractor/text-extractor.service'
import { buildSimplifyPrompt, DetailLevel } from '@src/prompts/simplify-prompt'
import { PatientProfile } from '@src/types/patient'
import { GuardrailResult } from '@src/types/guardrail'
import { SimplifyResponse } from '@src/types/simplification'

const MAX_ATTEMPTS = 3
const SIMPLIFICATION_TEMPERATURE = 0.3
const SAFE_FALLBACK_MESSAGE =
  'Não foi possível gerar uma versão simplificada com segurança suficiente a partir do conteúdo informado.'

interface SimplifyTextParams {
  text?: string
  file?: FileInput
  patient: PatientProfile
  includeGlossary: boolean
  includeImages: boolean
  detailLevel: DetailLevel
}

@Injectable()
export class SimplifyTextUseCase {
  private readonly logger = new Logger(SimplifyTextUseCase.name)

  constructor(
    @Inject(LLM_PROVIDER) private readonly llmProvider: LLMProvider,
    private readonly pdfImageExtractor: PdfImageExtractorService,
    private readonly textExtractor: TextExtractorService,
    private readonly guardrail: FidelityGuardrailService,
    @Optional() @Inject(TEXT_COMPLEXITY_ANALYZER) private readonly complexityAnalyzer: TextComplexityAnalyzer | null,
  ) {}

  async exec({
    text,
    file,
    patient,
    includeGlossary,
    includeImages,
    detailLevel,
  }: SimplifyTextParams): Promise<SimplifyResponse> {
    const systemPrompt = buildSimplifyPrompt(patient, includeGlossary, detailLevel)
    const startTime = Date.now()

    this.logger.log(`Simplificando para paciente "${patient.name}" via ${this.llmProvider.name}`)
    this.logger.log(`Entrada: ${file ? `arquivo (${file.mimeType})` : `texto (${text?.length ?? 0} chars)`}`)
    this.logger.log(`Opções: glossário=${includeGlossary}, imagens=${includeImages}`)

    const originalText = text ?? (file ? await this.textExtractor.extractFromFile(file.buffer, file.mimeType) : '')

    const images =
      includeImages && file?.mimeType === 'application/pdf'
        ? await this.pdfImageExtractor.extractImages(file.buffer)
        : []

    const imageHint =
      images.length > 0
        ? `Use os marcadores [IMAGEM_1] até [IMAGEM_${images.length}] para referenciar as imagens mostradas acima quando ajudarem o paciente a entender o conteúdo. Omita apenas as decorativas ou completamente irrelevantes.`
        : ''

    const baseUserMessage = file
      ? `Simplifique o seguinte texto médico (o conteúdo está no documento em anexo).${imageHint}`
      : `Simplifique o seguinte texto médico:\n\n${text}`

    const input = file
      ? {
          text: baseUserMessage,
          file,
          labeledImages: images.map(img => ({
            id: img.id,
            buffer: Buffer.from(img.data, 'base64'),
            mimeType: img.mimeType,
          })),
        }
      : { text: baseUserMessage }

    if (images.length > 0) {
      this.logger.log(`Blocos enviados: 1 PDF + ${images.length} imagem(ns) rotulada(s) + 1 texto`)
    }

    let lastRejection: GuardrailResult | null = null

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const userMessage = lastRejection
        ? { ...input, text: `${input.text}${buildRetryFeedback(lastRejection)}` }
        : input

      this.logger.log(`Tentativa ${attempt}/${MAX_ATTEMPTS} — gerando simplificação`)
      this.logger.log(
        `Mensagem do usuário: "${userMessage.text.slice(0, 120)}${userMessage.text.length > 120 ? '...' : ''}"`,
      )

      const raw = await this.llmProvider.complete(userMessage, systemPrompt, SIMPLIFICATION_TEMPERATURE)
      const { simplified, glossary } = parseResponse(raw, includeGlossary)

      const deterministicIssues = detectCriticalAlterations(originalText, simplified)
      if (deterministicIssues.length > 0) {
        this.logger.warn(
          `Tentativa ${attempt} bloqueada pelo checker determinístico: ${deterministicIssues.join('; ')}`,
        )
        lastRejection = buildDeterministicRejection(deterministicIssues)
        continue
      }

      const guardrailResult = await this.guardrail.evaluate({
        originalText,
        generatedText: simplified,
        patientProfile: patient,
        attemptNumber: attempt,
      })

      if (guardrailResult.verdict === 'approved') {
        const referencedImages = images.filter(img => simplified.includes(`[${img.id}]`))
        this.logger.log(
          `Aprovado na tentativa ${attempt} em ${Date.now() - startTime}ms — ${referencedImages.length}/${images.length} imagem(ns) referenciada(s)`,
        )

        const complexity = this.complexityAnalyzer
          ? await this.complexityAnalyzer.compare(originalText, simplified).catch(() => undefined)
          : undefined

        return {
          simplifiedText: simplified,
          originalText,
          glossary: includeGlossary ? glossary : undefined,
          images: referencedImages.length > 0 ? referencedImages : undefined,
          complexity,
          metadata: {
            model: this.llmProvider.name,
            processingTimeMs: Date.now() - startTime,
            patientProfile: patient,
            imagesFound: images.length,
            attemptCount: attempt,
            usedFallback: false,
          },
        }
      }

      lastRejection = guardrailResult
      this.logger.warn(`Tentativa ${attempt} rejeitada pelo guardrail: ${guardrailResult.summary}`)
    }

    this.logger.error(`Todas as ${MAX_ATTEMPTS} tentativas falharam no guardrail. Retornando mensagem de fallback.`)

    return {
      simplifiedText: SAFE_FALLBACK_MESSAGE,
      originalText,
      glossary: undefined,
      images: undefined,
      metadata: {
        model: this.llmProvider.name,
        processingTimeMs: Date.now() - startTime,
        patientProfile: patient,
        imagesFound: images.length,
        attemptCount: MAX_ATTEMPTS,
        usedFallback: true,
      },
    }
  }
}

function buildDeterministicRejection(issues: string[]): GuardrailResult {
  return {
    verdict: 'rejected',
    confidence: 1,
    summary: 'Alterações críticas detectadas por verificação determinística.',
    unsupportedClaims: [],
    alteredCriticalInformation: issues.map(issue => ({
      original: issue,
      generated: '',
      reason: 'Detectado por regex antes da avaliação LLM.',
      severity: 'high',
    })),
    omittedCriticalInformation: [],
    suggestedFixes: issues,
  }
}

function buildRetryFeedback(rejection: GuardrailResult): string {
  const lines = ['\n\n---FEEDBACK DO GUARDRAIL---', `A versão anterior foi rejeitada: ${rejection.summary}`]

  if (rejection.unsupportedClaims.length > 0) {
    lines.push('Afirmações sem suporte no original:')
    rejection.unsupportedClaims.forEach(c => lines.push(`- ${c.claim}: ${c.reason}`))
  }

  if (rejection.alteredCriticalInformation.length > 0) {
    lines.push('Informações críticas alteradas:')
    rejection.alteredCriticalInformation.forEach(a =>
      lines.push(`- Original: "${a.original}" → Gerado: "${a.generated}": ${a.reason}`),
    )
  }

  if (rejection.omittedCriticalInformation.length > 0) {
    lines.push('Informações críticas omitidas:')
    rejection.omittedCriticalInformation.forEach(o => lines.push(`- ${o.missingInformation}: ${o.reason}`))
  }

  if (rejection.suggestedFixes.length > 0) {
    lines.push('Correções sugeridas:')
    rejection.suggestedFixes.forEach(f => lines.push(`- ${f}`))
  }

  lines.push('Por favor, corrija os problemas acima e gere uma nova versão simplificada.')
  return lines.join('\n')
}
