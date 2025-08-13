export type TrackCard = {
  _id: string
  trackTitle: string
  trackArtist: string
  releaseYear: number
  previewUrl?: string
  imageUrl?: string
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
  | 'WAITING_PLACEMENT'
  | 'CHOICE_AFTER_CORRECT'
  | 'PLACED_WRONG'

export type GameState = {
  deck: TrackCard[]
  discard: TrackCard[]
  teams: [Team, Team]
  currentTeamIndex: 0 | 1
  currentCard?: TrackCard
  roundBaselineTimeline: TrackCard[] // snapshot i början av rundan
  phase: Phase
}
