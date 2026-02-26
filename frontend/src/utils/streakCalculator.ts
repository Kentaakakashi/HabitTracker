import { LogEntry } from '../backend';

function dateKey(ts: bigint): string {
  const d = new Date(Number(ts) / 1_000_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function calculateStreaks(entries: LogEntry[]): { current: number; longest: number } {
  if (entries.length === 0) return { current: 0, longest: 0 };

  const dateSet = new Set(entries.map((e) => dateKey(e.date)));
  const today = todayKey();

  let current = 0;
  let check = today;
  while (dateSet.has(check)) {
    current++;
    check = subtractDays(check, 1);
  }
  // If today has no entry, check if yesterday starts a streak
  if (current === 0) {
    check = subtractDays(today, 1);
    while (dateSet.has(check)) {
      current++;
      check = subtractDays(check, 1);
    }
  }

  // Longest streak
  const sortedDates = Array.from(dateSet).sort();
  let longest = 0;
  let run = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      run = 1;
    } else {
      const prev = sortedDates[i - 1];
      const curr = sortedDates[i];
      const prevDate = new Date(prev + 'T00:00:00');
      const currDate = new Date(curr + 'T00:00:00');
      const diff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        run++;
      } else {
        run = 1;
      }
    }
    if (run > longest) longest = run;
  }

  return { current, longest };
}

export function getTodayTimestamp(): bigint {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return BigInt(startOfDay.getTime()) * BigInt(1_000_000);
}

export function getDateRangeTimestamps(daysBack: number): { start: bigint; end: bigint } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const start = new Date(end);
  start.setDate(start.getDate() - daysBack);
  start.setHours(0, 0, 0, 0);
  return {
    start: BigInt(start.getTime()) * BigInt(1_000_000),
    end: BigInt(end.getTime()) * BigInt(1_000_000),
  };
}

export function formatDateKey(ts: bigint): string {
  return dateKey(ts);
}
