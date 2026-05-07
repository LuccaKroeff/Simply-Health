import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types'

interface Props {
  messages: ChatMessage[]
  loading: boolean
}

export default function ChatMessages({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) return null

  return (
    <div className="chat-messages">
      {messages.map((msg, i) => (
        <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
          <div className="chat-msg-bubble">{msg.content}</div>
        </div>
      ))}
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
