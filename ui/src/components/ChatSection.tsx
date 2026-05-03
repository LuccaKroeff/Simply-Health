import ReactMarkdown from 'react-markdown'
import type { SimplifyResponse, QuestionsResponse, Question, ExtractedImage } from '../types'

export type Status = 'simplifying' | 'asking' | 'done' | 'error'

interface Props {
  status: Status
  simplify: SimplifyResponse | null
  questions: QuestionsResponse | null
  error: string | null
}

export default function ChatSection({ status, simplify, questions, error }: Props) {
  return (
    <div className="chat-section">
      {status === 'simplifying' && (
        <div className="loading-row">
          <span className="spinner" />
          <span>Simplificando texto...</span>
        </div>
      )}

      {simplify && (
        <div className="chat-bubble">
          <div className="chat-bubble-header">
            <span className="bubble-tag">Texto simplificado</span>
            <span className="bubble-meta">
              {simplify.metadata.model} &middot; {simplify.metadata.processingTimeMs}ms
              {simplify.metadata.imagesFound === 0 && simplify.images === undefined
                ? ' · nenhuma imagem extraível no PDF'
                : simplify.metadata.imagesFound > 0
                  ? ` · ${simplify.metadata.imagesFound} imagem(ns) encontrada(s)`
                  : null}
            </span>
          </div>
          <div className="bubble-text">{renderTextWithImages(simplify.simplifiedText, simplify.images ?? [])}</div>

          {simplify.glossary && simplify.glossary.length > 0 && (
            <div className="glossary">
              <p className="glossary-title">Glossário</p>
              {simplify.glossary.map(g => (
                <div key={g.term} className="glossary-item">
                  <strong>{g.term}:</strong> {g.definition}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {status === 'asking' && (
        <div className="loading-row">
          <span className="spinner" />
          <span>Gerando perguntas...</span>
        </div>
      )}

      {questions && (
        <div className="questions-section">
          <p className="section-label">Perguntas frequentes</p>
          {questions.questions.map((q, i) => (
            <QuestionCard key={i} index={i + 1} question={q} />
          ))}
        </div>
      )}

      {error && (
        <div className="error-banner">
          <strong>Erro:</strong> {error}
        </div>
      )}
    </div>
  )
}

function renderTextWithImages(text: string, images: ExtractedImage[]) {
  let processed = text
  images.forEach(img => {
    processed = processed.split(`[${img.id}]`).join(`![${img.id}](data:${img.mimeType};base64,${img.data})`)
  })

  return (
    <ReactMarkdown
      urlTransform={url => url}
      components={{
        img: ({ src, alt }) => (
          <div className="inline-image-wrapper">
            <img src={src} alt={alt ?? ''} className="inline-image" />
          </div>
        ),
      }}
    >
      {processed}
    </ReactMarkdown>
  )
}

function QuestionCard({ index, question }: { index: number; question: Question }) {
  return (
    <details className="question-card">
      <summary className="question-summary">
        <span className="question-num">{index}</span>
        <span className="question-text">{question.question}</span>
      </summary>
      <div className="question-answer">{question.answer}</div>
    </details>
  )
}
