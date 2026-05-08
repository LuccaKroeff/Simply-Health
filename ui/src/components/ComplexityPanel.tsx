import { useState } from 'react'
import type { ComplexityComparison } from '../types'

interface Props {
  complexity: ComplexityComparison
}

export default function ComplexityPanel({ complexity }: Props) {
  const [open, setOpen] = useState(false)
  const { original, simplified, fleschGain, wordsPerSentenceReduction } = complexity

  return (
    <div className="complexity-panel">
      <button type="button" className="complexity-toggle" onClick={() => setOpen(o => !o)}>
        <span>Ver comparação de legibilidade</span>
        <span className="complexity-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="complexity-body">
          <div className="complexity-disclaimer">
            Estas métricas avaliam aspectos linguísticos do texto (comprimento de frases, sílabas) e não substituem avaliação de precisão médica.
          </div>

          <div className="complexity-grid">
            <div className="complexity-col">
              <div className="complexity-col-label">Texto original</div>
              <MetricRow label="Flesch-PT" value={original.fleschScore} suffix="" badge={original.fleschLabel} badgeKind="neutral" />
              <MetricRow label="Palavras/frase" value={original.avgWordsPerSentence} suffix="" />
              <MetricRow label="Palavras" value={original.wordCount} suffix="" />
              <MetricRow label="Frases" value={original.sentenceCount} suffix="" />
            </div>

            <div className="complexity-divider" />

            <div className="complexity-col">
              <div className="complexity-col-label">Texto simplificado</div>
              <MetricRow label="Flesch-PT" value={simplified.fleschScore} suffix="" badge={simplified.fleschLabel} badgeKind="positive" />
              <MetricRow label="Palavras/frase" value={simplified.avgWordsPerSentence} suffix="" />
              <MetricRow label="Palavras" value={simplified.wordCount} suffix="" />
              <MetricRow label="Frases" value={simplified.sentenceCount} suffix="" />
            </div>
          </div>

          <div className="complexity-gains">
            <GainChip
              label="Ganho Flesch"
              value={fleschGain}
              positive={fleschGain > 0}
              format={v => (v > 0 ? `+${v}` : String(v))}
            />
            <GainChip
              label="Redução palavras/frase"
              value={wordsPerSentenceReduction}
              positive={wordsPerSentenceReduction > 0}
              format={v => (v > 0 ? `−${v}` : String(v))}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function MetricRow({ label, value, suffix, badge, badgeKind }: {
  label: string
  value: number
  suffix: string
  badge?: string
  badgeKind?: 'neutral' | 'positive'
}) {
  return (
    <div className="metric-row">
      <span className="metric-label">{label}</span>
      <span className="metric-value">
        {value}{suffix}
        {badge && <span className={`metric-badge metric-badge-${badgeKind ?? 'neutral'}`}>{badge}</span>}
      </span>
    </div>
  )
}

function GainChip({ label, value, positive, format }: {
  label: string
  value: number
  positive: boolean
  format: (v: number) => string
}) {
  return (
    <div className={`gain-chip ${positive ? 'gain-positive' : 'gain-neutral'}`}>
      <span className="gain-label">{label}</span>
      <span className="gain-value">{format(value)}</span>
    </div>
  )
}
