"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface CompletionScreenProps {
  onRestart: () => void;
}

export default function CompletionScreen({ onRestart }: CompletionScreenProps) {
  return (
    <Card className="w-full max-w-md mx-auto p-8 text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold">You're done! Maintain this to become a GOAT</h1>
      <p className="text-muted-foreground">
        Great job completing all your tasks! Keep up the momentum.
      </p>
      <Button onClick={onRestart} size="lg">
        Start New Session
      </Button>
    </Card>
  );
}