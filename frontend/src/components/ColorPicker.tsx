import React from 'react';
import { PRESET_COLORS } from '../types/habit';

interface ColorPickerProps {
  selected: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ selected, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${
            selected === color ? 'ring-2 ring-offset-2 ring-foreground scale-110' : ''
          }`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
      <label className="w-7 h-7 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer hover:scale-110 transition-all overflow-hidden" title="Custom color">
        <input
          type="color"
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="opacity-0 absolute w-0 h-0"
        />
        <span className="text-xs text-muted-foreground">+</span>
      </label>
    </div>
  );
}
