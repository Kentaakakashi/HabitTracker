import React, { useState, useMemo } from 'react';
import { useAllHabits, useLogEntriesByRange } from '../hooks/useQueries';
import { buildDailyData, buildWeeklyData, calcGoalCompletionRate } from '../utils/analyticsCalculator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useCardClass } from '../context/ThemeContext';
import { ICON_EMOJIS } from '../types/habit';
import { Target, TrendingUp, Calendar, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

export default function Analytics() {
  const { data: habits = [], isLoading: habitsLoading } = useAllHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const cardClass = useCardClass();

  const selectedHabit = useMemo(() => {
    if (selectedHabitId) {
      return habits.find((h) => h.id.toString() === selectedHabitId) || habits[0] || null;
    }
    return habits[0] || null;
  }, [habits, selectedHabitId]);

  const { data: entries30 = [], isLoading: entriesLoading } = useLogEntriesByRange(
    selectedHabit?.id ?? null,
    30
  );

  const dailyData = useMemo(() => buildDailyData(entries30, 30), [entries30]);
  const weeklyData = useMemo(() => buildWeeklyData(dailyData), [dailyData]);
  const goalRate = useMemo(
    () => calcGoalCompletionRate(entries30, Number(selectedHabit?.target ?? 1), 30),
    [entries30, selectedHabit]
  );

  const totalLogged = useMemo(
    () => entries30.reduce((s, e) => s + (parseFloat(e.value) || 0), 0),
    [entries30]
  );

  const daysWithEntries = dailyData.filter((d) => d.value > 0).length;

  const avgDaily = useMemo(
    () => (daysWithEntries > 0 ? totalLogged / daysWithEntries : 0),
    [totalLogged, daysWithEntries]
  );

  if (habitsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">No Habits Yet</h2>
        <p className="text-muted-foreground">Add habits on the Dashboard to see analytics here.</p>
      </div>
    );
  }

  const habit = selectedHabit || habits[0];
  const emoji = habit ? (ICON_EMOJIS[habit.icon] || '⭐') : '';
  const target = Number(habit?.target ?? 1);
  const unit = habit?.unit || '';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm">Last 30 days overview</p>
        </div>
        <Select
          value={selectedHabitId || (habit?.id.toString() ?? '')}
          onValueChange={setSelectedHabitId}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select habit" />
          </SelectTrigger>
          <SelectContent>
            {habits.map((h) => (
              <SelectItem key={h.id.toString()} value={h.id.toString()}>
                {ICON_EMOJIS[h.icon] || '⭐'} {h.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Award, label: 'Goal Rate', value: `${goalRate}%`, color: 'text-primary' },
          {
            icon: Target,
            label: 'Avg Daily',
            value: `${Math.round(avgDaily * 10) / 10} ${unit}`,
            color: 'text-accent',
          },
          { icon: Calendar, label: 'Days Logged', value: daysWithEntries, color: 'text-orange-500' },
          {
            icon: TrendingUp,
            label: 'Total',
            value: `${Math.round(totalLogged * 10) / 10} ${unit}`,
            color: 'text-yellow-500',
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`${cardClass} p-4 text-center`}>
            <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
            <p className="text-lg font-bold truncate">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Daily chart */}
      <div className={`${cardClass} p-5`}>
        <h2 className="font-bold mb-1 flex items-center gap-2">
          <span>{emoji}</span> Daily {habit?.name} — Last 30 Days
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Target: {target} {unit}/day
        </p>
        {entriesLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval={4}
                stroke="oklch(var(--muted-foreground))"
              />
              <YAxis tick={{ fontSize: 10 }} stroke="oklch(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(var(--card))',
                  border: '1px solid oklch(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: number) => [`${val} ${unit}`, habit?.name]}
              />
              <ReferenceLine
                y={target}
                stroke="#22c55e"
                strokeDasharray="4 4"
                label={{ value: 'Target', fontSize: 10, fill: '#22c55e' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--theme-primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Weekly averages chart */}
      <div className={`${cardClass} p-5`}>
        <h2 className="font-bold mb-4">Weekly Averages</h2>
        {entriesLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 9 }}
                stroke="oklch(var(--muted-foreground))"
              />
              <YAxis tick={{ fontSize: 10 }} stroke="oklch(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(var(--card))',
                  border: '1px solid oklch(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: number) => [`${val} ${unit}`, 'Avg']}
              />
              <Bar dataKey="average" fill="var(--theme-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground text-center pb-2">
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
  );
}
