import { useRef, useState } from 'react'
import { transcribeAudio } from '../api'

interface Props {
  onSend: (text: string) => void
  disabled: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

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

  async function handleMic() {
    if (recording) {
      mediaRecorderRef.current?.stop()
      return
    }

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      return
    }

    const mr = new MediaRecorder(stream)
    mediaRecorderRef.current = mr
    chunksRef.current = []

    mr.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mr.onstop = async () => {
      stream.getTracks().forEach(t => t.stop())
      setRecording(false)
      setTranscribing(true)
      try {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
        const text = await transcribeAudio(blob)
        if (text) setValue(text)
      } catch {
        // silently ignore transcription failures
      } finally {
        setTranscribing(false)
      }
    }

    mr.start()
    setRecording(true)
  }

  const micBusy = recording || transcribing

  return (
    <div className="chat-input-row">
      <button
        type="button"
        className={`mic-btn${recording ? ' recording' : transcribing ? ' transcribing' : ''}`}
        onClick={handleMic}
        disabled={disabled || transcribing}
        title={recording ? 'Parar gravação' : transcribing ? 'Transcrevendo...' : 'Falar pergunta'}
      >
        {transcribing ? (
          <span className="mic-spinner" />
        ) : (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </button>
      <input
        type="text"
        className="chat-input"
        placeholder="Digite sua dúvida sobre este tratamento..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || micBusy}
      />
      <button
        type="button"
        className="chat-send-btn"
        onClick={handleSend}
        disabled={disabled || micBusy || value.trim().length === 0}
      >
        Enviar
      </button>
    </div>
  )
}
