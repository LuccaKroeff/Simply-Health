import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { ComplexityComparison, ReadabilityMetrics } from '@src/types/complexity'
import type { MetricsComparison, NilcMetrixRawResponse, SimplificationMetrics } from '@src/types/nilc-metrics'
import { computeMetricsComparison, mapNilcMetrixResponse } from './nilc-metrix.mapper'
import type { TextComplexityAnalyzer } from './text-complexity-analyzer.interface'

@Injectable()
export class NilcMetrixAdapter implements TextComplexityAnalyzer {
  readonly name = 'nilc-metrix'
  private readonly logger = new Logger(NilcMetrixAdapter.name)
  private readonly baseUrl: string

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('NILC_METRIX_URL', '').replace(/\/$/, '')
  }

  async analyze(text: string): Promise<ReadabilityMetrics> {
    const metrics = await this.callApi(text)
    return metrics
  }

  async compare(original: string, simplified: string): Promise<ComplexityComparison> {
    const [origMetrics, simpMetrics] = await Promise.all([
      this.callApi(original),
      this.callApi(simplified),
    ])
    return computeMetricsComparison(origMetrics, simpMetrics, this.name) satisfies MetricsComparison
  }

  private async callApi(text: string): Promise<SimplificationMetrics> {
    const url = `${this.baseUrl}/api/metrics`
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(15_000),
      })

      if (!response.ok) {
        throw new Error(`NILC-Metrix returned HTTP ${response.status}`)
      }

      const raw = (await response.json()) as NilcMetrixRawResponse
      return mapNilcMetrixResponse(raw)
    } catch (err) {
      this.logger.error(`Falha ao chamar NILC-Metrix (${url}): ${(err as Error).message}`)
      throw err
    }
  }
}
