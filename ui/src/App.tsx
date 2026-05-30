import { useCallback, useMemo, useRef, useState } from 'react'
import type { PatientResult, Question, ChatMessage, DetailLevel } from './types'
import { simplifyText, generateQuestions, chatQuestion } from './api'
import { findPatient } from './data/patients'
import PatientSelector from './components/PatientSelector'
import InputSection from './components/InputSection'
import PatientResultCard from './components/PatientResultCard'
import ChatMessages from './components/ChatMessages'
import ChatInput from './components/ChatInput'
import './index.css'

type Phase = 'initial' | 'chat'
type Tab = 'chat' | 'original'

export default function App() {
  const [phase, setPhase] = useState<Phase>('initial')
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>(['patient-1'])
  const [withImages, setWithImages] = useState(false)
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('medium')
  const [activeTab, setActiveTab] = useState<Tab>('chat')

  const [patientResults, setPatientResults] = useState<Record<string, PatientResult>>({})
  const [patientChats, setPatientChats] = useState<Record<string, ChatMessage[]>>({})
  const [activeChatPatientId, setActiveChatPatientId] = useState<string | null>(null)
  const [chatLoading, setChatLoading] = useState(false)

  const [fileError, setFileError] = useState<string | null>(null)
  const [originalPdfUrl, setOriginalPdfUrl] = useState<string | null>(null)
  const [lastInput, setLastInput] = useState<{ text: string } | { file: File } | null>(null)

  const genRef = useRef(0)

  // ── Computed ──────────────────────────────────────────────────────────────
  const isProcessing = useMemo(
    () => Object.values(patientResults).some(r => r.status === 'processing'),
    [patientResults],
  )
  const anyResult = useMemo(
    () => Object.values(patientResults).find(r => r.simplifyResult)?.simplifyResult ?? null,
    [patientResults],
  )

  // ── Processing ────────────────────────────────────────────────────────────
  async function handleUnderstand(input: { text: string } | { file: File }, includeImagesOverride?: boolean) {
    const genId = ++genRef.current
    setFileError(null)
    setLastInput(input)

    if ('file' in input) {
      setOriginalPdfUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return input.file.type === 'application/pdf' ? URL.createObjectURL(input.file) : null
      })
    } else {
      setOriginalPdfUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
    }

    const initial: Record<string, PatientResult> = {}
    for (const id of selectedPatientIds) {
      initial[id] = { status: 'processing', simplifyResult: null, questions: null, questionsError: false, error: null }
    }
    setPatientResults(initial)
    setPatientChats({})
    setActiveChatPatientId(selectedPatientIds[0])
    setActiveTab('chat')
    setPhase('chat')

    const effectiveIncludeImages = includeImagesOverride ?? withImages
    await Promise.all(selectedPatientIds.map(id => processOnePatient(id, input, genId, effectiveIncludeImages)))
  }

  async function processOnePatient(
    patientId: string,
    input: { text: string } | { file: File },
    genId: number,
    includeImages: boolean,
  ) {
    try {
      const result = await simplifyText(input, patientId, true, includeImages, detailLevel)
      if (genRef.current !== genId) return

      setPatientResults(prev => ({
        ...prev,
        [patientId]: { status: 'approved', simplifyResult: result, questions: null, error: null },
      }))

      generateQuestions(result.originalText, patientId)
        .then(qRes => {
          if (genRef.current !== genId) return
          setPatientResults(prev => ({
            ...prev,
            [patientId]: { ...prev[patientId], questions: qRes.questions, questionsError: false },
          }))
        })
        .catch(() => {
          if (genRef.current !== genId) return
          setPatientResults(prev => ({
            ...prev,
            [patientId]: { ...prev[patientId], questions: null, questionsError: true },
          }))
        })
    } catch (e) {
      if (genRef.current !== genId) return
      const msg = e instanceof Error ? e.message : ''
      const isFileError = /ler|pdf|txt|arquivo|file/i.test(msg)
      if (isFileError) {
        setFileError('Não foi possível ler este arquivo. Tente enviar um PDF ou TXT válido.')
        setPatientResults(prev => ({
          ...prev,
          [patientId]: { status: 'error', simplifyResult: null, questions: null, error: null },
        }))
      } else {
        setPatientResults(prev => ({
          ...prev,
          [patientId]: {
            status: 'error',
            simplifyResult: null,
            questions: null,
            error: 'Não foi possível gerar uma explicação com base no conteúdo informado.',
          },
        }))
      }
    }
  }

  async function handleRetry(patientId: string) {
    if (!lastInput) return
    const genId = genRef.current
    setPatientResults(prev => ({
      ...prev,
      [patientId]: { status: 'processing', simplifyResult: null, questions: null, questionsError: false, error: null },
    }))
    await processOnePatient(patientId, lastInput, genId, withImages)
  }

  async function handleRetryQuestions(patientId: string) {
    const result = patientResults[patientId]?.simplifyResult
    if (!result) return
    setPatientResults(prev => ({
      ...prev,
      [patientId]: { ...prev[patientId], questions: null, questionsError: false },
    }))
    generateQuestions(result.originalText, patientId)
      .then(qRes =>
        setPatientResults(prev => ({
          ...prev,
          [patientId]: { ...prev[patientId], questions: qRes.questions, questionsError: false },
        })),
      )
      .catch(() =>
        setPatientResults(prev => ({
          ...prev,
          [patientId]: { ...prev[patientId], questions: null, questionsError: true },
        })),
      )
  }

  // ── Chat ──────────────────────────────────────────────────────────────────
  function handleSuggestedQuestion(patientId: string, q: Question) {
    setPatientResults(prev => ({
      ...prev,
      [patientId]: {
        ...prev[patientId],
        questions: prev[patientId].questions?.filter(item => item.question !== q.question) ?? null,
      },
    }))
    setPatientChats(prev => ({
      ...prev,
      [patientId]: [
        ...(prev[patientId] ?? []),
        { role: 'user', content: q.question },
        { role: 'assistant', content: q.answer },
      ],
    }))
    setActiveChatPatientId(patientId)
  }

  async function handleSendQuestion(question: string) {
    if (!activeChatPatientId) return
    const activeResult = patientResults[activeChatPatientId]
    if (!activeResult?.simplifyResult) return

    setPatientChats(prev => ({
      ...prev,
      [activeChatPatientId]: [...(prev[activeChatPatientId] ?? []), { role: 'user', content: question }],
    }))
    setChatLoading(true)

    try {
      const history = patientChats[activeChatPatientId] ?? []
      const res = await chatQuestion(question, activeResult.simplifyResult.originalText, activeChatPatientId, history)
      setPatientChats(prev => ({
        ...prev,
        [activeChatPatientId]: [...(prev[activeChatPatientId] ?? []), { role: 'assistant', content: res.answer }],
      }))
    } catch {
      setPatientChats(prev => ({
        ...prev,
        [activeChatPatientId]: [
          ...(prev[activeChatPatientId] ?? []),
          { role: 'assistant', content: 'Não foi possível processar sua pergunta. Tente novamente.' },
        ],
      }))
    } finally {
      setChatLoading(false)
    }
  }

  const handleReset = useCallback(function handleReset() {
    genRef.current++
    setPhase('initial')
    setPatientResults({})
    setPatientChats({})
    setActiveChatPatientId(null)
    setChatLoading(false)
    setFileError(null)
    setActiveTab('chat')
    setOriginalPdfUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  const multiPatient = selectedPatientIds.length > 1

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="app-brand">
            <img src="/logo.png" alt="SimplyHealth" className="app-icon" />
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
            <PatientSelector value={selectedPatientIds} onChange={setSelectedPatientIds} disabled={isProcessing} />
            <InputSection
              withImages={withImages}
              onImagesChange={setWithImages}
              detailLevel={detailLevel}
              onDetailLevelChange={setDetailLevel}
              onSubmit={handleUnderstand}
              onFileAutoSubmit={(file, includeImages) => handleUnderstand({ file }, includeImages)}
              disabled={isProcessing || selectedPatientIds.length === 0}
            />
            {fileError && (
              <div className="error-banner">
                <strong>Erro:</strong> {fileError}
              </div>
            )}
          </div>
        )}

        {phase === 'chat' && (
          <>
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="chat-phase-header">
              <button type="button" className="reset-btn" onClick={handleReset}>
                ← Novo texto
              </button>
              <div className="chat-header-patients">
                {selectedPatientIds.map(id => {
                  const p = findPatient(id)
                  if (!p) return null
                  return (
                    <div key={id} className="chat-patient-pill">
                      <div className="chat-patient-avatar">
                        <img src={p.avatar} alt={p.name} />
                      </div>
                      <div className="chat-patient-info">
                        <span className="chat-patient-name">{p.name}</span>
                        <span className="chat-patient-meta">
                          {p.age} anos · {p.educationLabel}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {fileError && (
              <div className="error-banner">
                <strong>Erro:</strong> {fileError}
              </div>
            )}

            {/* ── Tabs ───────────────────────────────────────────────── */}
            <div className="chat-tabs">
              <button
                type="button"
                className={`chat-tab${activeTab === 'chat' ? ' active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                Conversa
              </button>
              <button
                type="button"
                className={`chat-tab${activeTab === 'original' ? ' active' : ''}`}
                onClick={() => setActiveTab('original')}
                disabled={!anyResult}
              >
                Material original
              </button>
            </div>

            {/* ── Conversa tab ───────────────────────────────────────── */}
            {activeTab === 'chat' && (
              <>
                {/* Comparison grid */}
                <div className={`comparison-grid grid-${selectedPatientIds.length}`}>
                  {selectedPatientIds.map(id => (
                    <PatientResultCard
                      key={id}
                      patientId={id}
                      result={
                        patientResults[id] ?? {
                          status: 'processing',
                          simplifyResult: null,
                          questions: null,
                          error: null,
                        }
                      }
                      chatActive={activeChatPatientId === id}
                      chatLoading={chatLoading}
                      showChatButton={multiPatient}
                      onSelectQuestion={q => handleSuggestedQuestion(id, q)}
                      onActivateChat={() => setActiveChatPatientId(id)}
                      onRetry={() => handleRetry(id)}
                      onRetryQuestions={() => handleRetryQuestions(id)}
                    />
                  ))}
                </div>

                {/* Chat section */}
                {activeChatPatientId && patientResults[activeChatPatientId]?.status === 'approved' && (
                  <>
                    {multiPatient && (
                      <div className="chat-patient-switcher">
                        {selectedPatientIds
                          .filter(id => patientResults[id]?.status === 'approved')
                          .map(id => {
                            const p = findPatient(id)!
                            return (
                              <button
                                key={id}
                                type="button"
                                className={`chat-switch-btn${activeChatPatientId === id ? ' active' : ''}`}
                                onClick={() => setActiveChatPatientId(id)}
                              >
                                <img src={p.avatar} alt={p.name} />
                                <span>{p.name}</span>
                              </button>
                            )
                          })}
                      </div>
                    )}

                    <div className="chat-card">
                      <ChatMessages
                        messages={patientChats[activeChatPatientId] ?? []}
                        loading={chatLoading}
                        patientAvatar={findPatient(activeChatPatientId)?.avatar ?? ''}
                        patientName={findPatient(activeChatPatientId)?.name ?? ''}
                      />
                      <div className="chat-card-footer">
                        <ChatInput onSend={handleSendQuestion} disabled={chatLoading} />
                        <p className="disclaimer">
                          As respostas são baseadas apenas no material informado e não substituem orientação
                          profissional de saúde.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── Material original tab ──────────────────────────────── */}
            {activeTab === 'original' && anyResult && (
              <div className="original-material-card">
                <div className="original-material-header">Material de referência</div>
                {originalPdfUrl ? (
                  <embed src={originalPdfUrl} type="application/pdf" className="original-pdf-embed" />
                ) : (
                  <div className="original-material-text">
                    {anyResult.originalText
                      .split(/\n{2,}/)
                      .filter(p => p.trim().length > 0)
                      .map((p, i) => (
                        <p key={i}>{p.trim()}</p>
                      ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
