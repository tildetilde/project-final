// src/components/Timeline.tsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { TimeLineCard } from "./TimeLineCard";
import type { TrackCard } from "@/types/game";

type Size = "xs" | "sm" | "md";
const SIZES: Record<
  Size,
  { card: string; slot: string; gap: string; cardSize: Size }
> = {
  // xs ryms ~10 kort på vanliga laptop-bredder
  xs: {
    card: "w-[100px] h-[140px]",
    slot: "w-1 h-[140px]",
    gap: "gap-2",
    cardSize: "xs",
  },
  sm: {
    card: "w-[136px] h-[180px]",
    slot: "w-2 h-[180px]",
    gap: "gap-3",
    cardSize: "sm",
  },
  md: { card: "w-60 h-80", slot: "w-3 h-80", gap: "gap-6", cardSize: "md" },
};

type TimelineProps = {
  timeline: TrackCard[];
  showSlots?: boolean;
  size?: Size;
  className?: string;
};

const Slot: React.FC<{ id: string; className: string }> = ({
  id,
  className,
}) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={[
        "shrink-0 rounded-full transition-all",
        isOver ? "bg-primary/60 scale-105" : "bg-primary/25",
        className,
      ].join(" ")}
      aria-label="Place here"
    />
  );
};

export const Timeline: React.FC<TimelineProps> = ({
  timeline,
  showSlots = true,
  size = "xs",
  className,
}) => {
  const sz = SIZES[size];
  const slots = Array.from({ length: timeline.length + 1 });

  return (
    <div
      className={[
        "flex items-start overflow-x-auto overflow-y-visible",
        "pb-2",
        sz.gap,
        className,
      ].join(" ")}
    >
      {slots.map((_, i) => (
        <React.Fragment key={`slot-${i}`}>
          {showSlots && <Slot id={`slot-${i}`} className={sz.slot} />}
          {i < timeline.length && (
            <div className={`shrink-0 ${sz.card}`}>
              <TimeLineCard
                year={
                  (timeline[i] as any).year ?? (timeline[i] as any).releaseYear
                }
                artist={
                  (timeline[i] as any).artist ??
                  (timeline[i] as any).trackArtist
                }
                title={
                  (timeline[i] as any).title ?? (timeline[i] as any).trackTitle
                }
                size={sz.cardSize}
                // Är den avslöjad? I tidslinjen vill vi normalt visa årtalet.
                isRevealed
                className="w-full h-full"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
