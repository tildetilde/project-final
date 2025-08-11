// src/pages/GameMode.tsx
import React from 'react'
import { OrientationGuard } from '../components/OrientationGuard'
import { GameBoard } from '../components/GameBoard'

export default function GameMode() {
  return (
    <div className="space-y-4 sm:space-y-8">
      <OrientationGuard minWidth={600} />
      <GameBoard />
    </div>
  )
}
