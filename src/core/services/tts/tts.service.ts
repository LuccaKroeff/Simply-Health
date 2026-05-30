import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Available voices: Aoede, Charon, Fenrir, Kore, Puck, Zephyr, Leda, Orus, Algieba, etc.
const VOICE = 'Aoede'
const MODEL = 'gemini-2.5-flash-preview-tts'

@Injectable()
export class TtsService {
  constructor(private readonly config: ConfigService) {}

  async synthesize(text: string): Promise<Buffer> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada. Defina no .env.')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: MODEL })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
        },
      } as object,
    })

    const part = result.response.candidates?.[0]?.content?.parts?.[0]
    if (!part || !('inlineData' in part) || !part.inlineData) {
      throw new Error('Gemini TTS não retornou áudio.')
    }

    const pcm = Buffer.from(part.inlineData.data, 'base64')
    return buildWav(pcm)
  }
}

function buildWav(pcm: Buffer, sampleRate = 24000, channels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8
  const blockAlign = (channels * bitsPerSample) / 8
  const dataSize = pcm.length
  const header = Buffer.alloc(44)

  header.write('RIFF', 0)
  header.writeUInt32LE(36 + dataSize, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20) // PCM
  header.writeUInt16LE(channels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(byteRate, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)
  header.write('data', 36)
  header.writeUInt32LE(dataSize, 40)

  return Buffer.concat([header, pcm])
}
