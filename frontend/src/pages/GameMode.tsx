import React from 'react';
import { Heading, Card, CardHeader, CardContent } from '../ui';
import { TimeLineCard } from '../components/TimeLineCard';

const timelineData = [
  { id: 1, year: 1982, artist: 'Michael Jackson', title: 'Thriller' },
  { id: 2, year: 1991, artist: 'Nirvana', title: 'Smells Like Teen Spirit' },
  { id: 3, year: 2013, artist: 'Daft Punk', title: 'Get Lucky' },
];

export const GameMode: React.FC = () => (
  <div className="space-y-6">
    <Heading level={1}>Game Mode</Heading>

    <Card hoverable>
      <CardHeader>
        <Heading level={5}>Starting card</Heading>
      </CardHeader>
      <CardContent>
        {/* Game logic here */}
        {/* Lägg till spelkomponenter eller instruktioner här */}
        <p>Design kommer snart</p>
      </CardContent>
    </Card>

    <div>
      <Heading level={3}>Timeline</Heading>
      <div className="flex gap-6 overflow-x-auto py-4">
        {timelineData.map(item => (
          <TimeLineCard
            key={item.id}
            year={item.year}
            artist={item.artist}
            title={item.title}
          />
        ))}
      </div>
    </div>
  </div>
);