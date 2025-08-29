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

if (!selectedCategory) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OrientationGuard minWidth={600} />

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
        <button
          onClick={handleHomeClick}
          className="fixed z-50 top-3 sm:top-4 left-3 sm:left-6 flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="hidden sm:inline-block w-2 h-2 rounded-sm bg-[#f9ecdf] shadow-soft" />
          <div className="px-2 py-1 rounded-full bg-primary/10 border border-[#f9ecdf] text-xs tracking-wider uppercase text-[#f9ecdf]">
            <span className="text-[#f9ecdf] font-semibold">Home</span>
          </div>
        </button>
      )}

      {phase !== "SETUP" && (
        <div className="fixed z-50 top-3 sm:top-4 right-3 sm:right-6 flex items-center gap-2">
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
        <div className="fixed z-50 bottom-3 sm:bottom-4 left-3 sm:left-6 flex items-center gap-2">
          <span className="hidden sm:inline-block w-2 h-2 rounded-sm bg-[#f9ecdf] shadow-soft" />
          <div className={chip}>
            {roundLabel}:{" "}
            <span className="text-[#f9ecdf] font-semibold">{roundValue}</span>
          </div>
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
                <div className="hidden mb-2 lg:block text-xs tracking-wider uppercase text-[#fefcfa] font-mono text-center">
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
    </div>
  );
}
