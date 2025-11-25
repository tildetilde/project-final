import React from "react";
import { useNavigate } from "react-router-dom";
import { OrientationGuard } from "../components/OrientationGuard";
import { GameBoard } from "../components/GameBoard";
import { CategorySelector } from "../components/CategorySelector";
import { Heading } from "../ui";
import { ConfirmModal } from "../components/ConfirmModal";
import { useGame } from "../store/game";
import { GameSettings } from "../components/GameSettings";

export default function GameMode() {
  const navigate = useNavigate();
  const {
    teams,
    currentTeamIndex,
    selectedCategory,
    phase,
    startGame,
    resetGame,
  } = useGame();
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const infoTitleId = React.useId();
  const infoDescriptionId = `${infoTitleId}-desc`;

  const categoryLabel = "Category";
  const categoryValue = selectedCategory?.name || "Select Category";

  const scoreA = teams[0]?.timeline.length ?? 0;
  const scoreB = teams[1]?.timeline.length ?? 0;



  const chip =
    "px-2 py-1 rounded-full bg-primary/10 border border-[#f9ecdf] text-xs tracking-wider uppercase text-[#f9ecdf]";

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmHome = () => {
    resetGame();
    navigate("/");
  };

  React.useEffect(() => {
    if (!showInfo) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowInfo(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showInfo]);


if (!selectedCategory) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OrientationGuard minWidth={600} />

      <div className="fixed z-50 bottom-3 sm:bottom-4 left-3 sm:left-6 flex items-center gap-2">
        <span className="hidden sm:inline-block w-2 h-2 rounded-sm bg-[#2a0d0d] shadow-soft" />
        <button
          type="button"
          onClick={() => setShowInfo(true)}
          className="px-2 py-1 rounded-full bg-primary/10 border border-[#2a0d0d] text-xs tracking-wider uppercase text-[#2a0d0d] hover:bg-primary/15 transition"
          aria-label="Show game info"
        >
          <span className="font-semibold flex items-center gap-1">
            Info
          </span>
        </button>
      </div>

      <button
        onClick={handleHomeClick}
        className="fixed z-50 top-3 sm:top-4 left-3 sm:left-6 flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span className="hidden sm:inline-block w-2 h-2 rounded-sm bg-[#2a0d0d] shadow-soft" />
        <div className="px-2 py-1 rounded-full bg-primary/10 border border-[#2a0d0d] text-xs tracking-wider uppercase text-[#2a0d0d]">
          <span className="font-semibold">Home</span>
        </div>
      </button>

      <section className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-8 sm:pt-12 pb-8 flex-grow">
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
            <CategorySelector />
          </div>
        </div>
      </section>

      {showInfo && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={infoTitleId}
            aria-describedby={infoDescriptionId}
            className="relative z-10 w-full max-w-xl rounded-[2rem] border border-foreground/10 bg-background text-foreground shadow-strong px-6 py-5 sm:px-10 sm:py-7 space-y-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p
                  id={infoTitleId}
                  className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]"
                >
                  Game info
                </p>
                <p
                  id={infoDescriptionId}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  The goal of the game is to place 10 cards correctly according
                  to the rule for the chosen category.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.22)] backdrop-blur-sm transition hover:bg-foreground/5 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
                aria-label="Close game info"
              >
                <span aria-hidden="true" className="text-xl leading-none -mt-[1px]">
                  ×
                </span>
              </button>
            </div>

            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
              <section className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]">
                  Setup
                </p>
                <ul className="list-disc space-y-1.5 pl-4 marker:text-primary">
                  <li>
                    <span className="font-semibold text-foreground">Choose a category.</span>{" "}
                    The category decides what you are comparing, for example earlier vs later in time, lighter vs heavier,
                    shorter vs longer, or smaller vs larger values.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Form your teams.</span>{" "}
                    2–4 teams, any number of players. Each team gets one starting card that begins their line.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Pick turn time.</span>{" "}
                    Decide whether each turn should be 30, 60, or 90 seconds.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]">
                  Your turn
                </p>
                <ol className="space-y-1.5 pl-5 list-decimal">
                  <li>Draw the next card.</li>
                  <li>Decide where it belongs on your team’s line based on the category rule.</li>
                  <li>Place the card and confirm your choice.</li>
                </ol>
                <p>
                  <span className="font-semibold text-foreground">Correct:</span> The card stays on the line.{" "}
                  <span className="font-semibold text-foreground">Incorrect:</span> The card is discarded.
                </p>
              </section>

              <section className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]">
                  End of round
                </p>
                <p>
                  The first team with <span className="font-semibold text-foreground">10 correct cards</span> on their line
                  wins the round.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmHome}
        title="Back to Home?"
        message="Are you sure you want to return to the home page?"
        confirmText="Yes, go Home"
        cancelText="Stay here"
      />
    </div>
  );
}



  return (
    <div className={`min-h-screen flex flex-col ${phase === "SETUP" ? "bg-background" : "bg-[#2a0d0d]"}`}>
      <OrientationGuard minWidth={600} />

      {phase !== "SETUP" && (
        <div className="fixed z-50 bottom-3 sm:bottom-4 left-3 sm:left-6 flex items-center gap-2">
          <span className="hidden sm:inline-block w-2 h-2 rounded-sm bg-[#f9ecdf] shadow-soft" />
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="px-2 py-1 rounded-full bg-primary/10 border border-[#f9ecdf] text-xs tracking-wider uppercase text-[#f9ecdf] hover:bg-primary/15 transition"
            aria-label="Show game info"
          >
            <span className="text-[#f9ecdf] font-semibold flex items-center gap-1">
              Info
            </span>
          </button>
        </div>
      )}

      {phase !== "SETUP" && (
        <button
          onClick={handleHomeClick}
          className="absolute z-50 top-3 sm:top-4 left-3 sm:left-6 flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="hidden sm:inline-block w-2 h-2 rounded-sm bg-[#f9ecdf] shadow-soft" />
          <div className="px-2 py-1 rounded-full bg-primary/10 border border-[#f9ecdf] text-xs tracking-wider uppercase text-[#f9ecdf]">
            <span className="text-[#f9ecdf] font-semibold">Home</span>
          </div>
        </button>
      )}

      {phase !== "SETUP" && (
        <div className="absolute z-50 top-3 sm:top-4 right-3 sm:right-6 flex items-center gap-2">
          <div className="sr-only" aria-live="polite">
            {teams[currentTeamIndex]?.name} is playing
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 lg:gap-4 items-end sm:items-center">
            {teams.map((t, i) => {
              const active = currentTeamIndex === i;
              return (
                <div
                  key={t.id ?? i}
                  className={
                    active
                      ? "px-2 py-1 rounded-full bg-[#f9ecdf] text-[#2a0d0d] border border-[#f9ecdf] text-xs tracking-wider uppercase text-right sm:text-center scale-105 animate-pulse animate-pulsate"
                      : "px-2 py-1 rounded-full bg-primary/10 sm:border border-[#f9ecdf] text-[#f9ecdf] text-xs tracking-wider uppercase text-right sm:text-center"
                  }
                  style={
                    active
                      ? {
                          boxShadow:
                            "0 4px 8px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2), 0 16px 32px rgba(0, 0, 0, 0.1)",
                        }
                      : {}
                  }
                  aria-current={active ? "true" : "false"}
                >
                  {t.name}{" "}
                  <span
                    className={
                      active ? "font-semibold" : "font-semibold"
                    }
                  >
                    {t.timeline?.length ?? 0}
                  </span>
                </div>
              );
            })}
          </div>
          <span className="hidden sm:inline-block w-2 h-2 rounded-sm bg-[#f9ecdf] shadow-soft" />
        </div>
      )}

      {phase !== "SETUP" && (
        <div className="fixed z-50 bottom-3 sm:bottom-4 right-3 sm:right-6 flex items-center gap-2">
          <div className={chip}>
            {categoryLabel}:{" "}
            <span className="text-[#f9ecdf] font-semibold">{categoryValue}</span>
          </div>
          <span className="hidden sm:inline-block w-2 h-2 rounded-sm bg-[#f9ecdf] shadow-soft" />
        </div>
      )}

      <section className="relative w-full px-4 sm:px-8 pt-8 sm:pt-12 pb-8 flex-grow">
        <div className="relative z-10">
          {phase === "SETUP" ? (
            <>
              <div className="pb-6 sm:pb-8">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 [font-family:var(--font-family-sans)]">
                    GAME SETTINGS
                  </h2>
                  <p className="text-muted-foreground [font-family:var(--font-family-mono)]">
                    Configure your match
                  </p>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
                <GameSettings
                  onClose={() =>
                    navigate("/", { state: { scrollTo: "categories" } })
                  }
                  onContinue={() => startGame()}
                />
              </div>
            </>
          ) : (
            <>

              <div className="pt-4 sm:pt-2 lg:pt-8 pb-4 sm:pb-2 lg:pb-8">
                <div className="hidden mb-2 lg:block text-xs tracking-wider uppercase text-[#fefcfa] font-mono">
                  Game Question
                </div>
                <Heading
                  level={1}

                  className="leading-[0.95] text-[#f9ecdf]"
                  style={{
                    fontSize: "clamp(1rem, 3vw, 4rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selectedCategory.question}
                </Heading>
              </div>

              <div className="w-full px-0 sm:px-0">
                <GameBoard />
              </div>
            </>
          )}
        </div>
      </section>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmHome}
        title="End Game?"
        message="Are you sure you want to end the current game and return to the home page? All progress will be lost."
        confirmText="Yes, End Game"
        cancelText="Continue Playing"
      />

      {showInfo && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={infoTitleId}
            aria-describedby={infoDescriptionId}
            className="relative z-10 w-full max-w-xl rounded-[2rem] border border-foreground/10 bg-background text-foreground shadow-strong px-6 py-5 sm:px-10 sm:py-7 space-y-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p
                  id={infoTitleId}
                  className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]"
                >
                  Game info
                </p>
                <p
                  id={infoDescriptionId}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
The goal of the game is to be the first team to place 10 cards in the correct order on your line, based on the rule for the chosen category.

                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.22)] backdrop-blur-sm transition hover:bg-foreground/5 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
                aria-label="Close game info"
              >
                <span aria-hidden="true" className="text-xl leading-none -mt-[1px]">
                  ×
                </span>
              </button>
            </div>

            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">

              <section className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]">
                  Your turn
                </p>
                <ol className="space-y-1.5 pl-5 list-decimal">
                  <li>Draw the next card.</li>
                  <li>Decide where it belongs on your team’s line based on the category rule.</li>
                  <li>On the line, the lowest value goes on the left and the highest on the right.</li>
                  <li>Place the card and confirm your choice.</li>
                </ol>
                <p>
                  <span className="font-semibold text-foreground">Correct:</span> The card stays on the line.{" "}
                  <span className="font-semibold text-foreground">Incorrect:</span> The card is discarded.
                </p>
              </section>

              <section className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground [font-family:var(--font-family-mono)]">
                  End of round
                </p>
                <p>
                  The first team with <span className="font-semibold text-foreground">10 correct cards</span> on their line wins
                  the round.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
