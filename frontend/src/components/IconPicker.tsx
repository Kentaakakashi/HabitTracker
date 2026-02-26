import React from 'react';
import { ICON_EMOJIS } from '../types/habit';

interface IconPickerProps {
  selected: number;
  onChange: (index: number) => void;
}

export default function IconPicker({ selected, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {ICON_EMOJIS.map((emoji, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all hover:scale-110 ${
            selected === i
              ? 'ring-2 ring-primary bg-primary/10 scale-110'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
