import { useEffect, useRef } from 'react'
import { useTtsPlayer } from '../hooks/useTtsPlayer'
import type { ChatMessage } from '../types'
import PlayButton from './PlayButton'

interface Props {
  messages: ChatMessage[]
  loading: boolean
}

export default function ChatMessages({ messages, loading }: Props) {
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
            <div className="chat-msg-col">
              <div className="chat-msg-bubble">{msg.content}</div>
              {msg.role === 'assistant' && (
                <div className="chat-msg-actions">
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
            </div>
          </div>
        )
      })}
      {loading && (
        <div className="chat-msg chat-msg-assistant">
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
