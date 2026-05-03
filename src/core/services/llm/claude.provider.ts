import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'
import { FileInput, LabeledImage, LLMInput, LLMProvider } from './llm-provider.interface'

@Injectable()
export class ClaudeProvider implements LLMProvider {
  readonly name = 'claude'
  private client: Anthropic | null = null

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY')
    if (apiKey) {
      this.client = new Anthropic({ apiKey })
    }
  }

  async complete({ text, file, labeledImages }: LLMInput, systemPrompt: string, temperature = 1.0): Promise<string> {
    if (!this.client) {
      throw new Error('ANTHROPIC_API_KEY não configurada. Defina no .env.')
    }

    const userContent: Anthropic.Messages.MessageParam['content'] = this.buildContent(text, file, labeledImages)

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Resposta inesperada do Claude: tipo não é texto.')
    }

    return content.text
  }

  private buildContent(
    text: string,
    file?: FileInput,
    labeledImages?: LabeledImage[],
  ): Anthropic.Messages.MessageParam['content'] {
    if (!file) return text

    const blocks: Anthropic.Messages.ContentBlockParam[] = [this.buildFileBlock(file)]

    if (labeledImages?.length) {
      blocks.push({ type: 'text', text: 'Imagens do documento para referência:' })
      for (const img of labeledImages) {
        blocks.push({ type: 'text', text: `[${img.id}]:` })
        blocks.push(this.buildImageBlock(img))
      }
    }

    blocks.push({ type: 'text', text })
    return blocks
  }

  private buildFileBlock(file: FileInput): Anthropic.Messages.DocumentBlockParam | Anthropic.Messages.ImageBlockParam {
    const data = file.buffer.toString('base64')
    if (file.mimeType === 'application/pdf') {
      return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } }
    }
    return {
      type: 'image',
      source: {
        type: 'base64',
        media_type: file.mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
        data,
      },
    }
  }

  private buildImageBlock(img: LabeledImage): Anthropic.Messages.ImageBlockParam {
    return {
      type: 'image',
      source: {
        type: 'base64',
        media_type: img.mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
        data: img.buffer.toString('base64'),
      },
    }
  }
}
