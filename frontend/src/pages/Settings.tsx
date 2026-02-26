import React, { useState } from 'react';
import ThemePicker from '../components/ThemePicker';
import CustomThemeBuilder from '../components/CustomThemeBuilder';
import { Button } from '@/components/ui/button';
import { useCardClass } from '../context/ThemeContext';
import { Palette, Wand2, Info } from 'lucide-react';

export default function Settings() {
  const [customThemeOpen, setCustomThemeOpen] = useState(false);
  const cardClass = useCardClass();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Customize your experience</p>
      </div>

      {/* Theme section */}
      <div className={`${cardClass} p-5 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Theme</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCustomThemeOpen(true)}
            className="gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Custom Theme
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose a visual style for the app. Your selection is saved automatically.
        </p>
        <ThemePicker />
      </div>

      {/* About section */}
      <div className={`${cardClass} p-5 space-y-3`}>
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">About</h2>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Universal Habit Tracker</span> — Track
            your daily habits, build streaks, and visualize your progress.
          </p>
          <p>Built on the Internet Computer (ICP) — your data is stored on-chain.</p>
        </div>
        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
          © {new Date().getFullYear()} · Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname || 'habit-tracker'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      <CustomThemeBuilder open={customThemeOpen} onClose={() => setCustomThemeOpen(false)} />
    </div>
  );
}
