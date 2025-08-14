import { create } from "zustand"
import { TrackCard, GameState } from "../types/game"
import { fetchTracks } from "../services/tracks"

// ⬇️ UIState utökad med flaggan (null = ingen placering gjord ännu)
type UIState = { 
  loading: boolean;
  error: string | null;
  lastPlacementCorrect: null | boolean
  lastPlacedIndex: number | null;
  confirmPlacement: () => void;
}


type Actions = {
  startGame: () => Promise<void>
  startTurn: () => Promise<void>
  placeAt: (slotIndex: number) => void
  drawAnother: () => Promise<void>
  lockIn: () => void
  nextTeam: () => void
  clearError: () => void
  movePending: (toIndex: number) => void
}

const insertAt = (arr: TrackCard[], item: TrackCard, idx: number) => {
  const copy = arr.slice();
  copy.splice(idx, 0, item);
  return copy;
};
const isPlacementCorrect = (timeline: TrackCard[], card: TrackCard, i: number) => {
  const y = (card as any).year ?? (card as any).releaseYear;
  const left  = i - 1 >= 0 ? ((timeline[i - 1] as any).year ?? (timeline[i - 1] as any).releaseYear) : undefined;
  const right = i < timeline.length ? ((timeline[i] as any).year ?? (timeline[i] as any).releaseYear) : undefined;
  return (left === undefined || y >= left) && (right === undefined || y <= right);
};

export const useGame = create<GameState & UIState & Actions & {
  confirmPlacement: () => void;
}>((set, get) => ({
  deck: [],
  discard: [],
  teams: [
    { id: 'A', name: 'Team A', timeline: [], score: 0 },
    { id: 'B', name: 'Team B', timeline: [], score: 0 },
  ],
  currentTeamIndex: 0,
  currentCard: undefined,
  roundBaselineTimeline: [],
  pendingIndex: null,                  // <— NYTT
  lastPlacementCorrect: null,          // <— NYTT
  phase: 'SETUP',
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  startGame: async () => {
    set({ loading: true, error: null });
    try {
      const deck = await fetchTracks(100);
      if (deck.length < 1) throw new Error('Not enough tracks');
      const [a, ...rest] = deck;
      set({
        deck: rest,
        teams: [
          { id: 'A', name: 'Team A', timeline: [a], score: 0 },
          { id: 'B', name: 'Team B', timeline: [],  score: 0 }, // startar tomt, får sitt första kort senare
        ],
        currentTeamIndex: 0,
        currentCard: undefined,
        roundBaselineTimeline: [],
        pendingIndex: null,
        lastPlacementCorrect: null,
        phase: 'TURN_START',
      });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to load tracks' });
    } finally {
      set({ loading: false });
    }
  },

  startTurn: async () => {
    const s = get();
    if (!s.deck.length) {
      await useGame.getState().startGame();
    }
    const s2 = get();
    const [card, ...rest] = s2.deck;
    set({
      currentCard: card,
      deck: rest,
      roundBaselineTimeline: s2.teams[s2.currentTeamIndex].timeline.slice(),
      pendingIndex: null,
      lastPlacementCorrect: null,
      phase: 'DRAWN',
    });
  },

  // ⬇️ Viktig ändring: placeAt avgör INTE rätt/fel – den sätter bara "pending"
  placeAt: (slotIndex) => {
    const s = get();
    if (!s.currentCard) return;
    set({
      pendingIndex: slotIndex,
      phase: 'PLACED_PENDING',
    });
  },

  // ⬇️ NY: bekräfta placeringen – avgör först här om det var rätt/fel
  confirmPlacement: () => {
    const s = get();
    const tIdx = s.currentTeamIndex;
    const team = s.teams[tIdx];
    const card = s.currentCard;
    const i = s.pendingIndex;

    if (!card || i == null) return;

    const base = s.roundBaselineTimeline; // snapshot före drag
    const correct = isPlacementCorrect(base, card, i);

    if (correct) {
      const committed = insertAt(base, card, i);
      set({
        teams: s.teams.map((t, idx) => (idx === tIdx ? { ...t, timeline: committed } : t)) as GameState['teams'],
        currentCard: undefined,
        lastPlacementCorrect: true,
        pendingIndex: null,
        phase: 'CHOICE_AFTER_CORRECT', // spelaren väljer: Draw another eller Lock in & end turn
      });
    } else {
      // Fel => nollställ turn och byt lag direkt, som i dina regler
      set({
        teams: s.teams.map((t, idx) => (idx === tIdx ? { ...t, timeline: s.roundBaselineTimeline } : t)) as GameState['teams'],
        currentCard: undefined,
        lastPlacementCorrect: false,
        pendingIndex: null,
        phase: 'TURN_START',
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
    const gained = s.lastPlacementCorrect ? 1 : 0;
    set({
      teams: s.teams.map((t, i) => (i === tIdx ? { ...t, score: t.score + gained } : t)) as GameState['teams'],
      phase: 'TURN_START',
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
      phase: 'TURN_START',
    });
  },
}));
