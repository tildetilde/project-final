import React from "react";
import { Card, CardContent } from "../ui";
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
    wrapper: "w-[90px] h-[127px]",
    value: "text-xl",
    name: "text-sm font-semibold",
    label: "text-[9px]",
    badge: "w-4 h-4 text-[9px]",
    padHeader: "pt-1.5 pb-0.5 px-1.5",
    padContent: "px-1.5 pb-1.5",
    vspace: "space-y-0.5",
  },
  sm: {
    wrapper: "w-[90px] h-[127px] lg:w-[164px] lg:h-[217px]",
    value: "text-xl lg:text-3xl",
    name: "text-sm lg:text-lg font-semibold",
    label: "text-[9px] lg:text-xs",
    badge: "w-4 h-4 lg:w-6 lg:h-6 text-[9px] lg:text-xs",
    padHeader: "pt-1.5 pb-0.5 px-1.5 lg:pt-3 lg:pb-2 lg:px-3",
    padContent: "px-1.5 pb-1.5 lg:px-3 lg:pb-3",
    vspace: "space-y-0.5 lg:space-y-2",
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
  category?: GameCategory;
  isCorrect?: boolean;
  isRevealed?: boolean;
  className?: string;
  size?: CardSize;
}

const formatValue = (value: number, unit?: string) => {
  if (!unit) return String(value);
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
  const displayUnit = unitVisible ? unit : undefined;

  const responsiveWrapper =
    size === "sm" ? "w-[90px] h-[127px] lg:w-[164px] lg:h-[217px]" : t.wrapper;

  return (
          <Card
        className={cn(
          responsiveWrapper,
          "flex-shrink-0 flex flex-col relative overflow-hidden p-0",
          isCorrect === false ? "bg-[#2a0d0d] border-[#e1c09e]" : "bg-[#fdf8f3]",
          "border-accent-400 text-base-100 shadow-medium",
          className
        )}
      aria-label={`${item.name}${item.label ? ` – ${item.label}` : ""}`}
    >
      <CardContent
        className={cn(
          "relative z-10 flex-1 flex flex-col justify-center ",
          t.padContent
        )}
      >
        <div className={cn(t.vspace, "text-center")}>
          <div className={cn(t.value, isCorrect === false ? "text-[#f9ecdf]" : "text-[#2a0d0d]", "leading-tight font-bold font-mono")}>
            {isRevealed ? formatValue(item.value, displayUnit) : "??"}
          </div>

          <div className={cn(t.name, isCorrect === false ? "text-[#f9ecdf]" : "text-[#2a0d0d]", "leading-tight font-mono break-words hyphens-auto")}>
            {item.name}
          </div>
        </div>
      </CardContent>

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

    </Card>
  );
};
