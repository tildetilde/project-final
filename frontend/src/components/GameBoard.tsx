import React from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { ErrorMessage } from "../ui/ErrorMessage"
import { useGame } from '../store/game'
import { Heading, Button } from '../ui'
import { StartCard } from './StartCard'
import { Timeline } from './Timeline'
import { CurrentCard, CurrentCardPreview } from './CurrentCard'

export const GameBoard: React.FC = () => {
  const {
    teams, currentTeamIndex, phase, currentCard,
    startGame, startTurn, placeAt, drawAnother, lockIn
  } = useGame()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const [isDragging, setIsDragging] = React.useState(false)

const onDragStart = (e: DragStartEvent) => {
  if (e.active.id === 'current-card') setIsDragging(true)
}

  const onDragEnd = (e: DragEndEvent) => {
    setIsDragging(false)
    const overId = e.over?.id as string | undefined
    if (!overId) return
    if (!overId.startsWith('slot-')) return
    const index = Number(overId.replace('slot-', ''))
    if (!Number.isFinite(index)) return
    placeAt(index)
  }

  const team = teams[currentTeamIndex]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <Heading level={1} className="text-2xl sm:text-3xl">Game Mode</Heading>
        <div className="text-sm text-muted-foreground">
          {teams[0].name}: {teams[0].score} — {teams[1].name}: {teams[1].score}
        </div>
      </div>

      {phase === 'SETUP' && (
        <Button onClick={startGame}>Start Game</Button>
      )}

      {phase !== 'SETUP' && (
        <>
          {/* Startkort (första i lagets timeline) */}
          {team.timeline[0] && (
            <StartCard
              year={team.timeline[0].year}
              artist={team.timeline[0].artist}
              title={team.timeline[0].title}
              playerName={team.name}
            />
          )}

          <div>
            <Heading level={3} className="text-lg sm:text-xl mb-2 sm:mb-4">Timeline</Heading>

            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              modifiers={[restrictToWindowEdges]}
            >
              <Timeline timeline={team.timeline} showSlots={!!currentCard} />

              {/* Kandidatkort + overlay så drag ser “flytande” ut */}
              {phase === 'DRAWN' && currentCard && (
                <div className="pt-2">
                  <CurrentCard card={currentCard} dragging={isDragging} />
                </div>
              )}
              <DragOverlay>
                 {isDragging && currentCard ? <CurrentCardPreview card={currentCard} /> : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Kontroller */}
          <div className="flex flex-wrap gap-3">
            {phase === 'TURN_START' && (
              <Button onClick={startTurn}>Draw</Button>
            )}
            {phase === 'DRAWN' && (
              <div className="text-sm text-muted-foreground">
                Drag the card and drop it between two cards in the timeline.
              </div>
            )}
            {phase === 'CHOICE_AFTER_CORRECT' && (
              <>
                <Button variant="primary" onClick={drawAnother}>Draw another</Button>
                <Button variant="outline" onClick={lockIn}>Lock in & end turn</Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
