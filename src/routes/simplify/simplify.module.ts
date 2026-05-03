import { Module } from '@nestjs/common'
import { SimplifyController } from './simplify.controller'
import { ChatAnswerUseCase } from './use-cases/chat-answer.use-case'
import { GenerateQuestionsUseCase } from './use-cases/generate-questions.use-case'
import { SimplifyTextUseCase } from './use-cases/simplify-text.use-case'

@Module({
  controllers: [SimplifyController],
  providers: [SimplifyTextUseCase, GenerateQuestionsUseCase, ChatAnswerUseCase],
})
export class SimplifyModule {}
