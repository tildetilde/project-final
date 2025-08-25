// src/store/game.ts
import { create } from "zustand";
import type {
  GameItem,
  GameState,
  GameCategory,
  GameSettings,
  RevealMode,
} from "../types/game";
import { apiService } from "../services/api";
import { shuffle } from "../lib/shuffle";

const WIN_TARGET = 10;

const insertAt = (arr: GameItem[], item: GameItem, idx: number) => {
  const copy = arr.slice();
  copy.splice(idx, 0, item);
  return copy;
};
const Y = (c: GameItem | undefined) => c?.value;
const isPlacementCorrect = (
  timeline: GameItem[],
  card: GameItem,
  i: number
) => {
  const y = Y(card);
  if (y === undefined) return false;

  const left = i - 1 >= 0 ? Y(timeline[i - 1]) : undefined;
  const right = i < timeline.length ? Y(timeline[i]) : undefined;
  return (
    (left === undefined || y >= left) && (right === undefined || y <= right)
  );
};
const drawOne = (pool: GameItem[]) => {
  const i = Math.floor(Math.random() * pool.length);
  return pool.splice(i, 1)[0];
};

// ---------- extra UI-state ----------
type TimerState = {
  turnDeadline: number | null;
  secondsLeft: number;
  timerId: number | null;
};

type UIState = {
  loading: boolean;
  error: string | null;
  lastPlacementCorrect: boolean | null;
  pendingIndex: number | null;
  roundBaselineTimeline: GameItem[];
  turnTimeline: GameItem[];
  categories: GameCategory[];
  selectedCategory: GameCategory | null;
  settings: GameSettings;
  timer: TimerState;
  lastTurnFeedback: { timeUp?: boolean; correct?: boolean | null } | null;
  winner: { teamIndex: number; teamName: string } | null;
};

// ---------- actions ----------
type Actions = {
  clearError: () => void;
  loadCategories: () => Promise<void>;
  selectCategory: (category: GameCategory) => void;
  startGame: () => Promise<void>;
  startTurn: () => Promise<void>;
  placeAt: (slotIndex: number) => void;
  confirmPlacement: () => void;
  drawAnother: () => Promise<void>;
  lockIn: () => void;
  nextTeam: () => void;
  setTeamCount: (count: number) => void;
  setTeamName: (index: number, name: string) => void;
  setTurnSeconds: (sec: 30 | 60 | 90) => void;
  setRevealMode: (mode: RevealMode) => void;
  applySettings: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  timeUp: () => void;
  resetGame: () => void;
};

const initialSettings: GameSettings = {
  teamNames: ["Team Bang", "Team Ganza", "Team Anga", "Team Zaba"],
  turnSeconds: 60,
  revealMode: "hidden",
};

const initialTimer: TimerState = {
  turnDeadline: null,
  secondsLeft: initialSettings.turnSeconds,
  timerId: null,
};

