// src/store/game.ts
import { create } from "zustand"
import type { TrackCard, GameState } from "../types/game"
import { fetchTracks } from "../services/tracks"

// ---------- helpers ----------
const insertAt = (arr: TrackCard[], item: TrackCard, idx: number) => {
  const copy = arr.slice()
  copy.splice(idx, 0, item)
  return copy
}
const Y = (c: any) => c?.year ?? c?.releaseYear
const isPlacementCorrect = (timeline: TrackCard[], card: TrackCard, i: number) => {
  const y = Y(card)
  const left  = i - 1 >= 0 ? Y(timeline[i - 1]) : undefined
  const right = i < timeline.length ? Y(timeline[i]) : undefined
  return (left === undefined || y >= left) && (right === undefined || y <= right)
}
const drawOne = (pool: TrackCard[]) => {
  const i = Math.floor(Math.random() * pool.length)
  return pool.splice(i, 1)[0]
}

// ---------- extra UI-state ----------
type UIState = {
  loading: boolean
  error: string | null
  lastPlacementCorrect: boolean | null
  pendingIndex: number | null
  roundBaselineTimeline: TrackCard[]   // lagets timeline vid rundans start
  turnTimeline: TrackCard[]            // temporär timeline under pågående runda
}

// ---------- actions ----------
type Actions = {
  clearError: () => void
  startGame: () => Promise<void>
  startTurn: () => Promise<void>
  placeAt: (slotIndex: number) => void
  confirmPlacement: () => void
  drawAnother: () => Promise<void>
  lockIn: () => void
  nextTeam: () => void
}

export const useGame = create<GameState & UIState & Actions>()((set, get) => ({
  // --- GameState baseline ---
  deck: [],
  discard: [],
  teams: [
    { id: "A", name: "Team A", timeline: [], score: 0 },
    { id: "B", name: "Team B", timeline: [], score: 0 },
  ],
  currentTeamIndex: 0,
  currentCard: undefined,
  phase: "SETUP",

  // --- UIState ---
  loading: false,
  error: null,
  lastPlacementCorrect: null,
  pendingIndex: null,
  roundBaselineTimeline: [],
  turnTimeline: [],

  clearError: () => set({ error: null }),

  // --- start game: ge varje lag ett unikt startkort ---
  startGame: async () => {
    set({ loading: true, error: null })
    try {
      const deck = await fetchTracks(120)
      if (!deck || deck.length < 2) throw new Error("Not enough tracks")

      const pool = deck.slice()
      const startA = drawOne(pool)
      const startB = drawOne(pool)

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
      })
    } catch (e: any) {
      set({ error: e?.message ?? "Failed to load tracks" })
    } finally {
      set({ loading: false })
    }
  },

  // --- börja en tur / dra ett kort ---
  startTurn: async () => {
    const s = get()

    // Om leken är slut – starta om snabbt
    if (!s.deck.length) {
      await get().startGame()
    }
    const s2 = get()
    if (!s2.deck.length) return

    const [card, ...rest] = s2.deck

    // Om vi kommer från TURN_START initierar vi baseline och turnTimeline.
    // Om vi kommer från CHOICE_AFTER_CORRECT (Draw another) så behåller vi turnTimeline.
    const startingNewRound = s2.phase === "TURN_START"

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
    })
  },

  // --- välj slot: *endast* pending, rör inte turnTimeline än ---
  placeAt: (slotIndex: number) => {
    const s = get()
    if (!s.currentCard) return
    set({
      pendingIndex: slotIndex,
      phase: "PLACED_PENDING",
    })
  },

  // --- bekräfta: bedöm mot turnTimeline (staged lista) och uppdatera turnTimeline vid rätt ---
  confirmPlacement: () => {
    const s = get()
    const card = s.currentCard
    const i = s.pendingIndex

    if (!card || i == null) return

    // Bedöm mot nuvarande staged lista (så flera korrekta i rad funkar)
    const base = s.turnTimeline
    const correct = isPlacementCorrect(base, card, i)

    if (correct) {
      const staged = insertAt(base, card, i)
      set({
        turnTimeline: staged,          // bygg upp rundans tillfälliga timeline
        currentCard: undefined,
        pendingIndex: null,
        lastPlacementCorrect: true,
        phase: "CHOICE_AFTER_CORRECT", // välj: Draw another eller Lock in
      })
    } else {
      // FEL: kasta hela rundans jobb och gå tillbaka till baseline
      set({
        turnTimeline: s.roundBaselineTimeline.slice(),
        currentCard: undefined,
        pendingIndex: null,
        lastPlacementCorrect: false,
        phase: "TURN_START",
      })
      get().nextTeam()
    }
  },

  drawAnother: async () => {
    await get().startTurn()
  },

  // --- lock in: committa rundans temporära lista till lagets permanenta timeline ---
  lockIn: () => {
    const s = get()
    const tIdx = s.currentTeamIndex
    const committed = s.turnTimeline

    set({
      teams: s.teams.map((t, i) =>
        i === tIdx ? { ...t, timeline: committed } : t
      ) as GameState["teams"],
      phase: "TURN_START",
      lastPlacementCorrect: null,
      // behåll turnTimeline/baseline tills nästa startTurn initierar dem igen
    })

    get().nextTeam()
  },

  nextTeam: () => {
    const s = get()
    set({
      currentTeamIndex: (s.currentTeamIndex === 0 ? 1 : 0) as 0 | 1,
      currentCard: undefined,
      pendingIndex: null,
      // låt baseline/turnTimeline vara – de sätts korrekt i startTurn
      phase: "TURN_START",
    })
  },
}))
