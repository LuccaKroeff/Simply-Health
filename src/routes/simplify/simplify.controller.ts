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
import { TtsService } from '@src/core/services/tts/tts.service'
import { findPatientById } from '@src/mock/patients'
import { PatientProfile } from '@src/types/patient'
import { validateChatRequest } from './requests/chat-request.dto'
import { validateSimplifyRequest } from './requests/simplify-request.dto'
import { ChatAnswerUseCase } from './use-cases/chat-answer.use-case'
import { GenerateQuestionsUseCase } from './use-cases/generate-questions.use-case'
import { SimplifyTextUseCase } from './use-cases/simplify-text.use-case'

const SUPPORTED_FILE_TYPES = ['application/pdf', 'text/plain']

@Controller('simplify')
export class SimplifyController {
  constructor(
    private readonly simplifyTextUseCase: SimplifyTextUseCase,
    private readonly generateQuestionsUseCase: GenerateQuestionsUseCase,
    private readonly chatAnswerUseCase: ChatAnswerUseCase,
    private readonly textExtractorService: TextExtractorService,
    private readonly ttsService: TtsService,
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
    const {
      patient,
      text,
      file: fileInput,
    } = await this.resolveInput(dto.patientId, dto.patientProfile, file, dto.text, dto.includeImages)

    return this.simplifyTextUseCase.exec({
      text,
      file: fileInput,
      patient,
      includeGlossary: dto.glossary,
      includeImages: dto.includeImages,
      detailLevel: dto.detailLevel,
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
    const {
      patient,
      text,
      file: fileInput,
    } = await this.resolveInput(dto.patientId, dto.patientProfile, file, dto.text, false)

    return this.generateQuestionsUseCase.exec({ text, file: fileInput, patient })
  }

  @Post('tts')
  async tts(@Body() body: Record<string, unknown>): Promise<{ audio: string }> {
    const text = body.text
    if (typeof text !== 'string' || text.trim().length === 0) {
      throw new BadRequestException('O campo "text" é obrigatório.')
    }
    if (text.length > 5000) {
      throw new BadRequestException('O campo "text" deve ter no máximo 5000 caracteres.')
    }
    const buffer = await this.ttsService.synthesize(text.trim())
    return { audio: buffer.toString('base64') }
  }

  @Post('chat')
  async chat(@Body() body: Record<string, unknown>) {
    const dto = validateChatRequest(body)
    const patient = dto.patientProfile ?? (dto.patientId ? findPatientById(dto.patientId) : undefined)

    if (!patient) {
      if (dto.patientId) throw new NotFoundException(`Paciente não encontrado: ${dto.patientId}`)
      throw new BadRequestException('Informe patientId ou patientProfile.')
    }

    return this.chatAnswerUseCase.exec({
      question: dto.question,
      originalText: dto.originalText,
      patient,
      history: dto.history,
    })
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
