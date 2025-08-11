// src/components/Timeline.tsx
import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TimeLineCard } from './TimeLineCard'
import type { TrackCard } from '@/types/game'

type Size = 'sm' | 'md' | 'lg'
const SIZES: Record<Size, { card: string; slot: string; gap: string }> = {
  sm: { card: 'w-[136px] h-[180px]', slot: 'w-2 h-[180px]', gap: 'gap-3' },
  md: { card: 'w-48 h-64',           slot: 'w-3 h-64',       gap: 'gap-6' },
  lg: { card: 'w-60 h-80',           slot: 'w-3 h-80',       gap: 'gap-10' },
}

type TimelineProps = {
  timeline: TrackCard[]
  showSlots?: boolean
  size?: Size
}

const Slot: React.FC<{ id: string; className: string }> = ({ id, className }) => {
  const { isOver, setNodeRef } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={[
        'shrink-0 rounded-full transition-all',
        isOver ? 'bg-primary/60 scale-105' : 'bg-primary/25',
        className,
      ].join(' ')}
      aria-label="Place here"
    />
  )
}

export const Timeline: React.FC<TimelineProps> = ({ timeline, showSlots = true, size = 'md' }) => {
  const sz = SIZES[size]
  const slots = Array.from({ length: timeline.length + 1 })

  return (
    <div className={`-mx-4 px-4 flex items-center overflow-x-auto pb-4 snap-x ${sz.gap}`}>
      {slots.map((_, i) => (
        <React.Fragment key={`slot-${i}`}>
          {showSlots && <Slot id={`slot-${i}`} className={sz.slot} />}
          {i < timeline.length && (
            <div className={`shrink-0 snap-start ${sz.card}`}>
              <TimeLineCard
                year={timeline[i].year}
                artist={timeline[i].artist}
                title={timeline[i].title}
                className="w-full h-full" // ⟵ fyll wrappern
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
