import React from 'react';
import { Card, CardHeader, CardContent } from '../ui';

interface StartCardProps {
  year: number;
  artist: string;
  title: string;
  playerName?: string;
}

export const StartCard: React.FC<StartCardProps> = ({ 
  year, 
  artist, 
  title, 
  playerName 
}) => (
  <Card 
    className={`
      w-60 h-80 flex-shrink-0 flex flex-col relative overflow-hidden
      bg-gradient-to-br from-base-100 via-base-200 to-base-300
      border-2 border-primary/30 text-foreground shadow-strong
      hover:shadow-strong hover:border-primary/50 transition-all duration-300
    `}
  >
    {/* Decorative corner elements */}
    <div className="absolute top-0 left-0 w-16 h-16">
      <div className="absolute top-2 left-2 w-12 h-12 border-2 border-primary/20 rounded-full" />
      <div className="absolute top-4 left-4 w-8 h-8 bg-primary/10 rounded-full" />
    </div>
    
    <div className="absolute bottom-0 right-0 w-16 h-16 rotate-180">
      <div className="absolute top-2 left-2 w-12 h-12 border-2 border-primary/20 rounded-full" />
      <div className="absolute top-4 left-4 w-8 h-8 bg-primary/10 rounded-full" />
    </div>
    
    {/* Start indicator */}
    <div className="absolute top-4 right-4 px-3 py-1 bg-primary rounded-full">
      <span className="text-xs font-bold text-base-100 uppercase tracking-wide">
        Start
      </span>
    </div>
    
    {/* Year display - elegant style */}
    <CardHeader className="relative z-10 pt-12 pb-6">
      <div className="text-5xl font-bold text-primary leading-none tracking-tight">
        {year}
      </div>
      <div className="w-16 h-0.5 bg-primary/30 mt-2" />
    </CardHeader>
    
    {/* Artist and title */}
    <CardContent className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-8">
      <div className="space-y-3 text-center">
        <div className="text-xl font-semibold text-primary leading-tight">
          {artist}
        </div>
        <div className="text-lg text-muted-foreground leading-snug">
          {title}
        </div>
      </div>
    </CardContent>
    
    {/* Subtle texture overlay */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(93,49,54,0.1)_25%,rgba(93,49,54,0.1)_50%,transparent_50%,transparent_75%,rgba(93,49,54,0.1)_75%)] bg-[length:8px_8px]" />
    </div>
  </Card>
);
