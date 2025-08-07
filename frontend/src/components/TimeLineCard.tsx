import React from 'react';
import { Card, CardHeader, CardContent } from '../ui';

interface TimeLineCardProps {
  year: number;
  artist: string;
  title: string;
}

export const TimeLineCard: React.FC<TimeLineCardProps> = ({ year, artist, title }) => (
  <Card 
  hoverable
  className="w-60 h-60 flex-shrink-0 flex flex-col">
    <CardHeader className="flex flex-col items-center space-y-1">
      <span className="text-sm font-semibold">{year}</span>
      <span className="text-base">{artist}</span>
    </CardHeader>
  <CardContent className="flex-1 flex items-center justify-center">
    <span className="text-center">{title}</span>
  </CardContent>
  </Card>
);