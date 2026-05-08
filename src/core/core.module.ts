import { Global, Module } from '@nestjs/common'
import { BasicReadabilityAnalyzer } from './services/complexity/basic-readability-analyzer'
import { TEXT_COMPLEXITY_ANALYZER } from './services/complexity/text-complexity-analyzer.interface'
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
  useClass: BasicReadabilityAnalyzer,
}

@Global()
@Module({
  imports: [LlmModule],
  providers: [TextExtractorService, PdfImageExtractorService, TtsService, BasicReadabilityAnalyzer, complexityProvider, ...guardrailServices],
  exports: [LlmModule, TextExtractorService, PdfImageExtractorService, TtsService, complexityProvider, ...guardrailServices],
})
export class CoreModule {}
