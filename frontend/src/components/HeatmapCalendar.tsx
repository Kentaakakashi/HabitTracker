import React, { useMemo } from 'react';
import { LogEntry } from '../backend';
import { formatDateKey } from '../utils/streakCalculator';

interface HeatmapCalendarProps {
  entries: LogEntry[];
  target: number;
  color?: string;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensity(value: number, target: number): number {
  if (value <= 0) return 0;
  const ratio = value / target;
  if (ratio >= 1) return 4;
  if (ratio >= 0.75) return 3;
  if (ratio >= 0.5) return 2;
  return 1;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

export default function HeatmapCalendar({ entries, target, color = '#22c55e' }: HeatmapCalendarProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const valueMap = new Map<string, number>();
    for (const e of entries) {
      const key = formatDateKey(e.date);
      const val = parseFloat(e.value) || 0;
      valueMap.set(key, (valueMap.get(key) || 0) + val);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weeksArr: Array<Array<{ key: string; date: Date; intensity: number; value: number } | null>> = [];
    const monthLabelMap = new Map<number, string>();

    let current = new Date(startDate);
    while (current <= today) {
      const week: Array<{ key: string; date: Date; intensity: number; value: number } | null> = [];
      for (let d = 0; d < 7; d++) {
        const dayDate = new Date(current);
        dayDate.setDate(dayDate.getDate() + d);
        if (dayDate > today) {
          week.push(null);
        } else {
          const key = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
          const value = valueMap.get(key) || 0;
          week.push({ key, date: dayDate, intensity: getIntensity(value, target), value });
          if (dayDate.getDate() === 1) {
            monthLabelMap.set(weeksArr.length, MONTHS[dayDate.getMonth()]);
          }
        }
      }
      weeksArr.push(week);
      current.setDate(current.getDate() + 7);
    }

    const monthLabelsArr: Array<{ col: number; label: string }> = [];
    monthLabelMap.forEach((label, col) => monthLabelsArr.push({ col, label }));

    return { weeks: weeksArr, monthLabels: monthLabelsArr };
  }, [entries, target]);

  const rgb = hexToRgb(color);
  const getColor = (intensity: number) => {
    if (intensity === 0 || !rgb) return undefined;
    const alpha = [0, 0.2, 0.45, 0.7, 1][intensity];
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-max">
        {/* Month labels */}
        <div className="flex mb-1 ml-6">
          {weeks.map((_, wi) => {
            const ml = monthLabels.find((m) => m.col === wi);
            return (
              <div key={wi} className="w-3 mr-0.5 text-center" style={{ minWidth: 12 }}>
                {ml ? (
                  <span className="text-muted-foreground" style={{ fontSize: '0.6rem' }}>
                    {ml.label}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col mr-1">
            {DAYS.map((d, i) => (
              <div
                key={i}
                className="text-muted-foreground flex items-center justify-center"
                style={{ height: 12, marginBottom: 2, fontSize: '0.55rem', width: 14 }}
              >
                {i % 2 === 1 ? d : ''}
              </div>
            ))}
          </div>
          {/* Grid */}
          <div className="flex gap-0.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="heatmap-cell rounded-sm"
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: day
                        ? getColor(day.intensity) || 'oklch(var(--muted) / 0.5)'
                        : 'transparent',
                      border: day ? '1px solid oklch(var(--border) / 0.3)' : 'none',
                    }}
                    title={
                      day
                        ? `${day.key}: ${day.value > 0 ? day.value : 'No entry'}`
                        : ''
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1 mt-2 ml-6">
          <span className="text-muted-foreground" style={{ fontSize: '0.6rem' }}>Less</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                width: 10,
                height: 10,
                backgroundColor: i === 0 ? 'oklch(var(--muted) / 0.5)' : getColor(i),
                border: '1px solid oklch(var(--border) / 0.3)',
              }}
            />
          ))}
          <span className="text-muted-foreground" style={{ fontSize: '0.6rem' }}>More</span>
        </div>
      </div>
    </div>
  );
}
