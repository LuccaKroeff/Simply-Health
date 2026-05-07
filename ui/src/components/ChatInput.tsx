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
          🎤
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
