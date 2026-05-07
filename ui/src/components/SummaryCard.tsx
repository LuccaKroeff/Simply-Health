import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useTtsPlayer } from '../hooks/useTtsPlayer'
import type { SimplifyResponse, ExtractedImage } from '../types'
import PlayButton from './PlayButton'

interface Props {
  result: SimplifyResponse
}

export default function SummaryCard({ result }: Props) {
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const { play, playingKey, loadingKey } = useTtsPlayer()

  return (
    <div className="chat-bubble">
      <div className="chat-bubble-header">
        <span className="bubble-tag">Resumo em linguagem simples</span>
        <span className="bubble-meta">
          {result.metadata.model} &middot; {result.metadata.processingTimeMs}ms
          {result.metadata.imagesFound > 0
            ? ` · ${result.metadata.imagesFound} imagem(ns)`
            : result.metadata.imagesFound === 0 && result.images === undefined
              ? ' · nenhuma imagem extraível no PDF'
              : null}
        </span>
      </div>

      <div className="bubble-text">{renderTextWithImages(result.simplifiedText, result.images ?? [])}</div>

      <div className="summary-actions">
        <PlayButton
          ttsKey="summary"
          text={result.simplifiedText}
          playingKey={playingKey}
          loadingKey={loadingKey}
          onPlay={play}
        />
      </div>

      {result.glossary && result.glossary.length > 0 && (
        <div className="glossary">
          <button type="button" className="glossary-toggle-btn" onClick={() => setGlossaryOpen(o => !o)}>
            <span className="glossary-title">Glossário</span>
            <span className="glossary-chevron">{glossaryOpen ? '▲' : '▼'}</span>
          </button>
          {glossaryOpen && (
            <div className="glossary-items">
              {result.glossary.map(g => (
                <div key={g.term} className="glossary-item">
                  <strong>{g.term}:</strong> {g.definition}
                </div>
              ))}
            </div>
          )}
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
