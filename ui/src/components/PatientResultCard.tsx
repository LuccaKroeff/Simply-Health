import type { PatientResult, Question } from '../types'
import { findPatient } from '../data/patients'
import AssistantThinkingMessage from './AssistantThinkingMessage'
import SummaryCard from './SummaryCard'
import SuggestedQuestions from './SuggestedQuestions'

interface Props {
  patientId: string
  result: PatientResult
  chatActive: boolean
  chatLoading: boolean
  showChatButton: boolean
  onSelectQuestion: (q: Question) => void
  onActivateChat: () => void
}

export default function PatientResultCard({
  patientId,
  result,
  chatActive,
  chatLoading,
  showChatButton,
  onSelectQuestion,
  onActivateChat,
}: Props) {
  const patient = findPatient(patientId)
  if (!patient) return null

  return (
    <div className={`patient-result-card${chatActive ? ' chat-active' : ''}`}>
      <div className="patient-result-header">
        <div className="patient-result-avatar">
          <img src={patient.avatar} alt={patient.name} />
        </div>
        <div className="patient-result-info">
          <strong>{patient.name}</strong>
          <span>{patient.age} anos · {patient.educationLabel}</span>
          <span className={`patient-badge literacy-${patient.literacyLevel}`}>{patient.literacyLabel}</span>
        </div>
        <StatusBadge status={result.status} />
      </div>

      <div className="patient-result-body">
        {result.status === 'processing' && <AssistantThinkingMessage />}

        {result.status === 'error' && (
          <div className="error-banner" style={{ margin: '1rem' }}>{result.error}</div>
        )}

        {result.status === 'approved' && result.simplifyResult && (
          <>
            <SummaryCard result={result.simplifyResult} />
            <div className="patient-result-questions">
              <SuggestedQuestions
                questions={result.questions}
                onSelect={onSelectQuestion}
                disabled={chatLoading}
              />
            </div>
          </>
        )}
      </div>

      {showChatButton && result.status === 'approved' && (
        <div className="patient-result-footer">
          <button
            type="button"
            className={`patient-chat-btn${chatActive ? ' active' : ''}`}
            onClick={onActivateChat}
          >
            {chatActive ? '💬 Chat ativo' : 'Perguntar para este paciente'}
          </button>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: PatientResult['status'] }) {
  if (status === 'processing') return <span className="status-badge status-processing">Processando…</span>
  if (status === 'approved')   return <span className="status-badge status-approved">✓ Validado</span>
  return <span className="status-badge status-error">Erro</span>
}
