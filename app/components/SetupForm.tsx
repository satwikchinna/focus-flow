"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { MusicGenre } from '../types';
import { Timer, Music, ListTodo } from 'lucide-react';

interface SetupFormProps {
  onStart: (tasks: string[], timeLimit: number, musicGenre: MusicGenre) => void;
}

export default function SetupForm({ onStart }: SetupFormProps) {
  const [tasks, setTasks] = useState<string[]>([]);
  const [currentTask, setCurrentTask] = useState('');
  const [timeLimit, setTimeLimit] = useState('30');
  const [musicGenre, setMusicGenre] = useState<MusicGenre>('lofi');

  const handleAddTask = () => {
    if (currentTask.trim()) {
      setTasks([...tasks, currentTask.trim()]);
      setCurrentTask('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5" />
          <h2 className="text-xl font-semibold">What do you want to work on today?</h2>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Enter a task..."
          />
          <Button onClick={handleAddTask}>Add</Button>
        </div>

        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center gap-2 bg-secondary/20 p-2 rounded">
              <span>{task}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5" />
          <h3 className="font-medium">Time Limit (minutes)</h3>
        </div>
        <Input
          type="number"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          min="1"
          max="120"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          <h3 className="font-medium">Music Genre</h3>
        </div>
        <Select value={musicGenre} onValueChange={(value) => setMusicGenre(value as MusicGenre)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lofi">Lo-Fi</SelectItem>
            <SelectItem value="classical">Classical</SelectItem>
            <SelectItem value="ambient">Ambient</SelectItem>
            <SelectItem value="jazz">Jazz</SelectItem>
            <SelectItem value="nature">Nature Sounds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={() => tasks.length && onStart(tasks, parseInt(timeLimit), musicGenre)}
        disabled={!tasks.length}
      >
        Let's Start!
      </Button>
    </Card>
  );
}