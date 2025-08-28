import React from "react";
import { Card, Button } from "../ui";
import { useGame } from "../store/game";

type Props = { onClose?: () => void; onContinue?: () => void };

export const GameSettings: React.FC<Props> = ({ onClose, onContinue }) => {
  const {
    selectedCategory,
    settings,
    setTeamCount,
    setTeamName,
    setTurnSeconds,
    setRevealMode,
    applySettings,
  } = useGame();

  const handleContinue = () => {
    applySettings();
    onContinue?.();
  };

  return (
    <div className=" space-y-4 md:space-y-6 w-full max-w-xs md:max-w-md lg:max-w-xl mx-auto">
      <header className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground" aria-live="polite">
          {settings.teamNames.length} teams • {settings.turnSeconds}s per turn
        </div>
      </header>

      <Card className="p-4 space-y-2 md:space-y-4 ">
        <div className="font-semibold">Teams</div>

        <div className="flex items-center gap-3">
          <label htmlFor="teamCount" className="text-sm text-muted-foreground">
            Number of teams
          </label>
          <select
            id="teamCount"
            value={settings.teamNames.length}
            onChange={(e) => setTeamCount(Number(e.target.value))}
            className="rounded-md border border-border bg-card px-3 py-2"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-3" role="list">
          {settings.teamNames.map((name, i) => (
            <input
              key={i}
              role="listitem"
              value={name}
              onChange={(e) => setTeamName(i, e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-2"
              placeholder={`Team ${i + 1} name`}
            />
          ))}
        </div>
      </Card>

      <Card className="p-4 space-y-2 md:space-y-4">
        <div className="font-semibold">Turn time</div>
        <select
          aria-label="Turn time in seconds"
          value={settings.turnSeconds}
          onChange={(e) =>
            setTurnSeconds(Number(e.target.value) as 30 | 60 | 90)
          }
          className="w-full md:w-56 rounded-md border border-border bg-card px-3 py-2"
        >
          <option value={30}>30 seconds</option>
          <option value={60}>60 seconds</option>
          <option value={90}>90 seconds</option>
        </select>
      </Card>

      <div className="mt-2 flex flex-wrap items-center gap-2 md:gap-5 justify-between">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Back to categories
          </Button>
        )}

        <Button onClick={handleContinue}>Continue to board</Button>
      </div>
    </div>
  );
};
