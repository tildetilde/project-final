import React from 'react';
import { Heading, Card, CardHeader, CardContent } from '../ui';
import { StartCard } from '../components/StartCard'
import { TimeLineCard } from '../components/TimeLineCard';
import { OrientationGuard } from '../components/OrientationGuard';

const startData = {
  year: 1982,
  artist: 'Michael Jackson',
  title: 'Thriller',
  playerName: 'Spelare 1',
}

const timelineData = [
  { id: 1, year: 1982, artist: 'Michael Jackson', title: 'Thriller' },
  { id: 2, year: 1991, artist: 'Nirvana', title: 'Smells Like Teen Spirit' },
  { id: 3, year: 2013, artist: 'Daft Punk', title: 'Get Lucky' },
];

export const GameMode: React.FC = () => (
 <div className="space-y-6 sm:space-y-8">
    <OrientationGuard minWidth={600} /> {/* visas i porträtt < 600px */}

    <Heading level={1} className="text-2xl sm:text-3xl">Game Mode</Heading>


    <StartCard
      year={startData.year}
      artist={startData.artist}
      title={startData.title}
      playerName={startData.playerName}
    />

    <div>
      <Heading level={3} className="text-lg sm:text-xl mb-2 sm:mb-4">Timeline</Heading>
      <div className="-mx-4 px-4 flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 snap-x snap-mandatory">
        {timelineData.map(item => (
          <div key={item.id} className="flex-shrink-0 w-[140px] sm:w-[180px] snap-start">
            <TimeLineCard
              year={item.year}
              artist={item.artist}
              title={item.title}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
)