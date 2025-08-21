// src/components/GameSettings.tsx
import React from "react";
import { CategorySelector } from "./CategorySelector";
import { Card } from "../ui";
import { useGame } from "../store/game";

export const GameSettings: React.FC = () => {
  const { selectedCategory } = useGame();

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-2xl font-bold">Game settings</h1>
        <p className="text-muted-foreground">
          Choose a category to get started.
        </p>
      </header>

      {/* Kategorier (återanvänder din befintliga logik) */}
      <CategorySelector />

      {/* Plats för kommande inställningar (lag, svårighet m.m.) */}
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">
          <strong>Upcoming:</strong> Teams, difficulty, round length…
          {selectedCategory && (
            <div className="mt-2">
              Selected: <span className="font-medium">{selectedCategory.question}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
