interface Props {
  ttsKey: string
  text: string
  playingKey: string | null
  loadingKey: string | null
  onPlay: (key: string, text: string) => void
  disabled?: boolean
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
      title={isPlaying ? 'Parar' : 'Ouvir'}
    >
      {isLoading ? <span className="play-spinner" /> : isPlaying ? '■' : '▶'}
    </button>
  )
}
