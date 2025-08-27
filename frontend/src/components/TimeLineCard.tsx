import React from "react";
import { Card, CardHeader, CardContent } from "../ui";
import { cn } from "../lib/utils";

import type { GameItem, GameCategory } from "../types/game";

type CardSize = "xs" | "sm" | "md";

const TOKENS: Record<
  CardSize,
  {
    wrapper: string;
    value: string;
    name: string;
    label: string;
    badge: string;
    padHeader: string;
    padContent: string;
    vspace: string;
  }
> = {
  xs: {
    wrapper: "w-[120px] h-[169px]",
    value: "text-2xl",
    name: "text-base font-semibold",
    label: "text-[10px]",
    badge: "w-5 h-5 text-[10px]",
    padHeader: "pt-2 pb-1 px-2",
    padContent: "px-2 pb-2",
    vspace: "space-y-1",
  },
  sm: {
    wrapper: "w-[164px] h-[217px]",
    value: "text-3xl",
    name: "text-lg font-semibold",
    label: "text-xs",
    badge: "w-6 h-6 text-xs",
    padHeader: "pt-3 pb-2 px-3",
    padContent: "px-3 pb-3",
    vspace: "space-y-2",
  },
  md: {
    wrapper: "w-[290px] h-[387px]",
    value: "text-6xl",
    name: "text-6xl font-semibold",
    label: "text-3xl font-medium",
    badge: "w-8 h-8 text-lg",
    padHeader: "pt-6 pb-4 px-6",
    padContent: "px-6 pb-6",
    vspace: "space-y-4",
  },
};

interface TimeLineCardProps {
  item: GameItem;
  category?: GameCategory; // för unit (t.ex. "kg", "year" etc.)
  isCorrect?: boolean;
  isRevealed?: boolean;
  className?: string;
  size?: CardSize;
}

/** Enkel formattering av value + unit (ingen i18n-tyngd här) */
const formatValue = (value: number, unit?: string) => {
  if (!unit) return String(value);
  // Exempel: 150000 kg • 1958 year
  return `${value} ${unit}`;
};

export const TimeLineCard: React.FC<TimeLineCardProps> = ({
  item,
  category,
  isCorrect,
  isRevealed,
  className,
  size = "sm",
}) => {
  const t = TOKENS[size];
  const unit = category?.unit;
  const unitVisible = category?.unitVisible ?? true;

  // Use responsive sizing for sm size to match CurrentCard
  const responsiveWrapper =
    size === "sm" ? "w-[120px] h-[169px] sm:w-[164px] sm:h-[217px]" : t.wrapper;

  return (
          <Card
        className={cn(
          responsiveWrapper,
          "flex-shrink-0 flex flex-col relative overflow-hidden p-0",
          isCorrect === false ? "bg-[#2a0d0d] border-[#f9ecdf]" : "bg-[#f9ecdf]",
          "border-accent-400 text-base-100 shadow-medium",
          className
        )}
      aria-label={`${item.name}${item.label ? ` – ${item.label}` : ""}`}
    >
      {/* diskret mönster - removed for better visibility */}

      {/* NAMN i mitten */}
      <CardContent
        className={cn(
          "relative z-10 flex-1 flex flex-col justify-center ",
          t.padContent
        )}
      >
        <div className={cn(t.vspace, "text-center")}>
          {/* VALUE + UNIT */}
          <div className={cn(t.value, isCorrect === false ? "text-[#f9ecdf]" : "text-[#2a0d0d]", "leading-tight font-bold font-mono")}>
            {isRevealed ? formatValue(item.value, unit) : "??"}
          </div>

          {/* NAME */}
          <div className={cn(t.name, isCorrect === false ? "text-[#f9ecdf]" : "text-[#2a0d0d]", "leading-tight font-mono")}>
            {item.name}
          </div>
        </div>
      </CardContent>

      {/* Rätt/Fel-badge (om vi vill visa feedback) */}
      {isCorrect !== undefined && (
        <div
          className={cn(
            "absolute top-2 right-2 rounded-full flex items-center justify-center",
            t.badge,
            isCorrect ? "bg-green-500" : "bg-red-500"
          )}
          aria-label={isCorrect ? "Correct placement" : "Incorrect placement"}
        >
          <span className="text-white [font-family:var(--font-family-mono)]">
            {isCorrect ? "✓" : "✗"}
          </span>
        </div>
      )}

      {/* glint - removed for better visibility */}
    </Card>
  );
};
