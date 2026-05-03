import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenerativeAI, Part } from '@google/generative-ai'
import { LLMInput, LLMProvider } from './llm-provider.interface'

@Injectable()
export class GeminiProvider implements LLMProvider {
  readonly name = 'gemini-2.5-flash-lite'
  private client: GoogleGenerativeAI | null = null

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY')
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey)
    }
  }

  async complete({ text, file, labeledImages }: LLMInput, systemPrompt: string): Promise<string> {
    if (!this.client) {
      throw new Error('GEMINI_API_KEY não configurada. Defina no .env.')
    }

    const model = this.client.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: systemPrompt,
    })

    const parts: Array<string | Part> = []

    if (file) {
      parts.push({ inlineData: { data: file.buffer.toString('base64'), mimeType: file.mimeType } })
    }

    if (labeledImages?.length) {
      parts.push('Imagens do documento para referência:')
      for (const img of labeledImages) {
        parts.push(`[${img.id}]:`)
        parts.push({ inlineData: { data: img.buffer.toString('base64'), mimeType: img.mimeType } })
      }
    }

    parts.push(text)

    const result = await model.generateContent(parts)
    return result.response.text()
  }
}
