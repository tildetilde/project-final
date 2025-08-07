import React from 'react';
import { Heading, Card, CardHeader, CardContent } from '../ui';

export const GameMode: React.FC = () => (
  <div className="space-y-6">
    <Heading level={1}>Game Mode</Heading>
    <Card hoverable>
      <CardHeader>
        <Heading level={5}>Let's go!</Heading>
      </CardHeader>
      <CardContent>
        {/* Game logic components*/}
        <></>
      </CardContent>
    </Card>
  </div>
);