import { Global, Module } from '@nestjs/common'
import { ChatOutputGuardrailService } from './services/guardrail/chat-output-guardrail.service'
import { FidelityGuardrailService } from './services/guardrail/fidelity-guardrail.service'
import { InputGuardrailService } from './services/guardrail/input-guardrail.service'
import { LlmModule } from './services/llm/llm.module'
import { PdfImageExtractorService } from './services/pdf-image-extractor/pdf-image-extractor.service'
import { TextExtractorService } from './services/text-extractor/text-extractor.service'
import { TtsService } from './services/tts/tts.service'

const guardrailServices = [FidelityGuardrailService, InputGuardrailService, ChatOutputGuardrailService]

@Global()
@Module({
  imports: [LlmModule],
  providers: [TextExtractorService, PdfImageExtractorService, TtsService, ...guardrailServices],
  exports: [LlmModule, TextExtractorService, PdfImageExtractorService, TtsService, ...guardrailServices],
})
export class CoreModule {}
