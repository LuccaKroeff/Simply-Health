interface Props {
  ttsKey: string
  text: string
  playingKey: string | null
  loadingKey: string | null
  onPlay: (key: string, text: string) => void
  disabled?: boolean
}

function IconSpeaker() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function IconStop() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  )
}

export default function PlayButton({ ttsKey, text, playingKey, loadingKey, onPlay, disabled }: Props) {
  const isPlaying = playingKey === ttsKey
  const isLoading = loadingKey === ttsKey

  return (
    <button
      type="button"
      className={`play-btn${isLoading ? ' loading' : isPlaying ? ' playing' : ''}`}
      onClick={() => onPlay(ttsKey, text)}
      disabled={disabled ?? false}
      title={isPlaying ? 'Parar áudio' : 'Ouvir em voz alta'}
    >
      {isLoading ? <span className="play-spinner" /> : isPlaying ? <IconStop /> : <IconSpeaker />}
    </button>
  )
}
