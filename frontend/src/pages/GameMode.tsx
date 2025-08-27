import React from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const categoryLabel = "Category";
  const categoryValue = selectedCategory?.name || "Select Category";
  const roundLabel = "Round";
  const roundValue = "1";

  const scoreA = teams[0]?.timeline.length ?? 0;
  const scoreB = teams[1]?.timeline.length ?? 0;



  const chip =
    "px-2 py-1 rounded-full bg-primary/10 border border-[#f9ecdf] text-xs tracking-wider uppercase text-[#f9ecdf]";
  const dot = "inline-block w-2 h-2 rounded-sm bg-[#f9ecdf] shadow-soft";

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmHome = () => {
    resetGame();
    navigate("/");
  };

  // --- 1) Fallback: ingen kategori vald ---
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <OrientationGuard minWidth={600} />
        <section className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-8 sm:pt-12 pb-8 flex-grow">
          <div className="relative z-10">
            <div className="pt-10 sm:pt-16 pb-8 sm:pb-12">
              <div className="text-xs sm:text-sm tracking-wider uppercase text-muted-foreground text-[var(--color-base-100)]">
                Choose Your Game
              </div>
              <Heading
                level={1}
                className="leading-[0.95] text-foreground"
                style={{
                  fontSize: "clamp(2rem, 6vw, 4.5rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Select a Category
              </Heading>
              <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl">
                Choose a category to start playing the timeline game.
              </p>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
              <CategorySelector />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // --- 2) Vanliga GameMode-chrome (samma i SETUP och under spelet) ---
  return (
    <div className={`min-h-screen flex flex-col ${phase === "SETUP" ? "bg-background" : "bg-[#2a0d0d]"}`}>
      <OrientationGuard minWidth={600} />

      {/* Top-left: Home */}
      <button
        onClick={handleHomeClick}
        className="fixed z-50 top-3 sm:top-4 left-3 sm:left-6 flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span className={dot} />
        <div className={chip}>
          <span className="text-[#f9ecdf] font-semibold">Home</span>
        </div>
      </button>

      {/* Top-right: A/B Team */}
      <div className="fixed z-50 top-3 sm:top-4 right-3 sm:right-6 flex items-center gap-2">
        <div className="sr-only" aria-live="polite">
          {teams[currentTeamIndex]?.name} is playing
        </div>
        <div className="flex gap-2">
          {teams.map((t, i) => {
            const active = currentTeamIndex === i;
            const base =
              "px-2 py-1 rounded-full border text-xs tracking-wider uppercase";
            const cls = active
              ? `${base} bg-[#f9ecdf] text-[#2a0d0d] border-[#f9ecdf] scale-105 animate-pulse animate-pulsate`
              : `${base} bg-primary/10 border-[#f9ecdf] text-[#f9ecdf]`;
            return (
              <div
                key={t.id ?? i}
                className={cls}
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
                    active ? "font-semibold" : "text-[#f9ecdf] font-semibold"
                  }
                >
                  {t.timeline?.length ?? 0}
                </span>
              </div>
            );
          })}
        </div>
        <span className={dot} />
      </div>



      {/* Bottom-left: Round */}
      <div className="fixed z-50 bottom-3 sm:bottom-4 left-3 sm:left-6 flex items-center gap-2">
        <span className={dot} />
        <div className={chip}>
          {roundLabel}:{" "}
          <span className="text-[#f9ecdf] font-semibold">{roundValue}</span>
        </div>
      </div>

      {/* Bottom-right: Category */}
      <div className="fixed z-50 bottom-3 sm:bottom-4 right-3 sm:right-6 flex items-center gap-2">
        <div className={chip}>
          {categoryLabel}:{" "}
          <span className="text-[#f9ecdf] font-semibold">{categoryValue}</span>
        </div>
        <span className={dot} />
      </div>

      {/* Innehållssektion med DotPattern – växla mellan SETUP (Settings) och Board */}
      <section className="relative w-full px-4 sm:px-8 pt-8 sm:pt-12 pb-8 flex-grow">
        <div className="relative z-10">
          {phase === "SETUP" ? (
            <>
              <div className="pt-6 sm:pt-8 pb-6 sm:pb-8">
                <div className="text-xs sm:text-sm tracking-wider uppercase text-muted-foreground text-center">
                  Game Settings
                </div>
                {/* <Heading
                  level={1}
                  className="leading-[0.95] text-foreground text-center"
                  style={{
                    fontSize: "clamp(2rem, 3vw, 4rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Configure your match
                </Heading> */}
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

              <div className="pt-6 sm:pt-8 pb-6 sm:pb-6 text-center">
                <div className="text-xs sm:text-sm tracking-wider uppercase text-[#fefcfa]">
                  Game Question
                </div>
                <Heading
                  level={1}

                  className="leading-[0.95] text-[#f9ecdf]"
                  style={{
                    fontSize: "clamp(2rem, 3vw, 4rem)",
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmHome}
        title="End Game?"
        message="Are you sure you want to end the current game and return to the home page? All progress will be lost."
        confirmText="Yes, End Game"
        cancelText="Continue Playing"
      />
    </div>
  );
}
