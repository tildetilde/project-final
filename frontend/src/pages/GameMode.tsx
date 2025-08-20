// src/pages/GameMode.tsx
import React from "react";
import { OrientationGuard } from "../components/OrientationGuard";
import { GameBoard } from "../components/GameBoard";
import { Heading, DotPattern } from "../ui";

export default function GameMode() {
  // justera fritt
  const teamLabel = "Team";
  const teamValue = "A vs B";
  const categoryLabel = "Category";
  const categoryValue = "Animals";
  const roundLabel = "Round";
  const roundValue = "1";
  const modeLabel = "Mode";
  const modeValue = "Timeline";

  return (
    <div className="min-h-screen bg-background">
      <OrientationGuard minWidth={600} />

      {/* REPORT-lik hero utan vit ruta */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-8 mt-6 sm:mt-10 pb-8 flex-grow">
        {/* subtilt mönster */}
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <DotPattern variant="diagonal" size="lg" />
        </div>

        {/* hörnmarkörer */}
        <div className="relative z-10">
          {/* top-left */}
          <div className="absolute -top-2 sm:-top-3 -left-1 sm:-left-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-sm bg-primary shadow-soft" />
            <div className="px-2 py-1 rounded-full bg-primary/10 border border-border text-xs tracking-wider uppercase text-muted-foreground">
              {teamLabel}:{" "}
              <span className="text-foreground font-semibold">{teamValue}</span>
            </div>
          </div>
          {/* top-right */}
          <div className="absolute -top-2 sm:-top-3 -right-1 sm:-right-2 flex items-center gap-2">
            <div className="px-2 py-1 rounded-full bg-primary/10 border border-border text-xs tracking-wider uppercase text-muted-foreground">
              {categoryLabel}:{" "}
              <span className="text-foreground font-semibold">
                {categoryValue}
              </span>
            </div>
            <span className="inline-block w-2 h-2 rounded-sm bg-primary shadow-soft" />
          </div>
          {/* bottom-left */}
          <div className="absolute -bottom-2 sm:-bottom-3 -left-1 sm:-left-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-sm bg-primary shadow-soft" />
            <div className="px-2 py-1 rounded-full bg-primary/10 border border-border text-xs tracking-wider uppercase text-muted-foreground">
              {roundLabel}:{" "}
              <span className="text-foreground font-semibold">
                {roundValue}
              </span>
            </div>
          </div>
          {/* bottom-right */}
          <div className="absolute -bottom-2 sm:-bottom-3 -right-1 sm:-right-2 flex items-center gap-2">
            <div className="px-2 py-1 rounded-full bg-primary/10 border border-border text-xs tracking-wider uppercase text-muted-foreground">
              {modeLabel}:{" "}
              <span className="text-foreground font-semibold">{modeValue}</span>
            </div>
            <span className="inline-block w-2 h-2 rounded-sm bg-primary shadow-soft" />
          </div>

          {/* själva rubriken + tagline */}
          <div className="pt-10 sm:pt-16 pb-8 sm:pb-12">
            <div className="text-xs sm:text-sm tracking-wider uppercase text-muted-foreground">
              Game Question
            </div>

            <Heading
              level={1}
              className="leading-[0.95] text-foreground"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Which animal weighs the most?
            </Heading>

            <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl">
              Arrange cards on the timeline and place the heaviest at the right
              end.
            </p>
          </div>
        </div>
      </section>

      {/* SPEL-VYN – exakt som innan */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <GameBoard />
      </div>
    </div>
  );
}
