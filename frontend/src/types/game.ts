export type TrackCard = {
  _id: string
  trackTitle: string
  trackArtist: string
  releaseYear: number
  previewUrl?: string
  imageUrl?: string
  isStart?: boolean
}

export type Team = {
  id: 'A' | 'B'
  name: string
  timeline: TrackCard[]
  score: number
}

export type Phase =
  | 'SETUP'
  | 'TURN_START'
  | 'DRAWN'
  | 'PLACED_PENDING' 
  | 'WAITING_PLACEMENT'
  | 'CHOICE_AFTER_CORRECT'
  | 'PLACED_WRONG'

export type GameState = {
  deck: TrackCard[]
  discard: TrackCard[]
  teams: Team []
  currentTeamIndex: 0 | 1
  currentCard?: TrackCard
  roundBaselineTimeline: TrackCard[];pendingIndex: number | null;
  lastPlacementCorrect: boolean | null;

  phase: Phase;
}
