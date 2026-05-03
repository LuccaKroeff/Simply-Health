import { Injectable, Logger } from '@nestjs/common'
import sharp from 'sharp'
import type { ExtractedImage } from '@src/types/simplification'

const MIN_DIMENSION = 100

type PdfjsModule = {
  getDocument: (params: Record<string, unknown>) => {
    promise: Promise<any>
  }
  OPS: {
    paintImageXObject: number
  }
}

const importPdfjs = async (): Promise<PdfjsModule> => {
  const dynamicImport = new Function('modulePath', 'return import(modulePath)') as (
    modulePath: string,
  ) => Promise<PdfjsModule>

  return dynamicImport('pdfjs-dist/legacy/build/pdf.mjs')
}

@Injectable()
export class PdfImageExtractorService {
  private readonly logger = new Logger(PdfImageExtractorService.name)
  private pdfjsPromise?: Promise<PdfjsModule>

  private loadPdfjs(): Promise<PdfjsModule> {
    this.pdfjsPromise ??= importPdfjs()
    return this.pdfjsPromise
  }

  async extractImages(buffer: Buffer): Promise<ExtractedImage[]> {
    const pdfjs = await this.loadPdfjs()

    const pdfDoc = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      disableFontFace: true,

      // Em backend Node/Nest, evita precisar configurar pdf.worker.js/.mjs.
      // Assim também evita mismatch entre API e worker.
      disableWorker: true,
    }).promise

    this.logger.log(`PDF carregado — ${pdfDoc.numPages} página(s)`)

    const images: ExtractedImage[] = []
    const seen = new Set<string>()
    let skipped = 0

    try {
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum)

        try {
          const operatorList = await page.getOperatorList()

          for (let i = 0; i < operatorList.fnArray.length; i++) {
            if (operatorList.fnArray[i] !== pdfjs.OPS.paintImageXObject) continue

            const imgName: string = operatorList.argsArray[i][0]
            if (seen.has(imgName)) continue

            seen.add(imgName)

            try {
              const imgObj = await new Promise<any>(resolve => {
                page.objs.get(imgName, resolve)
              })

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
                raw: {
                  width: imgObj.width,
                  height: imgObj.height,
                  channels,
                },
              })
                .png()
                .toBuffer()

              images.push({
                id: `IMAGEM_${images.length + 1}`,
                data: pngBuffer.toString('base64'),
                mimeType: 'image/png',
              })

              this.logger.log(
                `${images[images.length - 1].id} extraída — ${imgObj.width}×${imgObj.height}px (página ${pageNum})`,
              )
            } catch (err) {
              this.logger.warn(`Imagem ignorada na página ${pageNum}: ${err instanceof Error ? err.message : err}`)
            }
          }
        } finally {
          page.cleanup?.()
        }
      }

      if (skipped > 0) {
        this.logger.log(`${skipped} imagem(ns) ignorada(s) (pequenas ou formato não suportado)`)
      }

      this.logger.log(`Extração concluída — ${images.length} imagem(ns) extraída(s)`)

      return images
    } finally {
      await pdfDoc.destroy?.()
    }
  }
}
