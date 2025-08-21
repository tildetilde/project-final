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
    wrapper: "w-[100px] h-[140px]",
    value: "text-2xl",
    name: "text-[11px] font-semibold",
    label: "text-[10px]",
    badge: "w-5 h-5 text-[10px]",
    padHeader: "pt-3 pb-1",
    padContent: "px-2 pb-2",
    vspace: "space-y-1",
  },
  sm: {
    wrapper: "w-[136px] h-[180px]",
    value: "text-3xl",
    name: "text-sm font-semibold",
    label: "text-xs",
    badge: "w-6 h-6 text-xs",
    padHeader: "pt-4 pb-2",
    padContent: "px-3 pb-3",
    vspace: "space-y-2",
  },
  md: {
    wrapper: "w-60 h-80",
    value: "text-6xl",
    name: "text-2xl font-semibold",
    label: "text-xl",
    badge: "w-8 h-8 text-lg",
    padHeader: "pt-8 pb-4",
    padContent: "px-6 pb-8",
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
  const valueText = isRevealed ? formatValue(item.value, unit) : "??";

  return (
    <Card
      className={cn(
        t.wrapper,
        "flex-shrink-0 flex flex-col relative overflow-hidden",
        "bg-gradient-to-br from-accent-200 via-accent-300 to-accent-500",
        "border-accent-400 text-base-100 shadow-medium",
        isRevealed ? "" : "bg-gradient-to-br from-accent-600 to-accent-800",
        className
      )}
      aria-label={`${item.name}${item.label ? ` – ${item.label}` : ""}`}
    >
      {/* diskret mönster */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* VALUE högst upp */}
      <CardHeader className={cn("relative z-10", t.padHeader)}>
        <div
          className={cn(
            t.value,
            "font-bold text-base-100 leading-none tracking-tight"
          )}
        >
          {valueText}
        </div>
      </CardHeader>

      {/* NAMN + LABEL i mitten */}
      <CardContent
        className={cn(
          "relative z-10 flex-1 flex flex-col justify-center",
          t.padContent
        )}
      >
        <div className={cn(t.vspace, "text-center")}>
          <div className={cn(t.name, "text-base-100 leading-tight")}>
            {item.name}
          </div>
          {item.label && (
            <div className={cn(t.label, "text-base-100/90 leading-snug")}>
              {item.label}
            </div>
          )}
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
          <span className="text-white font-bold">{isCorrect ? "✓" : "✗"}</span>
        </div>
      )}

      {/* glint */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
    </Card>
  );
};
