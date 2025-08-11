import React from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

import { useGame } from '../store/game'
import { Heading, Button } from '../ui'
import { ErrorMessage } from '../ui/ErrorMessage'
import { StartCard } from './StartCard'
import { Timeline } from './Timeline'
import { CurrentCard, CurrentCardPreview } from './CurrentCard'

const TeamPill: React.FC<{ label: string; active?: boolean; score: number }> = ({ label, active, score }) => (
  <span
    className={[
      'inline-flex items-center gap-2 px-3 py-1 rounded-full border transition-all',
      active ? 'bg-primary text-base-100 border-primary shadow-sm' : 'bg-muted text-foreground border-border',
      'animate-in fade-in-0 zoom-in-95',
    ].join(' ')}
    aria-current={active ? 'true' : 'false'}
  >
    <span className="font-medium">{label}</span>
    <span className={['text-xs px-1.5 py-0.5 rounded-md', active ? 'bg-base-100/20' : 'bg-foreground/5'].join(' ')}>
      {score}
    </span>
  </span>
)

export const GameBoard: React.FC = () => {
  const {
    teams,
    currentTeamIndex,
    phase,
    currentCard,
    startGame,
    startTurn,
    placeAt,
    drawAnother,
    lockIn,
    loading,
    error,
    clearError,
  } = useGame()

  const team = teams[currentTeamIndex]

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [isDragging, setIsDragging] = React.useState(false)

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.id === 'current-card') setIsDragging(true)
  }

  const onDragEnd = (e: DragEndEvent) => {
    setIsDragging(false)
    const overId = e.over?.id as string | undefined
    if (!overId || !overId.startsWith('slot-')) return
    const index = Number(overId.slice(5))
    if (Number.isFinite(index)) placeAt(index)
  }

  return (
    <div className="space-y-5 sm:space-y-8 animate-in fade-in-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Heading level={1} className="text-2xl sm:text-3xl">Game Mode</Heading>
        <div className="flex items-center gap-2 sm:gap-3">
          <TeamPill label="Team A" score={teams[0].score} active={currentTeamIndex === 0} />
          <TeamPill label="Team B" score={teams[1].score} active={currentTeamIndex === 1} />
        </div>
      </div>

      {/* Errors / loading */}
      {loading && <div className="text-sm text-muted-foreground animate-in fade-in-0">Loading tracks…</div>}
      {error && (
        <div className="animate-in fade-in-0">
          <ErrorMessage message={error} dismissible onDismiss={clearError} />
          <Button variant="outline" size="sm" onClick={startGame} className="mt-2">Retry</Button>
        </div>
      )}

      {/* Start-knapp */}
      {phase === 'SETUP' && (
        <Button onClick={startGame} className="animate-in zoom-in-95">Start Game</Button>
      )}

      {/* Spelbrädet */}
      {phase !== 'SETUP' && (
        <>
          {/* Pinned start card (endast ett) */}
          {team.timeline[0] && (
            <div className="w-[136px] h-[180px] sm:w-48 sm:h-64 lg:w-60 lg:h-80 animate-in slide-in-from-left-3">
              <StartCard
                year={team.timeline[0].year}
                artist={team.timeline[0].artist}
                title={team.timeline[0].title}
                playerName={team.name}
                className="w-full h-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Heading level={3} className="text-lg sm:text-xl">Timeline</Heading>

            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              modifiers={[restrictToWindowEdges]}
            >
              {/* Timeline utan första kortet. Slots visas bara när man drar. */}
              <div className={['rounded-2xl p-2 sm:p-3 border transition-shadow',
                               currentTeamIndex === 0 ? 'shadow-soft' : 'shadow-soft'].join(' ')}>
                <Timeline
                  timeline={team.timeline.slice(1)}
                  showSlots={phase === 'DRAWN'}
                  size="md"
                />
              </div>

              {/* Drag-kandidat (hemlig) */}
              {phase === 'DRAWN' && currentCard && (
                <div className="pt-2 animate-in fade-in-0 slide-in-from-bottom-2">
                  <CurrentCard card={currentCard} dragging={isDragging} />
                </div>
              )}

              {/* Overlay-preview (fri drag i hela viewporten) */}
              <DragOverlay>
                {isDragging && currentCard ? <CurrentCardPreview card={currentCard} /> : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Feedback vid fel */}
          {phase === 'PLACED_WRONG' && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2
                         animate-in fade-in-0 slide-in-from-top-2"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Wrong placement! Next team’s turn…
            </div>
          )}

          {/* Kontroller */}
          <div className="flex flex-wrap gap-3 pt-1">
            {phase === 'TURN_START' && (
              <Button onClick={startTurn} className="animate-in zoom-in-95">Draw</Button>
            )}

            {phase === 'DRAWN' && (
              <div className="text-sm text-muted-foreground animate-in fade-in-0">
                Drag the card and drop it between two cards in the timeline.
              </div>
            )}

            {phase === 'CHOICE_AFTER_CORRECT' && (
              <>
                <Button variant="primary" onClick={drawAnother} className="animate-in slide-in-from-bottom-2">
                  Draw another
                </Button>
                <Button variant="outline" onClick={lockIn} className="animate-in slide-in-from-bottom-2 delay-150">
                  Lock in & end turn
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}