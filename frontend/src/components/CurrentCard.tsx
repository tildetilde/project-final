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
      className={`w-[90px] lg:w-48 cursor-grab active:cursor-grabbing select-none ${
        dragging ? "opacity-0" : ""
      }`}
    >
      <Card className="w-[90px] h-[127px] lg:w-[164px] lg:h-[217px] overflow-hidden shadow-medium border-2 border-primary/30 bg-[#f9ecdf] p-0">
        <CardHeader className="pt-2 pb-1 lg:pt-6 lg:pb-3 space-y-3">
          <div className="text-[10px] lg:text-xs uppercase text-muted-foreground tracking-wide text-center">
            Place in timeline
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center gap-0 px-1 lg:px-2">
          <div className="text-center text-sm lg:text-2xl font-semibold text-primary break-normal px-1 lg:px-2 w-full leading-tight flex justify-center font-mono">
            <span className="text-center">{card.name}</span>
          </div>
          <div className="mt-1 lg:mt-2 text-xl lg:text-4xl font-bold text-primary/30 font-mono">
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
    <Card className="w-[90px] h-[127px] lg:w-[164px] lg:h-[217px] overflow-hidden shadow-medium border-2 border-primary/30 bg-[#f9ecdf] p-0">
              <CardHeader className="pt-2 pb-1 lg:pt-6 lg:pb-3 space-y-3">
          <div className="text-[10px] lg:text-xs uppercase text-muted-foreground tracking-wide text-center">
            Place in timeline
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center gap-0 lg:gap-1 px-1 lg:px-2">
          <div className="text-center text-sm lg:text-2xl font-semibold text-primary break-normal px-1 lg:px-2 w-full leading-tight flex justify-center font-mono">
            <span className="text-center">{card.name}</span>
          </div>
          <div className="mt-1 lg:mt-2 text-xl lg:text-3xl font-bold text-primary/30 font-mono">
            ?
          </div>
        </CardContent>
    </Card>
  </div>
);
