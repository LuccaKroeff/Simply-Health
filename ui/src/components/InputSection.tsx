import { useState, useRef, type ChangeEvent, type FormEvent } from 'react'
import type { DetailLevel } from '../types'

type Mode = 'text' | 'file'

interface Props {
  withImages: boolean
  onImagesChange: (v: boolean) => void
  detailLevel: DetailLevel
  onDetailLevelChange: (v: DetailLevel) => void
  onSubmit: (input: { text: string } | { file: File }) => void
  onFileAutoSubmit: (file: File, includeImages: boolean) => void
  disabled: boolean
}

const DETAIL_LEVEL_OPTIONS: { value: DetailLevel; label: string }[] = [
  { value: 'short', label: 'Curto' },
  { value: 'medium', label: 'Médio' },
  { value: 'detailed', label: 'Completo' },
]

export default function InputSection({ onImagesChange, detailLevel, onDetailLevelChange, onSubmit, onFileAutoSubmit, disabled }: Props) {
  const [mode, setMode] = useState<Mode>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [pendingPdf, setPendingPdf] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const canSubmit = mode === 'text' ? text.trim().length > 0 : file !== null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (mode === 'text' && text.trim()) onSubmit({ text: text.trim() })
    else if (mode === 'file' && file) {
      if (file.type === 'application/pdf') {
        setPendingPdf(file)
      } else {
        onSubmit({ file })
      }
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    if (!selected) return
    if (selected.type === 'application/pdf') {
      setPendingPdf(selected)
    } else {
      onFileAutoSubmit(selected, false)
    }
  }

  function confirmPdf(includeImages: boolean) {
    onImagesChange(includeImages)
    if (pendingPdf) onFileAutoSubmit(pendingPdf, includeImages)
    setPendingPdf(null)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p className="section-label">Texto médico</p>

        <div className="input-tabs">
          <button
            type="button"
            className={`input-tab${mode === 'text' ? ' active' : ''}`}
            onClick={() => setMode('text')}
            disabled={disabled}
          >
            Texto
          </button>
          <button
            type="button"
            className={`input-tab${mode === 'file' ? ' active' : ''}`}
            onClick={() => setMode('file')}
            disabled={disabled}
          >
            Arquivo (PDF / TXT)
          </button>
        </div>

        {mode === 'text' ? (
          <textarea
            className="text-input"
            placeholder="Cole o texto médico aqui..."
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={disabled}
            rows={6}
          />
        ) : (
          <div className="file-drop" onClick={() => !disabled && fileRef.current?.click()}>
            {file ? (
              <span className="file-name">{file.name}</span>
            ) : (
              <span className="file-placeholder">Clique para selecionar um arquivo PDF ou TXT</span>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={disabled}
            />
          </div>
        )}

        <div className="input-footer">
          <div className="input-options">
            <div className="detail-level-selector">
              <span className="section-label">Detalhamento</span>
              <div className="detail-level-tabs">
                {DETAIL_LEVEL_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`detail-level-tab${detailLevel === opt.value ? ' active' : ''}`}
                    onClick={() => onDetailLevelChange(opt.value)}
                    disabled={disabled}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={disabled || !canSubmit}>
            {disabled ? 'Processando...' : 'Simplificar'}
          </button>
        </div>
      </form>

      {pendingPdf && (
        <div className="modal-overlay" onClick={() => setPendingPdf(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setPendingPdf(null)} aria-label="Fechar">✕</button>
            <div className="modal-icon">🖼️</div>
            <h3 className="modal-title">Incluir imagens do PDF?</h3>
            <p className="modal-body">
              As imagens encontradas serão extraídas e enviadas ao assistente junto com o texto.
              Isso pode aumentar o tempo de processamento.
            </p>
            <div className="modal-actions">
              <button type="button" className="modal-btn modal-btn-secondary" onClick={() => confirmPdf(false)}>
                Só texto
              </button>
              <button type="button" className="modal-btn modal-btn-primary" onClick={() => confirmPdf(true)}>
                Incluir imagens
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
