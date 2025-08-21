import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card, CardHeader, CardContent } from "../ui";
import type { GameItem } from "../types/game";

export const CurrentCard: React.FC<{ card: GameItem; dragging?: boolean }> = ({
  card,
  dragging,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "current-card",
  });

  const style: React.CSSProperties | undefined = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const secondary =
    card.label && card.label.trim() !== "" && card.label !== card.name
      ? card.label
      : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-[136px] cursor-grab active:cursor-grabbing select-none ${
        dragging ? "opacity-0" : ""
      }`}
    >
      <Card className="w-[136px] h-[180px] sm:w-60 sm:h-80 overflow-hidden shadow-medium border-2 border-primary/30">
        <CardHeader className="pt-4 pb-2">
          <div className="text-xs uppercase text-muted-foreground tracking-wide">
            Place in timeline
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center gap-1">
          <div className="text-center text-base sm:text-xl font-semibold text-primary">
            {card.name}
          </div>
          <div className="text-center text-sm sm:text-base text-muted-foreground">
            {secondary}
          </div>
          <div className="mt-2 text-3xl sm:text-5xl font-bold text-primary/30">
            ?
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Preview för DragOverlay (samma look)
export const CurrentCardPreview: React.FC<{ card: GameItem }> = ({ card }) => (
  <div className="cursor-grabbing pointer-events-none">
    <Card className="w-[136px] h-[180px] sm:w-60 sm:h-80 overflow-hidden shadow-medium border-2 border-primary/30">
      <CardHeader className="pt-4 pb-2">
        <div className="text-xs uppercase text-muted-foreground tracking-wide">
          Place in timeline
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center gap-1">
        <div className="text-center text-base sm:text-xl font-semibold text-primary">
          {card.name}
        </div>
        <div className="mt-2 text-3xl sm:text-5xl font-bold text-primary/30">
          ?
        </div>
      </CardContent>
    </Card>
  </div>
);
