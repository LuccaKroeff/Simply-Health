import { useState } from 'react'
import type { SimplifyResponse, QuestionsResponse } from './types'
import { simplifyText, generateQuestions } from './api'
import PatientSelector from './components/PatientSelector'
import InputSection from './components/InputSection'
import ChatSection, { type Status } from './components/ChatSection'
import './index.css'

export default function App() {
  const [patientId, setPatientId] = useState('patient-1')
  const [withImages, setWithImages] = useState(false)

  const [status, setStatus] = useState<Status | null>(null)
  const [simplify, setSimplify] = useState<SimplifyResponse | null>(null)
  const [questions, setQuestions] = useState<QuestionsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const busy = status === 'simplifying' || status === 'asking'

  async function handleSubmit(input: { text: string } | { file: File }) {
    setStatus('simplifying')
    setSimplify(null)
    setQuestions(null)
    setError(null)

    try {
      const simplifyRes = await simplifyText(input, patientId, true, withImages)
      setSimplify(simplifyRes)
      setStatus('asking')

      const questionsRes = await generateQuestions(simplifyRes.simplifiedText, patientId)
      setQuestions(questionsRes)
      setStatus('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado')
      setStatus('error')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <span className="app-title">SimplyHealth</span>
          <span className="app-subtitle">Simplificação de textos médicos</span>
        </div>
      </header>

      <main className="container app-main">
        <div className="panel">
          <PatientSelector value={patientId} onChange={setPatientId} disabled={busy} />
          <InputSection
            withImages={withImages}
            onImagesChange={setWithImages}
            onSubmit={handleSubmit}
            disabled={busy}
          />
        </div>

        {status && <ChatSection status={status} simplify={simplify} questions={questions} error={error} />}
      </main>
    </div>
  )
}