export const useGame = create<GameState & UIState & Actions>()((set, get) => {
  // 🔹 Nu kan du definiera helpers här:
  const declareWinner = (staged: GameItem[]) => {
    const s = get();
    const tIdx = s.currentTeamIndex;

    get().stopTimer();

    set({
      teams: s.teams.map((t, i) =>
        i === tIdx ? { ...t, timeline: staged } : t
      ) as GameState["teams"],
      currentCard: undefined,
      pendingIndex: null,
      lastPlacementCorrect: true,
      phase: "TURN_START",
      winner: { teamIndex: tIdx, teamName: s.teams[tIdx].name },
    });
  };

  // 🔹 Här returnerar du store-objektet som tidigare
  return {
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
    categories: [],
    selectedCategory: null,
    settings: initialSettings,
    timer: initialTimer,
    winner: null,

    lastTurnFeedback: null,

    clearError: () => set({ error: null }),

    loadCategories: async () => {
      set({ loading: true, error: null });
      try {
        const categories = await apiService.getCategories();
        set({ categories, loading: false });
      } catch (error: any) {
        set({
          error: error?.message ?? "Failed to load categories",
          loading: false,
        });
      }
    },

    selectCategory: (category: GameCategory) => {
      set({ selectedCategory: category });
    },

    startGame: async () => {
      const state = get();
      if (!state.selectedCategory) {
        set({ error: "Please select a category first" });
        return;
      }

      set({ loading: true, error: null });
      try {
        const deck = await apiService.getItemsWithValues(
          state.selectedCategory.id
        );
        if (!deck || deck.length < 2) throw new Error("Not enough items");

        const shuffledDeck = shuffle(deck);
        const pool = shuffledDeck.slice();

        const names = get().settings.teamNames;
        const teams = names.map((name, i) => {
          const start = drawOne(pool);
          return { id: String(i), name, timeline: [start], score: 0 };
        });

        set({
          deck: pool,
          discard: [],
          teams,
          currentTeamIndex: 0,
          currentCard: undefined,
          roundBaselineTimeline: [],
          turnTimeline: [],
          pendingIndex: null,
          lastPlacementCorrect: null,
          phase: "TURN_START",
          winner: null,
        });
      } catch (e: any) {
        set({ error: e?.message ?? "Failed to load items" });
      } finally {
        set({ loading: false });
      }
    },

    startTurn: async () => {
      const s = get();
      if (s.winner) return;
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
        lastTurnFeedback: null,
        phase: "DRAWN",
      });
      get().startTimer();
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
        if (staged.length >= WIN_TARGET) {
          declareWinner(staged);
          return;
        }

        get().stopTimer();

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
        get().stopTimer();
        get().nextTeam();
      }
    },

    drawAnother: async () => {
      await get().startTurn();
    },

    lockIn: () => {
      const s = get();
      if (s.winner) return;

      const tIdx = s.currentTeamIndex;
      const committed = s.turnTimeline;

      get().stopTimer();

      // extra explicit reset (syns direkt i UI även om batched)
      const full = get().settings.turnSeconds;
      set((state) => ({ timer: { ...state.timer, secondsLeft: full } }));

      if (committed.length >= WIN_TARGET) {
        declareWinner(committed);
        return;
      }

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
      const next = (s.currentTeamIndex + 1) % s.teams.length;
      set({
        currentTeamIndex: next,
        currentCard: undefined,
        pendingIndex: null,
        phase: "TURN_START",
      });
    },

    setTeamCount: (count) => {
      const s = get().settings;
      const names = s.teamNames.slice(0, count);
      while (names.length < count) names.push(`Team ${names.length + 1}`);
      set({ settings: { ...s, teamNames: names } });
    },

    setTeamName: (index, name) => {
      const s = get().settings;
      const names = s.teamNames.slice();
      names[index] = name;
      set({ settings: { ...s, teamNames: names } });
    },

    setTurnSeconds: (sec) => {
      const s = get().settings;
      set({
        settings: { ...s, turnSeconds: sec },
        timer: { ...get().timer, secondsLeft: sec },
      });
    },

    setRevealMode: (mode) => {
      const s = get().settings;
      set({ settings: { ...s, revealMode: mode } });
    },

    applySettings: () => {
      const { settings, timer } = get();
      set({ timer: { ...timer, secondsLeft: settings.turnSeconds } });
    },

    timeUp: () => {
      const s = get();

      // Har spelaren lagt ett kort i en slot (PLACED_PENDING)?
      if (s.pendingIndex != null && s.currentCard) {
        const ok = isPlacementCorrect(
          s.turnTimeline,
          s.currentCard,
          s.pendingIndex
        );

        if (ok) {
          // ✅ Rätt: lägg in kortet i turnTimeline och låt spelaren välja
          const staged = insertAt(
            s.turnTimeline,
            s.currentCard,
            s.pendingIndex
          );
          if (staged.length >= WIN_TARGET) {
            // Commit + vinnare
            set({
              currentCard: undefined,
              pendingIndex: null,
              lastPlacementCorrect: true,
              lastTurnFeedback: { timeUp: true, correct: true },
            });
            declareWinner(staged);
            return;
          }

          set({
            turnTimeline: staged,
            currentCard: undefined,
            pendingIndex: null,
            lastPlacementCorrect: true,
            lastTurnFeedback: { timeUp: true, correct: true },
          });
          get().stopTimer(); // stoppa & nollställ klockan
          set({ phase: "CHOICE_AFTER_CORRECT" }); // stanna i valet (inte lockIn)
          return;
        } else {
          // ❌ Fel: återställ till baseline och avsluta turen
          set({
            turnTimeline: s.roundBaselineTimeline.slice(),
            currentCard: undefined,
            pendingIndex: null,
            lastPlacementCorrect: false,
            lastTurnFeedback: { timeUp: true, correct: false },
          });
          get().stopTimer();
          get().lockIn(); // commit baseline + nästa lag
          return;
        }
      }

      // ⏱️ Tiden slut utan att något lades (ingen pending)
      set({
        lastPlacementCorrect: null,
        lastTurnFeedback: { timeUp: true, correct: null },
      });
      get().stopTimer();
      get().lockIn(); // commit nuvarande turnTimeline (baseline) + nästa lag
    },

    startTimer: () => {
      const prev = get().timer.timerId;
      if (prev) window.clearInterval(prev);

      const { turnSeconds } = get().settings;
      const deadline = Date.now() + turnSeconds * 1000;

      const id = window.setInterval(() => {
        const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        set({
          timer: {
            ...get().timer,
            secondsLeft: left,
            turnDeadline: deadline,
            timerId: id,
          },
        });
        if (left <= 0) {
          get().timeUp();
        }
      }, 250);

      set({
        timer: {
          ...get().timer,
          secondsLeft: turnSeconds,
          turnDeadline: deadline,
          timerId: id,
        },
      });
    },

    stopTimer: () => {
      const { timerId } = get().timer;
      if (timerId) window.clearInterval(timerId);
      const full = get().settings.turnSeconds;
      set({
        timer: {
          ...get().timer,
          timerId: null,
          turnDeadline: null,
          secondsLeft: full, // reset till max
        },
      });
    },

    resetGame: () => {
      const { timerId } = get().timer;
      if (timerId) window.clearInterval(timerId);
      
      set({
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
        selectedCategory: null,
        winner: null,
        lastTurnFeedback: null,
        timer: {
          turnDeadline: null,
          secondsLeft: initialSettings.turnSeconds,
          timerId: null,
        },
      });
    },
  };
});
