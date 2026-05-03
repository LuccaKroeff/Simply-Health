import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { SimplifyModule } from './simplify/simplify.module'

@Module({
  imports: [HealthModule, SimplifyModule],
})
export class RoutesModule {}
