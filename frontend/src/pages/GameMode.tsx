// src/pages/GameMode.tsx
import React from "react";
import { OrientationGuard } from "../components/OrientationGuard";
import { GameBoard } from "../components/GameBoard";
import { CategorySelector } from "../components/CategorySelector";
import { Heading, DotPattern } from "../ui";
import { useGame } from "../store/game";

export default function GameMode() {
  const { teams, currentTeamIndex, selectedCategory, phase } = useGame();
  
  const categoryLabel = "Category";
  const categoryValue = selectedCategory?.question || "Select Category";
  const roundLabel = "Round";
  const roundValue = "1";
  const modeLabel = "Mode";
  const modeValue = "Timeline";

  const scoreA = teams[0]?.timeline.length ?? 0;
  const scoreB = teams[1]?.timeline.length ?? 0;

  const chip =
    "px-2 py-1 rounded-full bg-primary/10 border border-border text-xs tracking-wider uppercase text-muted-foreground";
  const dot = "inline-block w-2 h-2 rounded-sm bg-primary shadow-soft";

  // If no category is selected or we're in setup phase, show category selection
  if (!selectedCategory || phase === "SETUP") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <OrientationGuard minWidth={600} />
        
        <section className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-8 sm:pt-12 pb-8 flex-grow">
          <div className="absolute inset-0 pointer-events-none opacity-70">
            <DotPattern variant="diagonal" size="lg" />
          </div>

          <div className="relative z-10">
            <div className="pt-10 sm:pt-16 pb-8 sm:pb-12">
              <div className="text-xs sm:text-sm tracking-wider uppercase text-muted-foreground">
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OrientationGuard minWidth={600} />

      {/* Top-left: Category */}
      <div className="fixed z-50 top-3 sm:top-4 left-3 sm:left-6 flex items-center gap-2">
        <span className={dot} />
        <div className={chip}>
          {categoryLabel}:{" "}
          <span className="text-foreground font-semibold">{categoryValue}</span>
        </div>
      </div>

      {/* Top-right: A/B Team */}
      <div className="fixed z-50 top-3 sm:top-4 right-3 sm:right-6 flex items-center gap-2">
        <div className="flex gap-2">
          <div
            className={chip}
            aria-current={currentTeamIndex === 0 ? "true" : "false"}
          >
            A Team{" "}
            <span className="text-foreground font-semibold">{scoreA}</span>
          </div>
          <div
            className={chip}
            aria-current={currentTeamIndex === 1 ? "true" : "false"}
          >
            B Team{" "}
            <span className="text-foreground font-semibold">{scoreB}</span>
          </div>
        </div>
        <span className={dot} />
      </div>

      {/* Bottom-left: Round */}
      <div className="fixed z-50 bottom-3 sm:bottom-4 left-3 sm:left-6 flex items-center gap-2">
        <span className={dot} />
        <div className={chip}>
          {roundLabel}:{" "}
          <span className="text-foreground font-semibold">{roundValue}</span>
        </div>
      </div>

      {/* Bottom-right: Mode */}
      <div className="fixed z-50 bottom-3 sm:bottom-4 right-3 sm:right-6 flex items-center gap-2">
        <div className={chip}>
          {modeLabel}:{" "}
          <span className="text-foreground font-semibold">{modeValue}</span>
        </div>
        <span className={dot} />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-8 sm:pt-12 pb-8 flex-grow">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <DotPattern variant="diagonal" size="lg" />
        </div>

        <div className="relative z-10">
          <div className="pt-10 sm:pt-16 pb-8 sm:pb-12">
            <div className="text-xs sm:text-sm tracking-wider uppercase text-muted-foreground">
              Game Question
            </div>
            <Heading
              level={1}
              className="leading-[0.95] text-foreground"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {selectedCategory.question}
            </Heading>
            <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl">
              Arrange cards on the timeline and place the highest value at the right end.
              Unit: {selectedCategory.unit}
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
            <GameBoard />
          </div>
        </div>
      </section>
    </div>
  );
}
