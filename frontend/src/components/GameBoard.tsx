// src/components/GameBoard.tsx
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
import { useNavigate } from "react-router-dom";

import { useGame } from "../store/game";
import { Button } from "../ui";
import { ErrorMessage } from "../ui/ErrorMessage";
import { TimeLineCard } from "./TimeLineCard";
import { CurrentCard, CurrentCardPreview } from "./CurrentCard";

/** Smalare och lägre "drop slots" för kompakt timeline */
const DropSlot: React.FC<{ id: string; show: boolean }> = ({ id, show }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  if (!show) return null;

  return (
    <div
      ref={setNodeRef}
      className={[
        "h-[96px] sm:h-[120px] w-0.5 sm:w-1 flex-shrink-0 rounded-md transition-all",
        isOver ? "bg-primary/40 outline outline-primary/50" : "bg-primary/20",
      ].join(" ")}
      aria-label="Drop here"
    />
  );
};

export const GameBoard: React.FC<{ className?: string }> = ({ className }) => {
  // ---- En hook per fält/action (inga object-literals → inga nya referenser per render)
  const teams = useGame((s) => s.teams);
  const currentTeamIndex = useGame((s) => s.currentTeamIndex);
  const phase = useGame((s) => s.phase);
  const currentCard = useGame((s) => s.currentCard);

  const startGame = useGame((s) => s.startGame);
  const startTurn = useGame((s) => s.startTurn);
  const placeAt = useGame((s) => s.placeAt);
  const drawAnother = useGame((s) => s.drawAnother);
  const lockIn = useGame((s) => s.lockIn);
  const confirmPlacement = useGame((s) => s.confirmPlacement);

  const loading = useGame((s) => s.loading);
  const error = useGame((s) => s.error);
  const clearError = useGame((s) => s.clearError);

  const pendingIndex = useGame((s) => s.pendingIndex);
  const lastPlacementCorrect = useGame((s) => s.lastPlacementCorrect);
  const selectedCategory = useGame((s) => s.selectedCategory);
  const lastTurnFeedback = useGame((s) => s.lastTurnFeedback);
  const turnTimeline = useGame((s) => s.turnTimeline);

  const team = teams[currentTeamIndex];

  const navigate = useNavigate();

  const winner = useGame((s) => (s as any).winner);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  const [isDragging, setIsDragging] = React.useState(false);

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.id === "current-card") setIsDragging(true);
  };

  const onDragEnd = (e: DragEndEvent) => {
    setIsDragging(false);
    const overId = e.over?.id as string | undefined;
    if (!overId || !overId.startsWith("slot-")) return;
    const n = Number(overId.slice(5));
    if (!Number.isFinite(n)) return;
    if (!currentCard) return;
    placeAt(n);
  };

  const [showWinner, setShowWinner] = React.useState(true);
  React.useEffect(() => {
    setShowWinner(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowWinner(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [winner]);

  const winnerName = React.useMemo(() => {
    if (!winner) return null;
    if (typeof winner === "number") return teams[winner]?.name ?? "Team";
    if (typeof winner === "string") return winner;
    if (typeof winner === "object") {
      if ("teamIndex" in winner)
        return teams[(winner as any).teamIndex]?.name ?? "Team";
      if ("index" in winner)
        return teams[(winner as any).index]?.name ?? "Team";
      if ("name" in winner) return (winner as any).name ?? "Team";
    }
    const bestIdx = teams.reduce(
      (best, _, i, arr) =>
        (arr[i].timeline?.length ?? 0) > (arr[best].timeline?.length ?? 0)
          ? i
          : best,
      0
    );
    return teams[bestIdx]?.name ?? "Team";
  }, [winner, teams]);

  /** Timeline i liten skala; kort växer på hover */
  const renderTimeline = () => {
    const teamTimeline = team?.timeline ?? [];
    const base =
      phase === "DRAWN" ||
      phase === "PLACED_PENDING" ||
      phase === "CHOICE_AFTER_CORRECT"
        ? turnTimeline
        : teamTimeline;

    const showSlots = phase === "DRAWN" || phase === "PLACED_PENDING";

    const children: React.ReactNode[] = [];
    children.push(<DropSlot key="slot-0" id="slot-0" show={showSlots} />);

    for (let i = 0; i < base.length; i++) {
      // Pending-kortet renderas i samma lilla skala, precis som övriga
      if (phase === "PLACED_PENDING" && pendingIndex === i && currentCard) {
        children.push(
          <div key="pending-card" className="group relative flex-shrink-0">
            <div className="origin-bottom scale-[0.8] group-hover:scale-[1] transition-transform duration-150">
              <CurrentCard card={currentCard} dragging={isDragging} />
            </div>
          </div>
        );
      }

      const c = base[i] as any;
      const isLastPlaced =
        lastPlacementCorrect !== null &&
        pendingIndex !== null &&
        i === pendingIndex;

      children.push(
        <div
          key={c?._id ?? c?.id ?? i}
          className="group relative flex-shrink-0"
        >
          {/* Bas: ~60% storlek. Hover: ~75%. Origin i botten så den "poppar uppåt". */}
          <div className="origin-bottom scale-[0.8] group-hover:scale-[1] transition-transform duration-150">
            <TimeLineCard
              item={base[i]}
              category={selectedCategory || undefined}
              size={"sm"}
              isRevealed
              isCorrect={isLastPlaced ? lastPlacementCorrect : undefined}
            />
          </div>
        </div>
      );

      children.push(
        <DropSlot key={`slot-${i + 1}`} id={`slot-${i + 1}`} show={showSlots} />
      );
    }

    if (
      phase === "PLACED_PENDING" &&
      pendingIndex === base.length &&
      currentCard
    ) {
      children.splice(
        children.length - 1,
        0,
        <div key="pending-last" className="group relative flex-shrink-0">
          <div className="origin-bottom scale-[0.8] group-hover:scale-[1] transition-transform duration-150">
            <CurrentCard card={currentCard} dragging={isDragging} />
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl p-2 sm:p-3 border border-border bg-background/60">
        {/* overflow-y visible krävs för att hovrade kort kan växa utanför raden */}
        <div className="flex items-end justify-center overflow-x-auto overflow-y-visible gap-1 sm:gap-2">
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
    <div className={["animate-in fade-in-50", className].join(" ")}>
      {/* Errors / loading */}
      {loading && (
        <div className="text-sm text-muted-foreground">Loading items…</div>
      )}
      {error && (
        <div className="mb-3">
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Button
            onClick={startGame}
            size="lg"
            className="relative px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl 
                 bg-gradient-to-r from-primary via-primary/90 to-primary 
                 text-base-100 transition-transform duration-200 hover:scale-105 
                 focus:outline-none focus:ring-4 focus:ring-primary/40"
          >
            <span className="relative z-10">Draw first card!</span>
            <span className="absolute inset-0 rounded-2xl bg-primary/50 blur-xl opacity-70 animate-pulse" />
          </Button>
        </div>
      )}

      {/* Board */}
      {phase !== "SETUP" && (
        <>
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            collisionDetection={closestCenter}
            modifiers={[restrictToWindowEdges]}
          >
            {/* Ny layout: tidslinjen överst, instruction text under till vänster */}
            <div className="flex flex-col items-stretch gap-2 sm:gap-3">
              <div className="min-h-[140px]">{renderTimeline()}</div>

              {/* Instruction text positioned under timeline, aligned to the left */}
              {phase === "DRAWN" && currentCard && (
                <div className="text-sm text-muted-foreground text-left">
                  Drag the card and drop it between two cards.
                </div>
              )}

              {/* Current card alltid placerat under tidslinjen */}
              {phase === "DRAWN" && currentCard && (
                <div className="flex w-full justify-center">
                  {/* Gör kortet något större för tydlighet */}
                  <div className="origin-top scale-105 sm:scale-105">
                    <CurrentCard card={currentCard} dragging={isDragging} />
                  </div>
                </div>
              )}
            </div>

            <DragOverlay>
              {isDragging && currentCard ? (
                <CurrentCardPreview card={currentCard} />
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Time's up-feedback (visas mellan turer) */}
          {lastTurnFeedback?.timeUp && (
            <div
              className="mt-2 text-sm text-center"
              role="status"
              aria-live="polite"
            >
              <span className="font-medium">Time’s up.</span>{" "}
              {lastTurnFeedback.correct === true && (
                <span className="text-green-700">You were correct!</span>
              )}
              {lastTurnFeedback.correct === false && (
                <span className="text-red-700">That was incorrect.</span>
              )}
              {lastTurnFeedback.correct == null && (
                <span className="text-muted-foreground">No answer placed.</span>
              )}
            </div>
          )}

          {/* Kontroller */}
          <div className="flex flex-wrap gap-3 pt-3">
            {phase === "TURN_START" && (
              <Button onClick={startTurn}>Draw</Button>
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

      {winner && showWinner && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-live="assertive"
          onClick={() => setShowWinner(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative mx-4 w-[min(26rem,90vw)] rounded-2xl px-6 py-8 sm:px-8 sm:py-10 text-center bg-surface border border-border shadow-strong"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWinner(false)}
              aria-label="Close"
              className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-card border border-border text-2xl leading-none hover:bg-card/80 transition"
            >
              ×
            </button>

            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Congratulations!
            </div>
            <div className="mt-2 text-base sm:text-lg text-muted-foreground">
              {winnerName ? `${winnerName} wins` : `Winner!`}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setShowWinner(false);
                  useGame.getState().applySettings();
                  useGame.getState().startGame();
                }}
              >
                Rematch
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  useGame.getState().resetGameAndCategory();
                  navigate("/", { state: { scrollTo: "categories" } });
                }}
              >
                New category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
