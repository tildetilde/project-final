import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TimeLineCard } from './TimeLineCard'
import type { TrackCard } from '../types/game'

const Slot: React.FC<{ id: string }> = ({ id }) => {
  const { isOver, setNodeRef } = useDroppable({ id })
  return (
    <div ref={setNodeRef}
         className={`shrink-0 w-3 sm:w-4 h-28 sm:h-36 rounded-full
         ${isOver ? 'bg-primary/50' : 'bg-primary/20'} transition-colors`} />
  )
}

export const Timeline: React.FC<{
  timeline: TrackCard[]
  showSlots?: boolean
}> = ({ timeline, showSlots = true }) => {
  const slots = Array.from({ length: timeline.length + 1 })

  return (
    <div className="-mx-4 px-4 flex items-center gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4">
      {slots.map((_, i) => (
        <React.Fragment key={`slot-${i}`}>
          {/* slot i */}
          {showSlots && <Slot id={`slot-${i}`} />}

          {/* card i */}
          {i < timeline.length && (
            <div className="shrink-0">
              <TimeLineCard
                year={timeline[i].year}
                artist={timeline[i].artist}
                title={timeline[i].title}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
