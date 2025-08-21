// src/components/GameSettings.tsx
import React from "react";
import { Card, Button } from "../ui";
import { useGame } from "../store/game";

type Props = { onClose?: () => void; onContinue?: () => void };

export const GameSettings: React.FC<Props> = ({ onClose, onContinue }) => {
  const { selectedCategory } = useGame();

  const [teamA, setTeamA] = React.useState("Team A");
  const [teamB, setTeamB] = React.useState("Team B");
  const [turnTime, setTurnTime] = React.useState<30 | 60 | 90>(60);
  const [reveal, setReveal] = React.useState<"hidden" | "shown">("hidden");

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Selected: <span className="font-semibold">{selectedCategory?.question}</span>
        </div>
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            ← Back to categories
          </Button>
        )}
      </header>

      <Card className="p-4 space-y-3">
        <div className="font-semibold text-foreground">Teams</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2"
            placeholder="Team A name"
          />
          <input
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2"
            placeholder="Team B name"
          />
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="font-semibold text-foreground">Turn time</div>
        <select
          value={turnTime}
          onChange={(e) => setTurnTime(Number(e.target.value) as 30 | 60 | 90)}
          className="w-full sm:w-56 rounded-md border border-border bg-card px-3 py-2"
        >
          <option value={30}>30 seconds</option>
          <option value={60}>60 seconds</option>
          <option value={90}>90 seconds</option>
        </select>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="font-semibold text-foreground">Value & unit display</div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input type="radio" checked={reveal === "hidden"} onChange={() => setReveal("hidden")} />
            Hide until placed
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={reveal === "shown"} onChange={() => setReveal("shown")} />
            Always show ({selectedCategory?.unit})
          </label>
        </div>
      </Card>

      <div className="pt-2">
        <Button onClick={onContinue}>Continue to board</Button>
      </div>
    </div>
  );
};
