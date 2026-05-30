import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BasicReadabilityAnalyzer } from './services/complexity/basic-readability-analyzer'
import { NilcMetrixAdapter } from './services/complexity/nilc-metrix.adapter'
import { TEXT_COMPLEXITY_ANALYZER } from './services/complexity/text-complexity-analyzer.interface'
import { EvaluationExportService } from './services/evaluation/evaluation-export.service'
import { ChatOutputGuardrailService } from './services/guardrail/chat-output-guardrail.service'
import { FidelityGuardrailService } from './services/guardrail/fidelity-guardrail.service'
import { InputGuardrailService } from './services/guardrail/input-guardrail.service'
import { LlmModule } from './services/llm/llm.module'
import { PdfImageExtractorService } from './services/pdf-image-extractor/pdf-image-extractor.service'
import { TextExtractorService } from './services/text-extractor/text-extractor.service'
import { TtsService } from './services/tts/tts.service'

const guardrailServices = [FidelityGuardrailService, InputGuardrailService, ChatOutputGuardrailService]

const complexityProvider = {
  provide: TEXT_COMPLEXITY_ANALYZER,
  useFactory: (config: ConfigService) => {
    const url = config.get<string>('NILC_METRIX_URL', '')
    if (url) return new NilcMetrixAdapter(config)
    return new BasicReadabilityAnalyzer()
  },
  inject: [ConfigService],
}

@Global()
@Module({
  imports: [LlmModule],
  providers: [
    TextExtractorService,
    PdfImageExtractorService,
    TtsService,
    BasicReadabilityAnalyzer,
    NilcMetrixAdapter,
    complexityProvider,
    EvaluationExportService,
    ...guardrailServices,
  ],
  exports: [
    LlmModule,
    TextExtractorService,
    PdfImageExtractorService,
    TtsService,
    complexityProvider,
    EvaluationExportService,
    ...guardrailServices,
  ],
})
export class CoreModule {}
