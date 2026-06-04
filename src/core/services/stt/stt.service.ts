import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SUPPORTED_MIME_TYPES = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav']

@Injectable()
export class SttService {
  private readonly logger = new Logger(SttService.name)
  private client: GoogleGenerativeAI | null = null

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY')
    if (apiKey) this.client = new GoogleGenerativeAI(apiKey)
  }

  async transcribe(audioBuffer: Buffer, rawMimeType: string): Promise<string> {
    if (!this.client) {
      throw new Error('GEMINI_API_KEY não configurada. Transcrição de áudio requer o provider Gemini.')
    }

    const mimeType = this.normalizeMimeType(rawMimeType)
    this.logger.log(`Transcrevendo áudio: ${mimeType} (${audioBuffer.length} bytes)`)

    const model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    const result = await model.generateContent([
      {
        inlineData: {
          data: audioBuffer.toString('base64'),
          mimeType,
        },
      },
      'Transcreva o áudio a seguir em português. Retorne apenas o texto transcrito, sem explicações adicionais.',
    ])

    const text = result.response.text().trim()
    this.logger.log(`Transcrição concluída: "${text.slice(0, 80)}${text.length > 80 ? '...' : ''}"`)
    return text
  }

  private normalizeMimeType(raw: string): string {
    const base = raw.split(';')[0].trim().toLowerCase()
    if (SUPPORTED_MIME_TYPES.includes(base)) return base
    if (base.startsWith('audio/')) return base
    return 'audio/webm'
  }
}
