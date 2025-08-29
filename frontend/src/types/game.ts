export type GameItem = {
  _id?: string;
  id: string; 
  name: string;
  label?: string;
  value: number;
  categoryId: string;
  source?: { name: string; url?: string };
  meta?: Record<string, unknown>;
};

export type GameCategory = {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  question: string;
  unit: string;
  unitVisible?: boolean;
  sort?: "asc" | "desc";
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
