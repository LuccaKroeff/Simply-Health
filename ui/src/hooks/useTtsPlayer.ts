import { useRef, useState } from 'react'
import { synthesizeSpeech } from '../api'

export function useTtsPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playingKey, setPlayingKey] = useState<string | null>(null)
  const [loadingKey, setLoadingKey] = useState<string | null>(null)

  async function play(key: string, text: string) {
    if (playingKey === key) {
      audioRef.current?.pause()
      audioRef.current = null
      setPlayingKey(null)
      return
    }

    audioRef.current?.pause()
    audioRef.current = null
    setPlayingKey(null)
    setLoadingKey(key)

    try {
      const base64 = await synthesizeSpeech(text)
      const audio = new Audio(`data:audio/mp3;base64,${base64}`)
      audioRef.current = audio
      setLoadingKey(null)
      setPlayingKey(key)
      audio.play()
      audio.onended = () => {
        setPlayingKey(null)
        audioRef.current = null
      }
    } catch {
      setLoadingKey(null)
    }
  }

  return { play, playingKey, loadingKey }
}
