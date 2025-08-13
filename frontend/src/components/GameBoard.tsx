import React from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  useDroppable,
  closestCenter,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

import { useGame } from '../store/game'
import { Heading, Button } from '../ui'
import { ErrorMessage } from '../ui/ErrorMessage'
import { StartCard } from './StartCard'
import { TimeLineCard } from './TimeLineCard'
import { CurrentCard, CurrentCardPreview } from './CurrentCard'

// --- små helpers så vi klarar både {title,artist,year} och {trackTitle,trackArtist,releaseYear}
const Y = (c: any) => c?.year ?? c?.releaseYear
const T = (c: any) => c?.title ?? c?.trackTitle
const A = (c: any) => c?.artist ?? c?.trackArtist

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

// En minimal dropp-slot (synlig bara när show = true)
const DropSlot: React.FC<{ id: string; show: boolean }> = ({ id, show }) => {
  const { setNodeRef, isOver } = useDroppable({ id })
  if (!show) return null
  return (
    <div
      ref={setNodeRef}
      className={[
        'h-[180px] sm:h-80 w-6 sm:w-8 flex-shrink-0 rounded-lg transition-all',
        isOver ? 'bg-primary/30 outline outline-2 outline-primary/50' : 'bg-transparent',
      ].join(' ')}
      aria-label="Drop here"
    />
  )
}

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

  // Viktigt: PointerSensor utan axis-lås + DragOverlay ger fri drag över viewporten
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [isDragging, setIsDragging] = React.useState(false)

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.id === 'current-card') setIsDragging(true)
  }

  const onDragEnd = (e: DragEndEvent) => {
    setIsDragging(false)
    const overId = e.over?.id as string | undefined
    if (!overId) return

    if (overId === 'slot-0') {
      // lägg FÖRE första kortet
      placeAt(0)
      return
    }
    if (overId.startsWith('slot-')) {
      const n = Number(overId.slice(5))
      if (Number.isFinite(n)) {
        placeAt(n) // generellt: slot-i => index i i hela timeline
      }
    }
  }

  // bygger en lista av slots: före första, mellan varje, efter sista
  const renderCenteredTimeline = () => {
    const tl = team.timeline
    const showSlots = phase === 'DRAWN'

    // Inget startkort ännu (bör inte hända i TURN_START … men defensivt)
    if (tl.length === 0) return null

    const children: React.ReactNode[] = []

    // slot före första = index 0
    children.push(<DropSlot key="slot-0" id="slot-0" show={showSlots} />)

    // rendera första som StartCard (men samma stil som säkra kort i din design)
    children.push(
      <div key={tl[0]._id} className="flex-shrink-0">
        <StartCard
          year={Y(tl[0])}
          artist={A(tl[0])}
          title={T(tl[0])}
          playerName={team.name}
          className="w-full h-full"
        />
      </div>
    )

    // för varje efterföljande kort: slot mellan + kortet
    for (let i = 1; i < tl.length; i++) {
      // slot mellan i-1 och i => index i
      children.push(<DropSlot key={`slot-${i}`} id={`slot-${i}`} show={showSlots} />)
      children.push(
        <div key={tl[i]._id} className="flex-shrink-0">
          <TimeLineCard
            year={Y(tl[i])}
            artist={A(tl[i])}
            title={T(tl[i])}
            isRevealed
          />
        </div>
      )
    }

    // slot efter sista => index = tl.length
    children.push(<DropSlot key={`slot-${tl.length}`} id={`slot-${tl.length}`} show={showSlots} />)

    return (
      <div className="rounded-2xl p-2 sm:p-3 border">
        {/* justify-center => första kortet hamnar mitt i raden när listan är kort */}
        <div className="flex gap-3 items-start justify-center overflow-visible">
          {children}
        </div>
      </div>
    )
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
      {loading && <div className="text-sm text-muted-foreground">Loading tracks…</div>}
      {error && (
        <div>
          <ErrorMessage message={error} dismissible onDismiss={clearError} />
          <Button variant="outline" size="sm" onClick={startGame} className="mt-2">Retry</Button>
        </div>
      )}

      {/* Start-knapp */}
      {phase === 'SETUP' && <Button onClick={startGame}>Start Game</Button>}

      {/* Bräde */}
      {phase !== 'SETUP' && (
        <>
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            collisionDetection={closestCenter}
            modifiers={[restrictToWindowEdges]} // låt drag flyga men stanna inom viewportkanterna
          >
            <Heading level={3} className="text-lg sm:text-xl">Timeline</Heading>
            {renderCenteredTimeline()}

            {/* Drag-kortet (källan) – ligger utanför scroll för fri drag */}
            {phase === 'DRAWN' && currentCard && (
              <div className="pt-2">
                <CurrentCard card={currentCard} dragging={isDragging} />
              </div>
            )}

            {/* Overlay över hela viewporten */}
            <DragOverlay>
              {isDragging && currentCard ? <CurrentCardPreview card={currentCard} /> : null}
            </DragOverlay>
          </DndContext>

          {/* Kontroller */}
          <div className="flex flex-wrap gap-3 pt-1">
            {phase === 'TURN_START' && <Button onClick={startTurn}>Draw</Button>}
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
