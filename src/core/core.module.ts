import { Global, Module } from '@nestjs/common'
import { LlmModule } from './services/llm/llm.module'
import { PdfImageExtractorService } from './services/pdf-image-extractor/pdf-image-extractor.service'
import { TextExtractorService } from './services/text-extractor/text-extractor.service'

@Global()
@Module({
  imports: [LlmModule],
  providers: [TextExtractorService, PdfImageExtractorService],
  exports: [LlmModule, TextExtractorService, PdfImageExtractorService],
})
export class CoreModule {}
