import { create } from "zustand"
import { TrackCard, GameState } from "../types/game"
import { fetchTracks } from "../services/tracks"

// ⬇️ UIState utökad med flaggan (null = ingen placering gjord ännu)
type UIState = { loading: boolean; error: string | null; lastPlacementCorrect: null | boolean }

type Actions = {
  startGame: () => Promise<void>
  startTurn: () => Promise<void>
  placeAt: (slotIndex: number) => void
  drawAnother: () => Promise<void>
  lockIn: () => void
  nextTeam: () => void
  clearError: () => void
}

const insertAt = (arr: TrackCard[], item: TrackCard, idx: number) => {
  const copy = arr.slice()
  copy.splice(idx, 0, item)
  return copy
}

// ⬇️ jämför alltid releaseYear
const isPlacementCorrect = (timeline: TrackCard[], card: TrackCard, i: number) => {
  const left  = i - 1 >= 0 ? timeline[i - 1].releaseYear : undefined
  const right = i < timeline.length ? timeline[i].releaseYear : undefined
  const y = card.releaseYear
  return (left === undefined || y >= left) && (right === undefined || y <= right)
}

export const useGame = create<GameState & UIState & Actions>((set, get) => ({
  deck: [],
  discard: [],
  teams: [
    { id: "A", name: "Team A", timeline: [], score: 0 },
    { id: "B", name: "Team B", timeline: [], score: 0 },
  ],
  currentTeamIndex: 0,
  currentCard: undefined,
  roundBaselineTimeline: [],
  phase: "SETUP",
  loading: false,
  error: null,
  // ⬇️ ny flagga
  lastPlacementCorrect: null,

  clearError: () => set({ error: null }),

  startGame: async () => {
    set({ loading: true, error: null })
    try {
      const deck = await fetchTracks(100)
      if (deck.length < 2) throw new Error("Not enough tracks")
      const [a, b, ...rest] = deck
      set({
        deck: rest,
        teams: [
          { id: "A", name: "Team A", timeline: [a], score: 0 },
          { id: "B", name: "Team B", timeline: [b], score: 0 },
        ],
        currentTeamIndex: 0,
        currentCard: undefined,
        roundBaselineTimeline: [],
        phase: "TURN_START",
        lastPlacementCorrect: null,
      })
    } catch (e: any) {
      set({ error: e.message ?? "Failed to load tracks" })
    } finally {
      set({ loading: false })
    }
  },

  startTurn: async () => {
    const s = get()
    if (!s.deck.length) {
      await useGame.getState().startGame() // fyll på om tomt
    }
    const s2 = get()
    const [card, ...rest] = s2.deck
    set({
      currentCard: card,
      deck: rest,
      roundBaselineTimeline: s2.teams[s2.currentTeamIndex].timeline.slice(),
      phase: "DRAWN",
      lastPlacementCorrect: null,
    })
  },

  placeAt: (slotIndex) => {
    const s = get()
    const tIdx = s.currentTeamIndex
    const team = s.teams[tIdx]
    const card = s.currentCard
    if (!card) return

    if (!isPlacementCorrect(team.timeline, card, slotIndex)) {
      // ⬇️ FEL: backa timeline till baseline, men stanna kvar på samma lag
      set({
        teams: s.teams.map((t, i) =>
          i === tIdx ? { ...t, timeline: s.roundBaselineTimeline.slice() } : t
        ) as GameState["teams"],
        currentCard: undefined,
        lastPlacementCorrect: false,          // ⬅️ markera fel
        phase: "CHOICE_AFTER_CORRECT",        // ⬅️ återanvänd knapparna
      })
      return
    }

    // ⬇️ RÄTT: lägg in kortet, stanna i samma lag tills man "lockar in"
    const newTimeline = insertAt(team.timeline, card, slotIndex)
    set({
      teams: s.teams.map((t, i) =>
        i === tIdx ? { ...t, timeline: newTimeline } : t
      ) as GameState["teams"],
      currentCard: undefined,
      lastPlacementCorrect: true,             // ⬅️ markera rätt
      phase: "CHOICE_AFTER_CORRECT",
    })
  },

  drawAnother: async () => {
    await get().startTurn()
  },

  lockIn: () => {
    const s = get()
    const tIdx = s.currentTeamIndex
    const gained = s.lastPlacementCorrect ? 1 : 0   // ⬅️ poäng bara vid korrekt

    set({
      teams: s.teams.map((t, i) =>
        i === tIdx ? { ...t, score: t.score + gained } : t
      ) as GameState["teams"],
      phase: "TURN_START",
      lastPlacementCorrect: null,
    })

    get().nextTeam()
  },

  nextTeam: () => {
    const s = get()
    set({
      currentTeamIndex: (s.currentTeamIndex === 0 ? 1 : 0) as 0 | 1,
      currentCard: undefined,
      phase: "TURN_START",
      lastPlacementCorrect: null,
    })
  },
}))
