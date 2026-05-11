import { useState, useRef, type ChangeEvent, type FormEvent } from 'react'

type Mode = 'text' | 'file'

interface Props {
  withImages: boolean
  onImagesChange: (v: boolean) => void
  onSubmit: (input: { text: string } | { file: File }) => void
  onFileAutoSubmit: (file: File) => void
  disabled: boolean
}

export default function InputSection({ withImages, onImagesChange, onSubmit, onFileAutoSubmit, disabled }: Props) {
  const [mode, setMode] = useState<Mode>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const canSubmit = mode === 'text' ? text.trim().length > 0 : file !== null
  const isPdf = mode === 'file' && file?.type === 'application/pdf'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (mode === 'text' && text.trim()) onSubmit({ text: text.trim() })
    else if (mode === 'file' && file) onSubmit({ file })
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    if (selected) onFileAutoSubmit(selected)
  }

  return (
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
          {isPdf && (
            <label className="glossary-toggle">
              <input
                type="checkbox"
                checked={withImages}
                onChange={e => onImagesChange(e.target.checked)}
                disabled={disabled}
              />
              Incluir imagens
            </label>
          )}
        </div>
        <button type="submit" className="submit-btn" disabled={disabled || !canSubmit}>
          {disabled ? 'Processando...' : 'Simplificar'}
        </button>
      </div>
    </form>
  )
}
