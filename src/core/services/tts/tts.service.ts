import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TtsService {
  constructor(private readonly config: ConfigService) {}

  async synthesize(text: string): Promise<Buffer> {
    const apiKey = this.config.get<string>('GOOGLE_TTS_API_KEY')
    if (!apiKey) {
      throw new Error('GOOGLE_TTS_API_KEY não configurada. Defina no .env.')
    }

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'pt-BR', name: 'pt-BR-Neural2-A' },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      },
    )

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
      throw new Error(`Google TTS error: ${err.error?.message ?? response.statusText}`)
    }

    const data = (await response.json()) as { audioContent: string }
    return Buffer.from(data.audioContent, 'base64')
  }
}
