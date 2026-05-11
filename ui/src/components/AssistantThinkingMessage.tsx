import { useEffect, useState } from 'react'

const STEPS = [
  'Estou analisando o plano de cuidado...',
  'Preparando uma explicação em linguagem simples...',
  'Verificando se a resposta está fiel ao material informado...',
]

export default function AssistantThinkingMessage() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % STEPS.length), 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="chat-msg chat-msg-assistant">
      <div className="msg-side-col">
        <div className="msg-avatar msg-avatar-assistant">
          <img src="/logo.png" alt="SimplyHealth" />
        </div>
      </div>
      <div className="chat-msg-col">
        <div className="thinking-status">{STEPS[step]}</div>
        <div className="chat-msg-bubble typing-indicator">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}
