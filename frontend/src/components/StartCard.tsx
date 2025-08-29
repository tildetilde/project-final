import React from "react";
import { Card, CardHeader, CardContent } from "../ui";
import type { GameItem } from "../types/game";

interface StartCardProps {
  item: GameItem;
  playerName?: string;
  className?: string;
}

const formatValue = (value: number, unit?: string, revealed = true) =>
  revealed
    ? unit
      ? `${value} ${unit}`
      : String(value)
    : unit
    ? `?? ${unit}`
    : "??";

export const StartCard: React.FC<StartCardProps> = ({
  item,
  playerName,
  className = "",
}) => (
  <Card
    className={`
      w-[136px] h-[180px] sm:w-48 sm:h-64 flex-shrink-0 flex flex-col relative overflow-hidden
      bg-gradient-to-br from-base-100 via-base-200 to-base-300
      border-2 border-primary/30 text-foreground shadow-strong
      hover:shadow-strong hover:border-primary/50 transition-all duration-300
    `}
  >
    <div className="absolute top-0 left-0 w-16 h-16 hidden sm:block">
      <div className="absolute top-2 left-2 w-12 h-12 border-2 border-primary/20 rounded-full" />
      <div className="absolute top-4 left-4 w-8 h-8 bg-primary/10 rounded-full" />
    </div>
    <div className="absolute bottom-0 right-0 w-16 h-16 rotate-180 hidden sm:block">
      <div className="absolute top-2 left-2 w-12 h-12 border-2 border-primary/20 rounded-full" />
      <div className="absolute top-4 left-4 w-8 h-8 bg-primary/10 rounded-full" />
    </div>

    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-3 py-0.5 sm:py-1 bg-primary rounded-full">
      <span className="text-[10px] sm:text-xs font-bold text-base-100 uppercase tracking-wide">
        Start
      </span>
    </div>

    <CardHeader className="relative z-10 pt-4 sm:pt-12 pb-2 sm:pb-6">
      <div className="text-3xl sm:text-5xl font-bold text-primary leading-none tracking-tight">
        {formatValue(item.value)}
      </div>
      <div className="w-12 sm:w-16 h-0.5 bg-primary/30 mt-2" />
    </CardHeader>

    <CardContent className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 pb-4 sm:pb-8">
      <div className="space-y-2 sm:space-y-3 text-center">
        <div className="text-sm sm:text-xl font-semibold text-primary leading-tight">
          {item.name}
        </div>
        <div className="text-xs sm:text-lg text-muted-foreground leading-snug">
          {playerName}
        </div>
      </div>
      {playerName && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-muted-foreground">
          {playerName}
        </div>
      )}
    </CardContent>

    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(93,49,54,0.1)_25%,rgba(93,49,54,0.1)_50%,transparent_50%,transparent_75%,rgba(93,49,54,0.1)_75%)] bg-[length:8px_8px]" />
    </div>
  </Card>
);
