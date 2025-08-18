export type GameItem = {
  id: string; // stable ID, ex. "animal-1" / "music-1"
  name: string; // ex. "Blue Whale" / "Elvis Presley"
  label?: string; // ex. "Weight 150000 kg" / "Jailhouse Rock"
  value: number; // ex. 150000 / 1958
  unit?: string; // ex. "kg" / "year"
  categoryId: string; // "animals.weight" / "music.releaseYear"
  source?: { name: string; url?: string };
  meta?: Record<string, unknown>;
};

export type GameCategory = {
  id: string;
  question: string; // "Which animal weighs the most?"
  unit: string;
  source?: { name: string; url?: string };
};

export type TrackCard = {
  _id: string;
  trackTitle: string;
  trackArtist: string;
  trackId: string;
  releaseYear: number;
  previewUrl?: string;
  imageUrl?: string;
  isStart?: boolean;
};

export type Team = {
  id: "A" | "B";
  name: string;
  timeline: TrackCard[];
  score: number;
};

export type Phase =
  | "SETUP"
  | "TURN_START"
  | "DRAWN"
  | "PLACED_PENDING"
  | "WAITING_PLACEMENT"
  | "CHOICE_AFTER_CORRECT"
  | "PLACED_WRONG";

export type GameState = {
  deck: TrackCard[];
  discard: TrackCard[];
  teams: Team[];
  currentTeamIndex: 0 | 1;
  currentCard?: TrackCard;
  roundBaselineTimeline: TrackCard[];
  pendingIndex: number | null;
  lastPlacementCorrect: boolean | null;

  phase: Phase;
};
