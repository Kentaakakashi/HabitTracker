import React from 'react';
import { BUILT_IN_HABITS, BuiltInHabitConfig } from '../types/habit';

interface HabitTypeSelectorProps {
  onSelect: (config: BuiltInHabitConfig) => void;
  selected?: string;
}

export default function HabitTypeSelector({ onSelect, selected }: HabitTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {BUILT_IN_HABITS.map((habit) => (
        <button
          key={habit.name}
          type="button"
          onClick={() => onSelect(habit)}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all hover:scale-105 ${
            selected === habit.name
              ? 'border-primary bg-primary/10'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          <span className="text-2xl">{habit.emoji}</span>
          <span className="text-xs font-semibold">{habit.name}</span>
          <span className="text-xs text-muted-foreground">{habit.unit}</span>
        </button>
      ))}
    </div>
  );
}
