import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CoreModule } from '@src/core/core.module'
import { RoutesModule } from '@src/routes/routes.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CoreModule, RoutesModule],
})
export class AppModule {}
