export type GameItem = {
  _id?: string; // mongodb ID
  id: string; // stable ID, ex. "animal-1" / "music-1"
  name: string; // ex. "Blue Whale" / "Elvis Presley"
  label?: string; // ex. "Weight 150000 kg" / "Jailhouse Rock"
  value: number; // ex. 150000 / 1958
  categoryId: string; // "animals.weight" / "music.releaseYear"
  source?: { name: string; url?: string };
  meta?: Record<string, unknown>;
};

export type GameCategory = {
  _id?: string; // mongodb ID
  id: string;
  name: string; // "Animals", "Celebrities", etc.
  description?: string;
  question: string; // "Which animal weighs the most?"
  unit: string;
  unitVisible?: boolean;
  sort?: 'asc' | 'desc';
  source?: { name: string; url?: string };
  version?: number;
};

export type Team = {
  id: string;
  name: string;
  timeline: GameItem[];
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

export type RevealMode = "hidden" | "shown";

export type GameSettings = {
  teamNames: string[];
  turnSeconds: 30 | 60 | 90;
  revealMode: RevealMode;
};

  export type GameState = {
  deck: GameItem[];
  discard: GameItem[];
  teams: Team[];
  currentTeamIndex: number;
  currentCard?: GameItem;
  roundBaselineTimeline: GameItem[];
  pendingIndex: number | null;
  lastPlacementCorrect: boolean | null;


  phase: Phase;
};
