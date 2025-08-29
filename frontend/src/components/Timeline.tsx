import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { TimeLineCard } from "./TimeLineCard";
import type { GameItem, GameCategory } from "../types/game";

type Size = "xs" | "sm" | "md";
const SIZES: Record<
  Size,
  { card: string; slot: string; gap: string; cardSize: Size }
> = {
  xs: {
    card: "w-[100px] h-[140px]",
    slot: "w-1 h-[140px]",
    gap: "gap-0.5",
    cardSize: "xs",
  },
  sm: {
    card: "w-[136px] h-[180px]",
    slot: "w-2 h-[180px]",
    gap: "gap-1",
    cardSize: "sm",
  },
  md: { 
    card: "w-60 h-80", 
    slot: "w-3 h-80", 
    gap: "gap-1.5", 
    cardSize: "md" },
};

type TimelineProps = {
  timeline: GameItem[];
  category?: GameCategory;
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
  category,
  showSlots = true,
  size = "md",
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
                item={timeline[i]}
                category={category}
                size={sz.cardSize}
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
