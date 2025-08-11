import React from 'react';
import { Card, CardHeader, CardContent } from '../ui';

interface TimeLineCardProps {
  year: number;
  artist: string;
  title: string;
  isCorrect?: boolean;
  isRevealed?: boolean;
  className?: string;
}

export const TimeLineCard: React.FC<TimeLineCardProps> = ({ 
  year, 
  artist, 
  title, 
  isCorrect,
  isRevealed,
  className = '',
}) => (
 <Card
    className={`
      w-[136px] h-[180px] sm:w-60 sm:h-80 flex-shrink-0 flex flex-col relative overflow-hidden
      bg-gradient-to-br from-accent-200 via-accent-300 to-accent-500
      border-accent-400 text-base-100 shadow-medium
      ${isRevealed ? '' : 'bg-gradient-to-br from-accent-600 to-accent-800'}
    `}
  >
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
    </div>

    <CardHeader className="relative z-10 pt-4 sm:pt-8 pb-2 sm:pb-4">
      <div className="text-4xl sm:text-6xl font-bold text-base-100 leading-none tracking-tight">
        {year}
      </div>
    </CardHeader>

    <CardContent className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 pb-4 sm:pb-8">
      <div className="space-y-2 sm:space-y-4 text-center">
        <div className="text-base sm:text-2xl font-semibold text-base-100 leading-tight">
          {artist}
        </div>
        <div className="text-sm sm:text-xl text-base-100/90 leading-snug">
          {title}
        </div>
      </div>
    </CardContent>

    {isCorrect !== undefined && (
      <div className={`absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
        <span className="text-white text-sm sm:text-lg font-bold">{isCorrect ? '✓' : '✗'}</span>
      </div>
    )}

    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
  </Card>
);
