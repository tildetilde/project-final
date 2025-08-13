import type { TrackCard } from '../types/game';

export interface BackendTrack {
  _id: string;
  trackId: string;
  trackTitle: string;
  trackArtist: string;
  releaseYear: number;
  trackUrl: string;
  __v?: number;
  // ev. framtida fält: previewUrl?: string; imgUrl?: string;
}

// Mappa backend -> ditt UI-format (TrackCard från types/game.ts)
export function toTrackCard(t: BackendTrack): TrackCard {
  return {
    _id: t._id,
    trackId: t.trackId,
    trackTitle: t.trackTitle,
    trackArtist: t.trackArtist,
    releaseYear: t.releaseYear,
    trackUrl: t.trackUrl,
    // Om TrackCard i game.ts har fler valfria fält (previewUrl/imgUrl etc), lägg dem här:
    // previewUrl: (t as any).previewUrl ?? null,
    // imgUrl: (t as any).imgUrl ?? null,
  };
}