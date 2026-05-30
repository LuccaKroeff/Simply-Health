import { useEffect, useRef, useState } from 'react'
import { synthesizeSpeech } from '../api'
import { stripMarkdown } from '../utils/stripMarkdown'

// Cache de sessão: o áudio já sintetizado fica aqui até a página fechar
const audioCache = new Map<string, string>()

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

    const cleanText = stripMarkdown(text)
    const cached = audioCache.get(cleanText)

    if (!cached) setLoadingKey(key)

    try {
      const base64 = cached ?? (await synthesizeSpeech(cleanText))
      if (!cached) audioCache.set(cleanText, base64)

      const audio = new Audio(`data:audio/wav;base64,${base64}`)
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

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  return { play, playingKey, loadingKey }
}
