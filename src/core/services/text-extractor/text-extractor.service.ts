import { Injectable, BadRequestException } from '@nestjs/common'
import { PDFParse } from 'pdf-parse'

@Injectable()
export class TextExtractorService {
  async extractFromFile(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: new Uint8Array(buffer) })
      const result = await parser.getText()
      return this.cleanText(result.text)
    }

    if (mimetype === 'text/plain') {
      return this.cleanText(buffer.toString('utf-8'))
    }

    throw new BadRequestException(`Tipo de arquivo não suportado: ${mimetype}. Use PDF ou TXT.`)
  }

  private cleanText(text: string): string {
    return text
      .replace(/—\s*\d+\s*of\s*\d+\s*—/g, '') // remove marcadores de página
      .replace(/\r\n/g, '\n') // normaliza quebras de linha Windows
      .replace(/[ \t]+/g, ' ') // colapsa espaços/tabs múltiplos
      .replace(/\n{3,}/g, '\n\n') // máximo de 2 quebras seguidas
      .trim()
  }
}
