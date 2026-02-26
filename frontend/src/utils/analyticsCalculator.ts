import { LogEntry } from '../backend';
import { formatDateKey } from './streakCalculator';

export interface DailyDataPoint {
  date: string;
  value: number;
  label: string;
}

export interface WeeklyDataPoint {
  week: string;
  average: number;
  total: number;
  count: number;
}

export function buildDailyData(entries: LogEntry[], daysBack: number): DailyDataPoint[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    const key = formatDateKey(e.date);
    const val = parseFloat(e.value) || 0;
    map.set(key, (map.get(key) || 0) + val);
  }

  const result: DailyDataPoint[] = [];
  const now = new Date();
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    result.push({ date: key, value: map.get(key) || 0, label });
  }
  return result;
}

export function buildWeeklyData(dailyData: DailyDataPoint[]): WeeklyDataPoint[] {
  const weeks: WeeklyDataPoint[] = [];
  for (let i = 0; i < dailyData.length; i += 7) {
    const chunk = dailyData.slice(i, i + 7);
    const withValues = chunk.filter((d) => d.value > 0);
    const total = chunk.reduce((s, d) => s + d.value, 0);
    const average = withValues.length > 0 ? total / withValues.length : 0;
    const startLabel = chunk[0]?.label || '';
    const endLabel = chunk[chunk.length - 1]?.label || '';
    weeks.push({
      week: `${startLabel}–${endLabel}`,
      average: Math.round(average * 10) / 10,
      total: Math.round(total * 10) / 10,
      count: withValues.length,
    });
  }
  return weeks;
}

export function calcGoalCompletionRate(entries: LogEntry[], target: number, daysBack: number): number {
  if (daysBack === 0) return 0;
  const map = new Map<string, number>();
  for (const e of entries) {
    const key = formatDateKey(e.date);
    const val = parseFloat(e.value) || 0;
    map.set(key, (map.get(key) || 0) + val);
  }
  let met = 0;
  for (const val of map.values()) {
    if (val >= target) met++;
  }
  return Math.round((met / daysBack) * 100);
}
