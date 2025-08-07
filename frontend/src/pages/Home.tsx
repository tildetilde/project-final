import React from 'react';
import { Heading, Button } from '../ui';

export const Home: React.FC = () => (
  <div className="space-y-4">
    <Heading level={1}>Welcome!</Heading>
      <Button>
        Play now
      </Button>
  </div>
);