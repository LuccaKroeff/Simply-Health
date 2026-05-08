import { useRef, useState } from 'react'

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: { results: { [i: number]: { [i: number]: { transcript: string } } } }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start(): void
  stop(): void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

const SR: SpeechRecognitionCtor | undefined =
  (window as unknown as Record<string, unknown>)['SpeechRecognition'] as SpeechRecognitionCtor | undefined ??
  (window as unknown as Record<string, unknown>)['webkitSpeechRecognition'] as SpeechRecognitionCtor | undefined

interface Props {
  onSend: (text: string) => void
  disabled: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleMic() {
    if (recording) {
      recognitionRef.current?.stop()
      return
    }

    const recognition = new SR!()
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = false
    recognitionRef.current = recognition

    recognition.onresult = event => {
      setValue(event.results[0][0].transcript)
    }
    recognition.onend = () => setRecording(false)
    recognition.onerror = () => setRecording(false)

    recognition.start()
    setRecording(true)
  }

  return (
    <div className="chat-input-row">
      {SR && (
        <button
          type="button"
          className={`mic-btn${recording ? ' recording' : ''}`}
          onClick={handleMic}
          disabled={disabled}
          title={recording ? 'Parar gravação' : 'Falar pergunta'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      )}
      <input
        type="text"
        className="chat-input"
        placeholder="Digite sua dúvida sobre este tratamento..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        type="button"
        className="chat-send-btn"
        onClick={handleSend}
        disabled={disabled || value.trim().length === 0}
      >
        Enviar
      </button>
    </div>
  )
}
