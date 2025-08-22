import type { GameCategory, GameItem } from './game';

export interface Admin {
  id: string;
  username: string;
  email: string;
  lastLogin?: string;
}

// Re-export the types from game.ts for convenience
export type Category = GameCategory;
export type Item = GameItem;
