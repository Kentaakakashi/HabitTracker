import React, { useMemo } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useHabit, useLogEntriesForHabit, useLogEntriesByRange } from '../hooks/useQueries';
import { calculateStreaks, getTodayTimestamp } from '../utils/streakCalculator';
import HeatmapCalendar from '../components/HeatmapCalendar';
import CircularProgress from '../components/CircularProgress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Flame, Trophy, Target, Calendar } from 'lucide-react';
import { ICON_EMOJIS } from '../types/habit';
import { useCardClass } from '../context/ThemeContext';
import { HabitType } from '../backend';

export default function HabitDetail() {
  const { id } = useParams({ from: '/habit/$id' });
  const navigate = useNavigate();
  const cardClass = useCardClass();

  const habitId = BigInt(id);
  const { data: habit, isLoading: habitLoading } = useHabit(habitId);
  const { data: allEntries = [] } = useLogEntriesForHabit(habitId);
  const { data: last30 = [] } = useLogEntriesByRange(habitId, 30);

  const streaks = useMemo(() => calculateStreaks(allEntries), [allEntries]);

  const todayValue = useMemo(() => {
    const todayStart = getTodayTimestamp();
    const todayEnd = todayStart + BigInt(86_400_000_000_000);
    const todayEntries = allEntries.filter((e) => e.date >= todayStart && e.date <= todayEnd);
    if (todayEntries.length === 0) return 0;
    if (habit?.habitType === HabitType.boolean_) {
      return todayEntries.some((e) => e.value === 'true') ? 1 : 0;
    }
    if (habit?.habitType === HabitType.text) {
      try {
        const tasks = JSON.parse(todayEntries[todayEntries.length - 1]?.value || '[]');
        return Array.isArray(tasks) ? tasks.filter((t: { done: boolean }) => t.done).length : 0;
      } catch {
        return 0;
      }
    }
    return todayEntries.reduce((sum, e) => sum + (parseFloat(e.value) || 0), 0);
  }, [allEntries, habit]);

  if (habitLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Habit not found.</p>
        <Button variant="outline" onClick={() => navigate({ to: '/' })} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const target = Number(habit.target);
  const percentage = target > 0 ? (todayValue / target) * 100 : 0;
  const emoji = ICON_EMOJIS[habit.icon] || '⭐';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Header card */}
      <div className={`${cardClass} p-5`}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: `${habit.color}22`, border: `2px solid ${habit.color}55` }}
          >
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">{habit.name}</h1>
            <p className="text-muted-foreground text-sm">
              Target: {target} {habit.unit} · {habit.frequency}
            </p>
          </div>
          <CircularProgress
            percentage={percentage}
            size={72}
            strokeWidth={6}
            color={habit.color}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Flame,
            label: 'Current Streak',
            value: `${streaks.current} days`,
            color: 'text-orange-500',
          },
          {
            icon: Trophy,
            label: 'Longest Streak',
            value: `${streaks.longest} days`,
            color: 'text-yellow-500',
          },
          {
            icon: Target,
            label: 'Total Entries',
            value: allEntries.length,
            color: 'text-primary',
          },
          {
            icon: Calendar,
            label: 'Last 30 Days',
            value: last30.length,
            color: 'text-accent',
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`${cardClass} p-4 text-center`}>
            <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className={`${cardClass} p-5`}>
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Activity Heatmap — Last 365 Days
        </h2>
        <HeatmapCalendar entries={allEntries} target={target} color={habit.color} />
      </div>

      {/* Footer */}
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
