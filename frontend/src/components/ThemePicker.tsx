import React from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { ThemeDefinition } from '../themes/themeDefinitions';
import { Check } from 'lucide-react';

export default function ThemePicker() {
  const { allThemes, currentTheme, setTheme } = useThemeContext();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {allThemes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isSelected={currentTheme.id === theme.id}
          onSelect={() => setTheme(theme)}
        />
      ))}
    </div>
  );
}

function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: ThemeDefinition;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative p-3 rounded-xl border-2 transition-all hover:scale-105 text-left ${
        isSelected ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
      }`}
      style={{ backgroundColor: theme.preview.bg }}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
      {/* Preview swatches */}
      <div className="flex gap-1 mb-2">
        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.preview.primary }} />
        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.preview.accent }} />
        <div
          className="w-5 h-5 rounded-full border"
          style={{ backgroundColor: theme.preview.card, borderColor: theme.preview.primary + '44' }}
        />
      </div>
      <p className="text-xs font-bold" style={{ color: theme.preview.primary }}>
        {theme.name}
      </p>
    </button>
  );
}
