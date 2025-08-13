import type { TrackCard } from '../types/game'
import { mockBackendTracks } from './spotifyMock'
import { shuffle } from '../lib/shuffle'

export async function fetchTracks(limit = 100): Promise<TrackCard[]> {
  await new Promise(r => setTimeout(r, 150)) // liten delay

  const cards: TrackCard[] = mockBackendTracks.map(t => ({
    // backend-fält
    _id: t._id,
    trackId: t.trackId,
    trackTitle: t.trackTitle,
    trackArtist: t.trackArtist,
    releaseYear: t.releaseYear,
    trackUrl: t.trackUrl,

    // 🔽 alias till vad UI:t faktiskt läser
    title: t.trackTitle,
    artist: t.trackArtist,
    year: t.releaseYear,
    name: t.trackTitle,
  })) as TrackCard[]

  const deck = shuffle(cards)
  return deck.slice(0, Math.min(limit, deck.length))
}
