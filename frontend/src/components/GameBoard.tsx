import React from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";

import { useGame } from "../store/game";
import { Button } from "../ui";
import { ErrorMessage } from "../ui/ErrorMessage";
import { TimeLineCard } from "./TimeLineCard";
import { CurrentCard, CurrentCardPreview } from "./CurrentCard";

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
  const nextTeam = useGame((s) => s.nextTeam);

  const loading = useGame((s) => s.loading);
  const error = useGame((s) => s.error);
  const clearError = useGame((s) => s.clearError);

  const pendingIndex = useGame((s) => s.pendingIndex);
  const lastPlacementCorrect = useGame((s) => s.lastPlacementCorrect);
  const selectedCategory = useGame((s) => s.selectedCategory);
  const lastTurnFeedback = useGame((s) => s.lastTurnFeedback);
  const turnTimeline = useGame((s) => s.turnTimeline);
  const timer = useGame((s) => s.timer);
  const settings = useGame((s) => s.settings);
  const wrongAnswerCard = useGame((s) => s.wrongAnswerCard);

  const team = teams[currentTeamIndex];

  const navigate = useNavigate();

  const winner = useGame((s) => (s as any).winner);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );
  const [isDragging, setIsDragging] = React.useState(false);

  const onDragStart = (e: DragStartEvent) => {
    if (
      e.active.id === "current-card" &&
      lastPlacementCorrect !== false &&
      phase !== "PLACED_WRONG"
    ) {
      setIsDragging(true);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setIsDragging(false);
    if (lastPlacementCorrect === false || phase === "PLACED_WRONG") return;

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


  const renderTimeline = () => {
    const teamTimeline = team?.timeline ?? [];
    const base =
      phase === "DRAWN" ||
      phase === "PLACED_PENDING" ||
      phase === "CHOICE_AFTER_CORRECT"
        ? turnTimeline
        : teamTimeline;

    const showSlots = phase === "DRAWN" || phase === "PLACED_PENDING";


    if (lastTurnFeedback?.timeUp && lastTurnFeedback.correct == null) {
      return (
        <div className="rounded-2xl p-2 sm:p-3 border border-border bg-[#2a0d0d] animate-pulse">
          <div className="flex items-center justify-center h-[140px]">
            <div className="text-center">
              <div className="font-bold text-xl lg:text-5xl mb-2 text-[#f9ecdf] animate-bounce font-mono">
                TIME’S UP!
              </div>
              <div className="lg:text-lg text-[#f9ecdf] font-mono">
                <span className="inline-block animate-[typewriter-smooth_1.5s_ease-out]">
                  Your turn is over, it's time for the next team.
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (
      lastPlacementCorrect === false ||
      phase === "PLACED_WRONG" ||
      (lastTurnFeedback?.timeUp && lastTurnFeedback.correct === false)
    ) {
      const heading = lastTurnFeedback?.timeUp ? "TIME'S UP!" : "OH NO!";
      return (
        <div className="rounded-2xl p-2 sm:p-3 border border-border bg-[#2a0d0d] animate-pulse">
          <div className="flex items-center justify-center min-h-[140px] py-2">
            <div className="text-center">
              <div className="font-bold text-xl lg:text-5xl mb-2 text-[#f9ecdf] animate-bounce font-mono">
                OH NO!
              </div>
              <div className="font-base lg:text-lg text-[#f9ecdf] font-mono mb-3">
                <span className="inline-block animate-[typewriter-smooth_1.5s_ease-out]">
                  Wrong answer. Your turn is over.
                </span>
              </div>
              {wrongAnswerCard && (
                <div className="flex justify-center">
                  <div className="scale-75">
                    <TimeLineCard
                      item={wrongAnswerCard}
                      category={selectedCategory || undefined}
                      size="sm"
                      isRevealed={true}
                      isCorrect={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (lastTurnFeedback?.timeUp && lastTurnFeedback.correct === null) {
      return (
        <div className="rounded-2xl p-2 sm:p-3 border border-border bg-[#2a0d0d]">
          <div className="flex items-center justify-center h-[140px]">
            <div className="text-center">
              <div className="font-bold text-xl lg:text-5xl mb-2 text-[#f9ecdf] font-mono">
                TIME'S UP!
              </div>
              <div className="font-base lg:text-lg text-[#f9ecdf] font-mono">
                <span className="inline-block animate-[typewriter-smooth_1.5s_ease-out]">
                  Your turn is over, it's time for the next team.
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const children: React.ReactNode[] = [];
    children.push(<DropSlot key="slot-0" id="slot-0" show={showSlots} />);

    for (let i = 0; i < base.length; i++) {
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
      <div className="rounded-2xl p-2 sm:p-3 border border-[#f9ecdf] bg-[#2a0d0d] relative">
        <div className="flex items-end justify-center overflow-x-auto overflow-y-visible gap-1 sm:gap-2">
          {children}
        </div>

        {lastPlacementCorrect === true && (
          <div className="font-bold lg:text-lg text-[#f9ecdf] text-center mt-2 font-mono">



            <span className="inline-block animate-pulse">
              {lastTurnFeedback?.timeUp && lastTurnFeedback.correct === true
                ? "Time’s up. Correct!"
                : "CORRECT!"}
            </span>
          </div>
        )}

        {phase === "PLACED_PENDING" && (
          <div className="flex justify-center pt-2">
            <Button 
              size="sm" 
              onClick={confirmPlacement}
              className="bg-[#2a0d0d] text-[#f9ecdf] border border-[#f9ecdf] hover:bg-[#1a0a0a]"
            >
              Confirm placement
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderTimelineCounter = () => {
    const isActiveTurn = phase === "DRAWN" || phase === "PLACED_PENDING" || phase === "CHOICE_AFTER_CORRECT";
    const currentTimeline = isActiveTurn ? turnTimeline : (team?.timeline ?? []);
    const cardCount = currentTimeline.length;
    
    return (
      <div className="absolute top-2 left-2 z-20">
        <div className="bg-[#2a0d0d] border border-[#f9ecdf] rounded-lg px-2 py-0 lg:px-3 lg:py-1 shadow-lg">
          <span className="text-[#f9ecdf] font-mono text-xs lg:text-base">
            Card{cardCount !== 1 ? 's' : ''}: {cardCount}
          </span>
        </div>
      </div>
    );
  };

  const renderTimer = () => {
    if (phase !== "DRAWN" && phase !== "PLACED_PENDING" && phase !== "CHOICE_AFTER_CORRECT") {
      return null;
    }

    const total = settings.turnSeconds;
    const left = timer.secondsLeft;
    const elapsed = total - left;
    const pct = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));

    return (
      <div className="flex flex-col items-center gap-1 mb-1">
        <div className="font-mono tabular-nums text-sm lg:text-xl text-[#f9ecdf]">
          {String(Math.floor(left / 60)).padStart(2, "0")}:
          {String(left % 60).padStart(2, "0")}
        </div>
        <div
          className="w-24 lg:w-32 h-2 lg:h-3 rounded-full bg-muted relative"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={elapsed}
        >
          <div
            className="h-2 lg:h-3 rounded-full bg-primary absolute left-0 top-0 transition-all duration-250"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={["animate-in fade-in-50", className].join(" ")}>
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

      {phase !== "SETUP" && (
        <>
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            collisionDetection={closestCenter}
          >

            <div className="flex flex-col items-stretch gap-0.5 sm:gap-0.5">
              
              <div className="flex items-center justify-center relative">
                {renderTimer()}
              </div>
              
              <div className="min-h-[140px] relative">
                {renderTimelineCounter()}
                {renderTimeline()}
              </div>

              {phase === "DRAWN" && currentCard && lastPlacementCorrect !== false && !(lastTurnFeedback?.timeUp && lastTurnFeedback.correct === null) && (
                <div className="text-sm text-muted-foreground text-left">
                  Drag the card and drop it between two cards.
                </div>
              )}

              {phase === "DRAWN" && currentCard && lastPlacementCorrect !== false && !(lastTurnFeedback?.timeUp && lastTurnFeedback.correct === null) && (
                <div className="flex w-full justify-center">
                  <div className="origin-top scale-105 sm:scale-105">
                    <CurrentCard card={currentCard} dragging={isDragging} />
                  </div>
                </div>
              )}
            </div>

            <DragOverlay>
              {isDragging &&
              currentCard &&
              lastPlacementCorrect !== false &&
              phase !== "PLACED_WRONG" &&
              !lastTurnFeedback?.timeUp ? (
                <CurrentCardPreview card={currentCard} />
              ) : null}
            </DragOverlay>
          </DndContext>


          <div className="flex flex-wrap gap-3 pt-3 sm:pt-6 justify-center font-sans">
            {phase === "TURN_START" && lastPlacementCorrect !== false && (
              <Button 
                onClick={startTurn}
                className="bg-[#2a0d0d] text-[#f9ecdf] border border-[#f9ecdf] hover:bg-[#1a0a0a]"
              >
                Draw
              </Button>
            )}

            {phase === "CHOICE_AFTER_CORRECT" && (
              <>
                <Button 
                  onClick={drawAnother}
                  className="bg-[#2a0d0d] text-[#f9ecdf] border border-[#f9ecdf] hover:bg-[#1a0a0a]"
                >
                  Draw another
                </Button>
                <Button 
                  onClick={lockIn}
                  className="bg-[#f9ecdf] text-[#2a0d0d] border border-[#2a0d0d] hover:bg-[#f0dbc5]"
                >
                  Lock in & end turn
                </Button>
              </>
            )}

            
            {(lastPlacementCorrect === false || phase === "PLACED_WRONG" || (lastTurnFeedback?.timeUp && lastTurnFeedback.correct === null)) && (
              <Button 
                onClick={nextTeam} 
                className="w-full sm:w-auto bg-[#2a0d0d] text-[#f9ecdf] border border-[#f9ecdf] hover:bg-[#1a0a0a]"
              >
                Next Team
              </Button>
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

            <div className="text-3xl lg:text-4xl font-extrabold text-foreground">
              Congratulations!
            </div>
            <div className="mt-2 text-base lg:text-lg text-muted-foreground">
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
