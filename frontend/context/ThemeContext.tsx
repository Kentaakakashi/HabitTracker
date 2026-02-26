import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Theme, CardStyle, BorderRadius } from '../backend';
import { ThemeDefinition, BUILT_IN_THEMES } from '../themes/themeDefinitions';
import { useActor } from '../hooks/useActor';

interface ThemeContextValue {
  currentTheme: ThemeDefinition;
  allThemes: ThemeDefinition[];
  setTheme: (theme: ThemeDefinition) => void;
  customThemes: ThemeDefinition[];
  addCustomTheme: (theme: ThemeDefinition) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function themeDefToBackend(t: ThemeDefinition): Theme {
  return {
    primaryColor: t.primaryColor,
    backgroundColor: t.backgroundColor,
    accentColor: t.accentColor,
    cardStyle: t.cardStyle,
    borderRadius: t.borderRadius,
  };
}

function applyThemeClass(className: string) {
  const body = document.body;
  // Remove all theme classes
  body.classList.remove('theme-glass', 'theme-neon', 'theme-nature', 'theme-retro');
  if (className) {
    body.classList.add(className);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const [currentTheme, setCurrentTheme] = useState<ThemeDefinition>(BUILT_IN_THEMES[0]);
  const [customThemes, setCustomThemes] = useState<ThemeDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on mount
  useEffect(() => {
    if (!actor) return;
    actor.getTheme().then((savedTheme) => {
      if (savedTheme) {
        // Try to match to a built-in theme by primaryColor
        const match = BUILT_IN_THEMES.find(
          (t) => t.primaryColor === savedTheme.primaryColor && t.backgroundColor === savedTheme.backgroundColor
        );
        if (match) {
          setCurrentTheme(match);
          applyThemeClass(match.className);
        } else {
          // It's a custom theme
          const custom: ThemeDefinition = {
            id: 'custom-saved',
            name: 'Custom',
            className: '',
            primaryColor: savedTheme.primaryColor,
            backgroundColor: savedTheme.backgroundColor,
            accentColor: savedTheme.accentColor,
            cardStyle: savedTheme.cardStyle,
            borderRadius: savedTheme.borderRadius,
            preview: {
              bg: savedTheme.backgroundColor,
              primary: savedTheme.primaryColor,
              accent: savedTheme.accentColor,
              card: '#ffffff',
            },
          };
          setCustomThemes([custom]);
          setCurrentTheme(custom);
          applyThemeClass('');
        }
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [actor]);

  const setTheme = useCallback((theme: ThemeDefinition) => {
    setCurrentTheme(theme);
    applyThemeClass(theme.className);
    if (actor) {
      actor.saveTheme(themeDefToBackend(theme)).catch(console.error);
    }
  }, [actor]);

  const addCustomTheme = useCallback((theme: ThemeDefinition) => {
    setCustomThemes((prev) => {
      const filtered = prev.filter((t) => t.id !== theme.id);
      return [...filtered, theme];
    });
    setTheme(theme);
    if (actor) {
      actor.saveTheme(themeDefToBackend(theme)).catch(console.error);
    }
  }, [actor, setTheme]);

  const allThemes = [...BUILT_IN_THEMES, ...customThemes];

  return (
    <ThemeContext.Provider value={{ currentTheme, allThemes, setTheme, customThemes, addCustomTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}

// Helper to get card class based on current theme
export function useCardClass() {
  const { currentTheme } = useThemeContext();
  switch (currentTheme.cardStyle) {
    case CardStyle.glass: return 'card-glass';
    case CardStyle.flat: return 'card-flat';
    default: return 'card-shadow';
  }
}
