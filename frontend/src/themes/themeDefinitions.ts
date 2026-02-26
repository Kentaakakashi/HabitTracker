import { CardStyle, BorderRadius } from '../backend';

export interface ThemeDefinition {
  id: string;
  name: string;
  className: string;
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  cardStyle: CardStyle;
  borderRadius: BorderRadius;
  preview: {
    bg: string;
    primary: string;
    accent: string;
    card: string;
  };
}

export const BUILT_IN_THEMES: ThemeDefinition[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    className: '',
    primaryColor: 'oklch(0.55 0.18 145)',
    backgroundColor: 'oklch(0.97 0.005 85)',
    accentColor: 'oklch(0.72 0.19 145)',
    cardStyle: CardStyle.shadow,
    borderRadius: BorderRadius.large,
    preview: {
      bg: '#f7f7f5',
      primary: '#2d8a5e',
      accent: '#4db87a',
      card: '#ffffff',
    },
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    className: 'theme-glass',
    primaryColor: 'oklch(0.52 0.14 220)',
    backgroundColor: 'oklch(0.88 0.04 220)',
    accentColor: 'oklch(0.62 0.16 200)',
    cardStyle: CardStyle.glass,
    borderRadius: BorderRadius.large,
    preview: {
      bg: '#c8d8f0',
      primary: '#3a6ea8',
      accent: '#2a9d8f',
      card: 'rgba(255,255,255,0.45)',
    },
  },
  {
    id: 'neon',
    name: 'Neon Dark',
    className: 'theme-neon',
    primaryColor: 'oklch(0.78 0.22 145)',
    backgroundColor: 'oklch(0.1 0.01 260)',
    accentColor: 'oklch(0.82 0.25 145)',
    cardStyle: CardStyle.shadow,
    borderRadius: BorderRadius.small,
    preview: {
      bg: '#0d0d1a',
      primary: '#39e07a',
      accent: '#4dff8a',
      card: '#141428',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    className: 'theme-nature',
    primaryColor: 'oklch(0.5 0.14 140)',
    backgroundColor: 'oklch(0.96 0.02 100)',
    accentColor: 'oklch(0.62 0.15 60)',
    cardStyle: CardStyle.shadow,
    borderRadius: BorderRadius.pill,
    preview: {
      bg: '#f5f0e8',
      primary: '#4a7c59',
      accent: '#b5651d',
      card: '#fdfaf4',
    },
  },
  {
    id: 'retro',
    name: 'Retro',
    className: 'theme-retro',
    primaryColor: 'oklch(0.58 0.2 35)',
    backgroundColor: 'oklch(0.95 0.06 85)',
    accentColor: 'oklch(0.68 0.18 55)',
    cardStyle: CardStyle.flat,
    borderRadius: BorderRadius.none,
    preview: {
      bg: '#f5e6c8',
      primary: '#c0392b',
      accent: '#e67e22',
      card: '#fdf3dc',
    },
  },
];
