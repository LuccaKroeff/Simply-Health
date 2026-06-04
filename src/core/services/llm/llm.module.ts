import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LLM_GUARDRAIL_PROVIDER, LLM_PROVIDER } from '@src/core/constants/llm.constants'
import { ClaudeProvider } from './claude.provider'
import { GeminiProvider } from './gemini.provider'
import { MockProvider } from './mock.provider'

function makeProvider(providerName: string, config: ConfigService, geminiModel: string) {
  switch (providerName) {
    case 'claude':
      return new ClaudeProvider(config)
    case 'gemini':
      return new GeminiProvider(config, geminiModel)
    case 'mock':
      return new MockProvider()
    default:
      throw new Error(`LLM provider desconhecido: ${providerName}. Use "claude", "gemini" ou "mock".`)
  }
}

@Module({
  providers: [
    {
      provide: LLM_PROVIDER,
      useFactory: (config: ConfigService) => {
        const name = config.get<string>('LLM_PROVIDER', 'mock')
        return makeProvider(name, config, 'gemini-2.5-flash-lite')
      },
      inject: [ConfigService],
    },
    {
      provide: LLM_GUARDRAIL_PROVIDER,
      useFactory: (config: ConfigService) => {
        const fallback = config.get<string>('LLM_PROVIDER', 'mock')
        const name = config.get<string>('GUARDRAIL_PROVIDER', fallback)
        return makeProvider(name, config, 'gemini-2.5-flash')
      },
      inject: [ConfigService],
    },
  ],
  exports: [LLM_PROVIDER, LLM_GUARDRAIL_PROVIDER],
})
export class LlmModule {}
