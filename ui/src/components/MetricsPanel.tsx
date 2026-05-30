import { useState } from 'react'
import type { ComplexityComparison, MetricsComparison, SimplificationMetrics } from '../types'

interface Props {
  complexity: ComplexityComparison
}

function isMetricsComparison(c: ComplexityComparison): c is MetricsComparison {
  return 'delta' in c && c.delta !== undefined
}

export default function MetricsPanel({ complexity }: Props) {
  const [open, setOpen] = useState(false)
  const rich = isMetricsComparison(complexity)

  return (
    <div className="metrics-panel">
      <button type="button" className="metrics-toggle" onClick={() => setOpen(o => !o)}>
        <span>Indicadores de simplificação</span>
        <span className="metrics-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="metrics-body">
          <p className="metrics-disclaimer">
            Esses indicadores ajudam a comparar a complexidade textual antes e depois da simplificação. Eles avaliam
            aspectos linguísticos como tamanho de frases e diversidade de vocabulário — não validam precisão médica nem
            comprovam compreensão do paciente.
          </p>

          {complexity.shortText && (
            <p className="metrics-short-text-warning">
              O texto é curto, então os indicadores podem ser menos representativos.
            </p>
          )}

          <div className="metrics-table-wrapper">
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Original</th>
                  <th>Simplificado</th>
                  {rich && <th>Variação</th>}
                </tr>
              </thead>
              <tbody>
                <MetricRow
                  label="Legibilidade Flesch"
                  original={complexity.original.fleschScore}
                  simplified={complexity.simplified.fleschScore}
                  delta={rich ? complexity.delta.fleschScore : undefined}
                  badge={{ original: complexity.original.fleschLabel, simplified: complexity.simplified.fleschLabel }}
                  higherIsBetter
                />
                <MetricRow
                  label="Palavras por frase"
                  original={complexity.original.avgWordsPerSentence}
                  simplified={complexity.simplified.avgWordsPerSentence}
                  delta={rich ? complexity.delta.avgWordsPerSentence : undefined}
                  higherIsBetter={false}
                />
                <MetricRow
                  label="Palavras"
                  original={complexity.original.wordCount}
                  simplified={complexity.simplified.wordCount}
                  delta={rich ? complexity.delta.wordCount : undefined}
                />
                <MetricRow
                  label="Frases"
                  original={complexity.original.sentenceCount}
                  simplified={complexity.simplified.sentenceCount}
                  delta={rich ? complexity.delta.sentenceCount : undefined}
                />
                {rich && hasValue(complexity.original as SimplificationMetrics, 'syllablesPerContentWord') && (
                  <MetricRow
                    label="Sílabas por palavra"
                    original={(complexity.original as SimplificationMetrics).syllablesPerContentWord}
                    simplified={(complexity.simplified as SimplificationMetrics).syllablesPerContentWord}
                    delta={complexity.delta.syllablesPerContentWord}
                    higherIsBetter={false}
                  />
                )}
                {rich && hasValue(complexity.original as SimplificationMetrics, 'contentDensity') && (
                  <MetricRow
                    label="Densidade de conteúdo"
                    original={(complexity.original as SimplificationMetrics).contentDensity}
                    simplified={(complexity.simplified as SimplificationMetrics).contentDensity}
                    delta={complexity.delta.contentDensity}
                    higherIsBetter={false}
                    tooltip="Razão entre palavras de conteúdo e palavras funcionais"
                  />
                )}
                {rich && hasValue(complexity.original as SimplificationMetrics, 'lexicalDiversity') && (
                  <MetricRow
                    label="Diversidade lexical"
                    original={(complexity.original as SimplificationMetrics).lexicalDiversity}
                    simplified={(complexity.simplified as SimplificationMetrics).lexicalDiversity}
                    delta={complexity.delta.lexicalDiversity}
                    tooltip="Proporção de palavras únicas (TTR)"
                  />
                )}
              </tbody>
            </table>
          </div>

          <div className="metrics-analyzer-label">Analisador: {complexity.analyzer}</div>
        </div>
      )}
    </div>
  )
}

function hasValue(metrics: SimplificationMetrics, key: keyof SimplificationMetrics): boolean {
  return typeof metrics[key] === 'number'
}

function MetricRow({
  label,
  original,
  simplified,
  delta,
  badge,
  higherIsBetter,
  tooltip,
}: {
  label: string
  original: number
  simplified: number
  delta?: number
  badge?: { original: string; simplified: string }
  higherIsBetter?: boolean
  tooltip?: string
}) {
  const improved =
    delta !== undefined && higherIsBetter !== undefined ? (higherIsBetter ? delta > 0 : delta < 0) : undefined

  const deltaStr = delta !== undefined ? `${delta > 0 ? '+' : ''}${delta}` : undefined

  return (
    <tr className="metrics-row" title={tooltip}>
      <td className="metrics-row-label">{label}</td>
      <td className="metrics-row-value">
        {original}
        {badge && <span className="metrics-badge metrics-badge-neutral">{badge.original}</span>}
      </td>
      <td className="metrics-row-value">
        {simplified}
        {badge && <span className="metrics-badge metrics-badge-positive">{badge.simplified}</span>}
      </td>
      {delta !== undefined && (
        <td
          className={`metrics-delta ${improved === true ? 'delta-positive' : improved === false ? 'delta-negative' : 'delta-neutral'}`}
        >
          {deltaStr}
        </td>
      )}
    </tr>
  )
}
