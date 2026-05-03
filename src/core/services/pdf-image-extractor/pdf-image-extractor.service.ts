import { Injectable, Logger } from '@nestjs/common'
import sharp from 'sharp'
import type { ExtractedImage } from '@src/types/simplification'

const MIN_DIMENSION = 100

@Injectable()
export class PdfImageExtractorService {
  private readonly logger = new Logger(PdfImageExtractorService.name)

  async extractImages(buffer: Buffer): Promise<ExtractedImage[]> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfjs = require('pdfjs-dist/legacy/build/pdf.js')
    const pdfDoc = await pdfjs
      .getDocument({ data: new Uint8Array(buffer), useWorkerFetch: false, isEvalSupported: false, disableFontFace: true })
      .promise

    this.logger.log(`PDF carregado — ${pdfDoc.numPages} página(s)`)

    const images: ExtractedImage[] = []
    const seen = new Set<string>()
    let skipped = 0

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum)
      const operatorList = await page.getOperatorList()

      for (let i = 0; i < operatorList.fnArray.length; i++) {
        if (operatorList.fnArray[i] !== pdfjs.OPS.paintImageXObject) continue

        const imgName: string = operatorList.argsArray[i][0]
        if (seen.has(imgName)) continue
        seen.add(imgName)

        try {
          const imgObj = await new Promise<any>((resolve) => page.objs.get(imgName, resolve))

          if (
            !imgObj?.data ||
            imgObj.width < MIN_DIMENSION ||
            imgObj.height < MIN_DIMENSION ||
            (imgObj.kind !== 2 && imgObj.kind !== 3)
          ) {
            skipped++
            continue
          }

          const channels = imgObj.kind === 2 ? 3 : 4
          const pngBuffer = await sharp(Buffer.from(imgObj.data), {
            raw: { width: imgObj.width, height: imgObj.height, channels },
          })
            .png()
            .toBuffer()

          images.push({
            id: `IMAGEM_${images.length + 1}`,
            data: pngBuffer.toString('base64'),
            mimeType: 'image/png',
          })

          this.logger.log(`${images[images.length - 1].id} extraída — ${imgObj.width}×${imgObj.height}px (página ${pageNum})`)
        } catch (err) {
          this.logger.warn(`Imagem ignorada na página ${pageNum}: ${err instanceof Error ? err.message : err}`)
        }
      }
    }

    if (skipped > 0) this.logger.log(`${skipped} imagem(ns) ignorada(s) (pequenas ou formato não suportado)`)
    this.logger.log(`Extração concluída — ${images.length} imagem(ns) extraída(s)`)

    return images
  }
}
