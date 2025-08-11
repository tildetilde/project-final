import { useEffect } from "react"

export const useAudio = (url?: string) => {
  useEffect(() => {
    if (!url) return
    const a = new Audio(url)
    const play = async () => {
      try { await a.play() } catch { /* tyst fallback */ }
    }
    play()
    return () => { a.pause(); a.src = "" }
  }, [url])
}
