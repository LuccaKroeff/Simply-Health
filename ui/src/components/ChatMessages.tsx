import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useTtsPlayer } from '../hooks/useTtsPlayer'
import type { ChatMessage } from '../types'
import PlayButton from './PlayButton'

interface Props {
  messages: ChatMessage[]
  loading: boolean
  patientAvatar: string
  patientName: string
}

export default function ChatMessages({ messages, loading, patientAvatar, patientName }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { play, playingKey, loadingKey } = useTtsPlayer()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) return null

  return (
    <div className="chat-messages">
      {messages.map((msg, i) => {
        const key = String(i)
        return (
          <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="msg-side-col">
                <div className="msg-avatar msg-avatar-assistant">
                  <img src="/logo.png" alt="SimplyHealth" />
                </div>
                <PlayButton
                  ttsKey={key}
                  text={msg.content}
                  playingKey={playingKey}
                  loadingKey={loadingKey}
                  onPlay={play}
                  disabled={loadingKey !== null && loadingKey !== key}
                />
              </div>
            )}
            <div className="chat-msg-col">
              <div className="chat-msg-bubble">
                {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="msg-avatar msg-avatar-user">
                <img src={patientAvatar} alt={patientName} />
              </div>
            )}
          </div>
        )
      })}
      {loading && (
        <div className="chat-msg chat-msg-assistant">
          <div className="msg-side-col">
            <div className="msg-avatar msg-avatar-assistant">
              <img src="/logo.png" alt="SimplyHealth" />
            </div>
          </div>
          <div className="chat-msg-bubble typing-indicator">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
