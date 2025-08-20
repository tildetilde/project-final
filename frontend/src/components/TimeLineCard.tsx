import React from "react";
import { Card, CardHeader, CardContent } from "../ui";
import { cn } from "../lib/utils";

type CardSize = "xs" | "sm" | "md";

const TOKENS: Record<
  CardSize,
  {
    wrapper: string;
    year: string;
    artist: string;
    title: string;
    badge: string;
    padHeader: string;
    padContent: string;
    vspace: string;
  }
> = {
  xs: {
    wrapper: "w-[100px] h-[140px]",
    year: "text-2xl",
    artist: "text-[11px] font-semibold",
    title: "text-[10px]",
    badge: "w-5 h-5 text-[10px]",
    padHeader: "pt-3 pb-1",
    padContent: "px-2 pb-2",
    vspace: "space-y-1",
  },
  sm: {
    wrapper: "w-[136px] h-[180px]",
    year: "text-3xl",
    artist: "text-sm font-semibold",
    title: "text-xs",
    badge: "w-6 h-6 text-xs",
    padHeader: "pt-4 pb-2",
    padContent: "px-3 pb-3",
    vspace: "space-y-2",
  },
  md: {
    wrapper: "w-60 h-80",
    year: "text-6xl",
    artist: "text-2xl font-semibold",
    title: "text-xl",
    badge: "w-8 h-8 text-lg",
    padHeader: "pt-8 pb-4",
    padContent: "px-6 pb-8",
    vspace: "space-y-4",
  },
};

interface TimeLineCardProps {
  year: number;
  artist: string;
  title: string;
  isCorrect?: boolean;
  isRevealed?: boolean;
  className?: string;
  size?: CardSize; // ← NYTT
}

export const TimeLineCard: React.FC<TimeLineCardProps> = ({
  year,
  artist,
  title,
  isCorrect,
  isRevealed,
  className,
  size = "sm",
}) => {
  const t = TOKENS[size];

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
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <CardHeader className={cn("relative z-10", t.padHeader)}>
        <div
          className={cn(
            t.year,
            "font-bold text-base-100 leading-none tracking-tight"
          )}
        >
          {isRevealed ? year : "??"}
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "relative z-10 flex-1 flex flex-col justify-center",
          t.padContent
        )}
      >
        <div className={cn(t.vspace, "text-center")}>
          <div className={cn(t.artist, "text-base-100 leading-tight")}>
            {artist}
          </div>
          <div className={cn(t.title, "text-base-100/90 leading-snug")}>
            {title}
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
        >
          <span className="text-white font-bold">{isCorrect ? "✓" : "✗"}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
    </Card>
  );
};
