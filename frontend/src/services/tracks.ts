import { TrackCard } from '@/types/game'
import { mockTracks } from './spotifyMock'

// om du redan har src/shuffle.ts – använd den
const shuffle = <T,>(a: T[]) => {
  const arr = a.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export async function fetchTracks(limit = 100): Promise<TrackCard[]> {
  await new Promise(r => setTimeout(r, 150)) // liten delay för “laddar”-känsla
  return shuffle(mockTracks).slice(0, Math.min(limit, mockTracks.length))
}
