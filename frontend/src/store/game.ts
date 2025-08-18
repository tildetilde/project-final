// src/store/game.ts
import { create } from "zustand";
import type { TrackCard, GameState } from "../types/game";
import type { GameItem } from "../types/game";
import { animalsItems } from "../services/animalsMock";

// ---------- helpers ----------
const toTrackCard = (it: GameItem): TrackCard =>
  ({
    // behåll legacy-fält för nycklar i UI
    _id: it.id,
    trackId: it.id,
    year: it.value,
    artist: it.name,
    title: it.label ?? it.name,
  } as unknown as TrackCard);

const insertAt = (arr: TrackCard[], item: TrackCard, idx: number) => {
  const copy = arr.slice();
  copy.splice(idx, 0, item);
  return copy;
};
const Y = (c: any) => c?.year ?? c?.releaseYear;
const isPlacementCorrect = (
  timeline: TrackCard[],
  card: TrackCard,
  i: number
) => {
  const y = Y(card);
  const left = i - 1 >= 0 ? Y(timeline[i - 1]) : undefined;
  const right = i < timeline.length ? Y(timeline[i]) : undefined;
  return (
    (left === undefined || y >= left) && (right === undefined || y <= right)
  );
};
const drawOne = (pool: TrackCard[]) => {
  const i = Math.floor(Math.random() * pool.length);
  return pool.splice(i, 1)[0];
};

// ---------- extra UI-state ----------
type UIState = {
  loading: boolean;
  error: string | null;
  lastPlacementCorrect: boolean | null;
  pendingIndex: number | null;
  roundBaselineTimeline: TrackCard[];
  turnTimeline: TrackCard[];
};

// ---------- actions ----------
type Actions = {
  clearError: () => void;
  startGame: () => Promise<void>;
  startTurn: () => Promise<void>;
  placeAt: (slotIndex: number) => void;
  confirmPlacement: () => void;
  drawAnother: () => Promise<void>;
  lockIn: () => void;
  nextTeam: () => void;
};

export const useGame = create<GameState & UIState & Actions>()((set, get) => ({
  deck: [],
  discard: [],
  teams: [
    { id: "A", name: "Team A", timeline: [], score: 0 },
    { id: "B", name: "Team B", timeline: [], score: 0 },
  ],
  currentTeamIndex: 0,
  currentCard: undefined,
  phase: "SETUP",

  loading: false,
  error: null,
  lastPlacementCorrect: null,
  pendingIndex: null,
  roundBaselineTimeline: [],
  turnTimeline: [],

  clearError: () => set({ error: null }),

  // endast bytt datakälla -> animalsItems
  startGame: async () => {
    set({ loading: true, error: null });
    try {
      const deck: TrackCard[] = animalsItems.map(toTrackCard);
      if (!deck || deck.length < 2) throw new Error("Not enough items");

      const pool = deck.slice();
      const startA = drawOne(pool);
      const startB = drawOne(pool);

      set({
        deck: pool,
        discard: [],
        teams: [
          { id: "A", name: "Team A", timeline: [startA], score: 0 },
          { id: "B", name: "Team B", timeline: [startB], score: 0 },
        ],
        currentTeamIndex: 0,
        currentCard: undefined,
        roundBaselineTimeline: [],
        turnTimeline: [],
        pendingIndex: null,
        lastPlacementCorrect: null,
        phase: "TURN_START",
      });
    } catch (e: any) {
      set({ error: e?.message ?? "Failed to load items" });
    } finally {
      set({ loading: false });
    }
  },

  startTurn: async () => {
    const s = get();
    if (!s.deck.length) {
      await get().startGame();
    }
    const s2 = get();
    if (!s2.deck.length) return;

    const [card, ...rest] = s2.deck;
    const startingNewRound = s2.phase === "TURN_START";

    set({
      deck: rest,
      currentCard: card,
      roundBaselineTimeline: startingNewRound
        ? s2.teams[s2.currentTeamIndex].timeline.slice()
        : s2.roundBaselineTimeline,
      turnTimeline: startingNewRound
        ? s2.teams[s2.currentTeamIndex].timeline.slice()
        : s2.turnTimeline,
      pendingIndex: null,
      lastPlacementCorrect: null,
      phase: "DRAWN",
    });
  },

  placeAt: (slotIndex: number) => {
    const s = get();
    if (!s.currentCard) return;
    set({
      pendingIndex: slotIndex,
      phase: "PLACED_PENDING",
    });
  },

  confirmPlacement: () => {
    const s = get();
    const card = s.currentCard;
    const i = s.pendingIndex;
    if (!card || i == null) return;

    const base = s.turnTimeline;
    const correct = isPlacementCorrect(base, card, i);

    if (correct) {
      const staged = insertAt(base, card, i);
      set({
        turnTimeline: staged,
        currentCard: undefined,
        pendingIndex: null,
        lastPlacementCorrect: true,
        phase: "CHOICE_AFTER_CORRECT",
      });
    } else {
      set({
        turnTimeline: s.roundBaselineTimeline.slice(),
        currentCard: undefined,
        pendingIndex: null,
        lastPlacementCorrect: false,
        phase: "TURN_START",
      });
      get().nextTeam();
    }
  },

  drawAnother: async () => {
    await get().startTurn();
  },

  lockIn: () => {
    const s = get();
    const tIdx = s.currentTeamIndex;
    const committed = s.turnTimeline;

    set({
      teams: s.teams.map((t, i) =>
        i === tIdx ? { ...t, timeline: committed } : t
      ) as GameState["teams"],
      phase: "TURN_START",
      lastPlacementCorrect: null,
    });

    get().nextTeam();
  },

  nextTeam: () => {
    const s = get();
    set({
      currentTeamIndex: (s.currentTeamIndex === 0 ? 1 : 0) as 0 | 1,
      currentCard: undefined,
      pendingIndex: null,
      phase: "TURN_START",
    });
  },
}));
