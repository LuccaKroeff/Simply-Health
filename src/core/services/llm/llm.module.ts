import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LLM_PROVIDER } from '@src/core/constants/llm.constants'
import { ClaudeProvider } from './claude.provider'
import { GeminiProvider } from './gemini.provider'
import { MockProvider } from './mock.provider'

@Module({
  providers: [
    ClaudeProvider,
    GeminiProvider,
    MockProvider,
    {
      provide: LLM_PROVIDER,
      useFactory: (config: ConfigService, claude: ClaudeProvider, gemini: GeminiProvider, mock: MockProvider) => {
        const provider = config.get<string>('LLM_PROVIDER', 'mock')
        switch (provider) {
          case 'claude':
            return claude
          case 'gemini':
            return gemini
          case 'mock':
            return mock
          default:
            throw new Error(`LLM provider desconhecido: ${provider}. Use "claude", "gemini" ou "mock".`)
        }
      },
      inject: [ConfigService, ClaudeProvider, GeminiProvider, MockProvider],
    },
  ],
  exports: [LLM_PROVIDER],
})
export class LlmModule {}
