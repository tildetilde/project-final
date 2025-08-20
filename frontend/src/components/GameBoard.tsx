import React from "react";
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
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import { useGame } from "../store/game";
import { Heading, Button } from "../ui";
import { ErrorMessage } from "../ui/ErrorMessage";
import { TimeLineCard } from "./TimeLineCard";
import { CurrentCard, CurrentCardPreview } from "./CurrentCard";

// helpers som tål både {title,artist,year} och {trackTitle,trackArtist,releaseYear}
const Y = (c: any) => c?.year ?? c?.releaseYear;
const T = (c: any) => c?.title ?? c?.trackTitle;
const A = (c: any) => c?.artist ?? c?.trackArtist;

const TeamPill: React.FC<{
  label: string;
  active?: boolean;
  score: number;
}> = ({ label, active, score }) => (
  <span
    className={[
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border transition-all",
      active
        ? "bg-primary text-base-100 border-primary shadow-sm"
        : "bg-muted text-foreground border-border",
      "animate-in fade-in-0 zoom-in-95",
    ].join(" ")}
    aria-current={active ? "true" : "false"}
  >
    <span className="font-medium">{label}</span>
    <span
      className={[
        "text-xs px-1.5 py-0.5 rounded-md",
        active ? "bg-base-100/20" : "bg-foreground/5",
      ].join(" ")}
    >
      {score}
    </span>
  </span>
);

// dropp-slot
const DropSlot: React.FC<{ id: string; show: boolean }> = ({ id, show }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  if (!show) return null;
  return (
    <div
      ref={setNodeRef}
      className={[
        "h-[180px] sm:h-80 w-6 sm:w-8 flex-shrink-0 rounded-lg transition-all",
        isOver ? "bg-primary/30 outline outline-primary/50" : "bg-transparent",
      ].join(" ")}
      aria-label="Drop here"
    />
  );
};

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
    confirmPlacement,
    loading,
    error,
    clearError,
    pendingIndex,
    lastPlacementCorrect,
  } = useGame();

  const team = teams[currentTeamIndex];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  const [isDragging, setIsDragging] = React.useState(false);

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.id === "current-card") setIsDragging(true);
  };

  // När man släpper över en slot: markera pending (flytta inte currentCard till timeline ännu)
  const onDragEnd = (e: DragEndEvent) => {
    setIsDragging(false);
    const overId = e.over?.id as string | undefined;
    if (!overId || !overId.startsWith("slot-")) return;
    const n = Number(overId.slice(5));
    if (!Number.isFinite(n)) return;
    if (!currentCard) return;
    placeAt(n); // sätter pendingIndex + phase: 'PLACED_PENDING'
  };

  // timeline: rendera vita kortet *inne i* timeline på pendingIndex, annars reveal:ade kort
  const renderTimeline = () => {
    const base =
      phase === "DRAWN" ||
      phase === "PLACED_PENDING" ||
      phase === "CHOICE_AFTER_CORRECT"
        ? useGame.getState().turnTimeline
        : team.timeline;

    const showSlots = phase === "DRAWN" || phase === "PLACED_PENDING";

    const children: React.ReactNode[] = [];
    children.push(<DropSlot key="slot-0" id="slot-0" show={showSlots} />);

    for (let i = 0; i < base.length; i++) {
      if (phase === "PLACED_PENDING" && pendingIndex === i && currentCard) {
        children.push(
          <div key="pending-card" className="flex-shrink-0">
            <CurrentCard card={currentCard} dragging={isDragging} />
          </div>
        );
      }

      const c = base[i];

      const isLastPlaced =
        lastPlacementCorrect !== null &&
        pendingIndex !== null &&
        i === pendingIndex;

      children.push(
        <div
          key={(c as any)._id ?? (c as any).trackId ?? i}
          className="flex-shrink-0"
        >
          <TimeLineCard
            year={Y(c)}
            artist={A(c)}
            title={T(c)}
            isRevealed
            isCorrect={isLastPlaced ? lastPlacementCorrect : undefined}
          />
        </div>
      );

      children.push(
        <DropSlot key={`slot-${i + 1}`} id={`slot-${i + 1}`} show={showSlots} />
      );
    }

    // pending sist
    if (
      phase === "PLACED_PENDING" &&
      pendingIndex === base.length &&
      currentCard
    ) {
      children.splice(
        children.length - 1,
        0,
        <div key="pending-last" className="flex-shrink-0">
          <CurrentCard card={currentCard} dragging={isDragging} />
        </div>
      );
    }

    return (
      <div className="rounded-2xl p-2 sm:p-3 border border-border">
        <div className="flex gap-3 items-start justify-center overflow-visible">
          {children}
        </div>
        {lastPlacementCorrect === true && (
          <div className="text-green-600 font-semibold text-center mt-2">
            ✅ Yes! Correct!
          </div>
        )}
        {lastPlacementCorrect === false && (
          <div className="text-red-600 font-semibold text-center mt-2">
            ❌ Oh no, wrong answer! Your turn is over
          </div>
        )}
        {phase === "PLACED_PENDING" && (
          <div className="flex justify-center pt-2">
            <Button size="sm" onClick={confirmPlacement}>
              Confirm placement
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-8 animate-in fade-in-50">
      {/* Errors / loading */}
      {loading && (
        <div className="text-sm text-muted-foreground">Loading items…</div>
      )}
      {error && (
        <div>
          <ErrorMessage message={error} dismissible onDismiss={clearError} />
          <Button
            variant="outline"
            size="sm"
            onClick={startGame}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Start-knapp */}
      {phase === "SETUP" && (
        <div className="flex justify-center">
          <Button onClick={startGame}>Start Game</Button>
        </div>
      )}

      {/* Bräde */}
      {phase !== "SETUP" && (
        <>
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            collisionDetection={closestCenter}
            modifiers={[restrictToWindowEdges]}
          >
            <Heading level={3} className="text-lg sm:text-xl">
              Timeline
            </Heading>
            {renderTimeline()}

            {/* Det vita kortet visas UTANFÖR tidslinjen bara när vi är i DRAWN */}
            {phase === "DRAWN" && currentCard && (
              <div className="pt-2">
                <CurrentCard card={currentCard} dragging={isDragging} />
              </div>
            )}

            <DragOverlay>
              {isDragging && currentCard ? (
                <CurrentCardPreview card={currentCard} />
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Kontroller efter rätt svar */}
          <div className="flex flex-wrap gap-3 pt-1">
            {phase === "TURN_START" && (
              <Button onClick={startTurn}>Draw</Button>
            )}

            {phase === "DRAWN" && (
              <div className="text-sm text-muted-foreground">
                Drag the card and drop it between two cards in the timeline.
              </div>
            )}

            {phase === "CHOICE_AFTER_CORRECT" && (
              <>
                <Button variant="primary" onClick={drawAnother}>
                  Draw another
                </Button>
                <Button variant="outline" onClick={lockIn}>
                  Lock in & end turn
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
