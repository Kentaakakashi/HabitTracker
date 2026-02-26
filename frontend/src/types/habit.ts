import { HabitType, Frequency } from '../backend';

export interface BuiltInHabitConfig {
  name: string;
  unit: string;
  icon: number;
  color: string;
  target: number;
  habitType: HabitType;
  frequency: Frequency;
  inputMin: number;
  inputMax: number;
  inputStep: number;
  emoji: string;
  description: string;
}

export const BUILT_IN_HABITS: BuiltInHabitConfig[] = [
  {
    name: 'Water',
    unit: 'ml',
    icon: 0,
    color: '#38bdf8',
    target: 2000,
    habitType: HabitType.numeric,
    frequency: Frequency.daily,
    inputMin: 0,
    inputMax: 4000,
    inputStep: 100,
    emoji: '💧',
    description: 'Track daily water intake',
  },
  {
    name: 'Calories',
    unit: 'kcal',
    icon: 1,
    color: '#fb923c',
    target: 2000,
    habitType: HabitType.numeric,
    frequency: Frequency.daily,
    inputMin: 0,
    inputMax: 5000,
    inputStep: 50,
    emoji: '🔥',
    description: 'Track daily calorie intake',
  },
  {
    name: 'Exercise',
    unit: 'min',
    icon: 2,
    color: '#f43f5e',
    target: 30,
    habitType: HabitType.numeric,
    frequency: Frequency.daily,
    inputMin: 0,
    inputMax: 300,
    inputStep: 5,
    emoji: '🏃',
    description: 'Track workout duration',
  },
  {
    name: 'Weight',
    unit: 'kg',
    icon: 3,
    color: '#a78bfa',
    target: 70,
    habitType: HabitType.numeric,
    frequency: Frequency.daily,
    inputMin: 0,
    inputMax: 300,
    inputStep: 0.1,
    emoji: '⚖️',
    description: 'Track body weight',
  },
  {
    name: 'Sleep',
    unit: 'hrs',
    icon: 4,
    color: '#818cf8',
    target: 8,
    habitType: HabitType.numeric,
    frequency: Frequency.daily,
    inputMin: 0,
    inputMax: 24,
    inputStep: 0.5,
    emoji: '😴',
    description: 'Track sleep duration',
  },
  {
    name: 'Study',
    unit: 'min',
    icon: 5,
    color: '#34d399',
    target: 60,
    habitType: HabitType.numeric,
    frequency: Frequency.daily,
    inputMin: 0,
    inputMax: 600,
    inputStep: 5,
    emoji: '📚',
    description: 'Track study time',
  },
  {
    name: 'Pills',
    unit: 'taken',
    icon: 6,
    color: '#f472b6',
    target: 1,
    habitType: HabitType.boolean_,
    frequency: Frequency.daily,
    inputMin: 0,
    inputMax: 1,
    inputStep: 1,
    emoji: '💊',
    description: 'Track medication',
  },
  {
    name: 'To-Dos',
    unit: 'tasks',
    icon: 7,
    color: '#fbbf24',
    target: 3,
    habitType: HabitType.text,
    frequency: Frequency.daily,
    inputMin: 0,
    inputMax: 20,
    inputStep: 1,
    emoji: '✅',
    description: 'Track daily tasks',
  },
];

export const ICON_EMOJIS: string[] = [
  '💧', '🔥', '🏃', '⚖️', '😴', '📚', '💊', '✅',
  '🧘', '🚴', '🥗', '🍎', '🧠', '💪', '🎯', '⭐',
  '🌱', '🎵', '📝', '🏆', '❤️', '🌟', '🎨', '🧪',
];

export const PRESET_COLORS: string[] = [
  '#38bdf8', '#34d399', '#fb923c', '#f43f5e',
  '#fbbf24', '#a78bfa', '#f472b6', '#818cf8',
  '#4ade80', '#f97316', '#e879f9', '#2dd4bf',
];

export interface TodoTask {
  id: string;
  text: string;
  done: boolean;
}

export function parseTodoValue(value: string): TodoTask[] {
  try {
    return JSON.parse(value) as TodoTask[];
  } catch {
    return [];
  }
}

export function serializeTodoValue(tasks: TodoTask[]): string {
  return JSON.stringify(tasks);
}
