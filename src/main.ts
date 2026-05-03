import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT', 3000)

  await app.listen(port)

  console.log(`SimplyHealth API rodando em http://localhost:${port}`)
  console.log(`Endpoints:`)
  console.log(`  GET  /api/health`)
  console.log(`  POST /api/simplify`)
  console.log(`  POST /api/simplify/questions`)
}

bootstrap()
