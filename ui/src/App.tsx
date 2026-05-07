import { useState } from 'react'
import type { SimplifyResponse, Question, ChatMessage } from './types'
import { simplifyText, generateQuestions, chatQuestion } from './api'
import PatientSelector from './components/PatientSelector'
import InputSection from './components/InputSection'
import SummaryCard from './components/SummaryCard'
import SuggestedQuestions from './components/SuggestedQuestions'
import ChatMessages from './components/ChatMessages'
import ChatInput from './components/ChatInput'
import './index.css'

type Phase = 'initial' | 'chat'

export default function App() {
  const [phase, setPhase] = useState<Phase>('initial')
  const [patientId, setPatientId] = useState('patient-1')
  const [withImages, setWithImages] = useState(false)

  const [simplifyLoading, setSimplifyLoading] = useState(false)
  const [simplifyError, setSimplifyError] = useState<string | null>(null)

  const [simplifyResult, setSimplifyResult] = useState<SimplifyResponse | null>(null)
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatLoading, setChatLoading] = useState(false)

  async function handleUnderstand(input: { text: string } | { file: File }) {
    setSimplifyLoading(true)
    setSimplifyError(null)

    try {
      const result = await simplifyText(input, patientId, true, withImages)
      setSimplifyResult(result)
      setQuestions(null)
      setChatMessages([])
      setPhase('chat')

      generateQuestions(result.originalText, patientId)
        .then(qRes => setQuestions(qRes.questions))
        .catch(() => setQuestions([]))
    } catch (e) {
      setSimplifyError(e instanceof Error ? e.message : 'Erro inesperado')
    } finally {
      setSimplifyLoading(false)
    }
  }

  function handleSuggestedQuestion(q: Question) {
    setQuestions(prev => prev?.filter(item => item.question !== q.question) ?? prev)
    setChatMessages(prev => [...prev, { role: 'user', content: q.question }, { role: 'assistant', content: q.answer }])
  }

  async function handleSendQuestion(question: string) {
    const userMsg: ChatMessage = { role: 'user', content: question }
    setChatMessages(prev => [...prev, userMsg])
    setChatLoading(true)

    try {
      const res = await chatQuestion(question, simplifyResult!.originalText, patientId, chatMessages)
      setChatMessages(prev => [...prev, { role: 'assistant', content: res.answer }])
    } catch {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Não foi possível processar sua pergunta. Tente novamente.' },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  function handleReset() {
    setPhase('initial')
    setSimplifyResult(null)
    setQuestions(null)
    setChatMessages([])
    setChatLoading(false)
    setSimplifyError(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="app-brand">
            <span className="app-icon">🏥</span>
            <div>
              <div className="app-title">SimplyHealth</div>
              <div className="app-subtitle">Simplificação de textos médicos</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container app-main">
        {phase === 'initial' && (
          <div className="panel">
            <PatientSelector value={patientId} onChange={setPatientId} disabled={simplifyLoading} />
            <InputSection
              withImages={withImages}
              onImagesChange={setWithImages}
              onSubmit={handleUnderstand}
              disabled={simplifyLoading}
            />
            {simplifyError && (
              <div className="error-banner">
                <strong>Erro:</strong> {simplifyError}
              </div>
            )}
          </div>
        )}

        {phase === 'chat' && simplifyResult && (
          <>
            <div className="chat-phase-header">
              <button type="button" className="reset-btn" onClick={handleReset}>
                ← Novo texto
              </button>
              <span className="chat-phase-label">Assistente de compreensão do tratamento</span>
            </div>

            <SummaryCard result={simplifyResult} />

            <SuggestedQuestions questions={questions} onSelect={handleSuggestedQuestion} disabled={chatLoading} />

            <ChatMessages messages={chatMessages} loading={chatLoading} />

            <ChatInput onSend={handleSendQuestion} disabled={chatLoading} />

            <p className="disclaimer">
              As respostas são baseadas apenas no material informado e não substituem orientação profissional de saúde.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
