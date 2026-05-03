import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { FileInput } from '@src/core/services/llm/llm-provider.interface'
import { TextExtractorService } from '@src/core/services/text-extractor/text-extractor.service'
import { findPatientById } from '@src/mock/patients'
import { PatientProfile } from '@src/types/patient'
import { validateSimplifyRequest } from './requests/simplify-request.dto'
import { GenerateQuestionsUseCase } from './use-cases/generate-questions.use-case'
import { SimplifyTextUseCase } from './use-cases/simplify-text.use-case'

const SUPPORTED_FILE_TYPES = ['application/pdf', 'text/plain']

@Controller('simplify')
export class SimplifyController {
  constructor(
    private readonly simplifyTextUseCase: SimplifyTextUseCase,
    private readonly generateQuestionsUseCase: GenerateQuestionsUseCase,
    private readonly textExtractorService: TextExtractorService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async simplify(@Body() body: Record<string, unknown>, @UploadedFile() file?: Express.Multer.File) {
    const dto = validateSimplifyRequest(body)
    const { patient, text, file: fileInput } = await this.resolveInput(
      dto.patientId,
      dto.patientProfile,
      file,
      dto.text,
      dto.includeImages,
    )

    return this.simplifyTextUseCase.exec({
      text,
      file: fileInput,
      patient,
      includeGlossary: dto.glossary,
      includeImages: dto.includeImages,
    })
  }

  @Post('questions')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async questions(@Body() body: Record<string, unknown>, @UploadedFile() file?: Express.Multer.File) {
    const dto = validateSimplifyRequest(body)
    const { patient, text, file: fileInput } = await this.resolveInput(
      dto.patientId,
      dto.patientProfile,
      file,
      dto.text,
      false,
    )

    return this.generateQuestionsUseCase.exec({ text, file: fileInput, patient })
  }

  private async resolveInput(
    patientId?: string,
    patientProfile?: PatientProfile,
    file?: Express.Multer.File,
    bodyText?: string,
    includeImages = false,
  ): Promise<{ patient: PatientProfile; text?: string; file?: FileInput }> {
    const patient = patientProfile ?? (patientId ? findPatientById(patientId) : undefined)

    if (!patient) {
      if (patientId) throw new NotFoundException(`Paciente não encontrado: ${patientId}`)
      throw new BadRequestException('Informe patientId ou patientProfile.')
    }

    if (file) {
      if (!SUPPORTED_FILE_TYPES.includes(file.mimetype)) {
        throw new BadRequestException(`Tipo de arquivo não suportado: ${file.mimetype}. Use PDF ou TXT.`)
      }

      if (file.mimetype === 'application/pdf' && includeImages) {
        return { patient, file: { buffer: file.buffer, mimeType: file.mimetype } }
      }

      const text = await this.textExtractorService.extractFromFile(file.buffer, file.mimetype)
      return { patient, text }
    }

    if (bodyText) return { patient, text: bodyText }

    throw new BadRequestException('Envie um campo "text" ou um arquivo "file".')
  }
}
