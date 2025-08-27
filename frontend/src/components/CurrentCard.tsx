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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-[102px] sm:w-48 cursor-grab active:cursor-grabbing select-none ${
        dragging ? "opacity-0" : ""
      }`}
    >
      <Card className="w-[120px] h-[169px] sm:w-[164px] sm:h-[217px] overflow-hidden shadow-medium border-2 border-primary/30">
        <CardHeader className="pt-1 pb-1">
          <div className="text-xs uppercase text-muted-foreground tracking-wide text-center">
            Place in timeline
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center gap-0 px-2">
          <div className="text-center text-base sm:text-2xl font-semibold text-primary break-normal px-2 w-full leading-tight flex justify-center">
            <span className="text-center">{card.name}</span>
          </div>
          <div className="mt-2 text-2xl sm:text-4xl font-bold text-primary/30">
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
    <Card className="w-[120px] h-[169px] sm:w-[164px] sm:h-[217px] overflow-hidden shadow-medium border-2 border-primary/30">
      <CardHeader className="pt-2 pb-2">
        <div className="text-xs uppercase text-muted-foreground tracking-wide text-center">
          Place in timeline
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center gap-1 px-2">
        <div className="text-center text-base sm:text-2xl font-semibold text-primary break-normal px-2 w-full leading-tight flex justify-center">
          <span className="text-center">{card.name}</span>
        </div>
        <div className="mt-2 text-xl sm:text-3xl font-bold text-primary/30">
          ?
        </div>
      </CardContent>
    </Card>
  </div>
);
