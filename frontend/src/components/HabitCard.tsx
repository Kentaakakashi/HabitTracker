import React, { useState, useMemo } from 'react';
import { Habit, HabitType } from '../backend';
import { ICON_EMOJIS } from '../types/habit';
import { useTodayEntry, useLogEntriesForHabit, useDeleteHabit } from '../hooks/useQueries';
import { calculateStreaks } from '../utils/streakCalculator';
import CircularProgress from './CircularProgress';
import LogEntryInput from './LogEntryInput';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Flame, Trophy, MoreVertical, Trash2, BarChart2, Edit2 } from 'lucide-react';
import { useCardClass } from '../context/ThemeContext';
import EditHabitDialog from './EditHabitDialog';

interface HabitCardProps {
  habit: Habit;
  index: number;
  onViewDetail: (id: bigint) => void;
}

export default function HabitCard({ habit, index, onViewDetail }: HabitCardProps) {
  const cardClass = useCardClass();
  const [logOpen, setLogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  const { data: todayEntries = [] } = useTodayEntry(habit.id);
  const { data: allEntries = [] } = useLogEntriesForHabit(habit.id);
  const deleteHabit = useDeleteHabit();

  const todayValue = useMemo(() => {
    if (todayEntries.length === 0) return 0;
    if (habit.habitType === HabitType.boolean_) {
      return todayEntries.some((e) => e.value === 'true') ? 1 : 0;
    }
    if (habit.habitType === HabitType.text) {
      try {
        const tasks = JSON.parse(todayEntries[todayEntries.length - 1]?.value || '[]');
        return Array.isArray(tasks) ? tasks.filter((t: { done: boolean }) => t.done).length : 0;
      } catch { return 0; }
    }
    return todayEntries.reduce((sum, e) => sum + (parseFloat(e.value) || 0), 0);
  }, [todayEntries, habit.habitType]);

  const target = Number(habit.target);
  const percentage = target > 0 ? (todayValue / target) * 100 : 0;
  const { current: currentStreak, longest: longestStreak } = useMemo(
    () => calculateStreaks(allEntries),
    [allEntries]
  );

  const emoji = ICON_EMOJIS[habit.icon] || '⭐';
  const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

  const handleDelete = async () => {
    if (confirm(`Delete "${habit.name}"? This will remove all log entries.`)) {
      await deleteHabit.mutateAsync(habit.id);
    }
  };

  return (
    <>
      <div
        className={`${cardClass} p-4 animate-fade-in-up ${staggerClass} opacity-0 transition-all hover:shadow-md`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: `${habit.color}22`, border: `2px solid ${habit.color}44` }}
            >
              {emoji}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm truncate">{habit.name}</h3>
              <p className="text-xs text-muted-foreground">
                {target} {habit.unit}/day
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <CircularProgress
              percentage={percentage}
              size={52}
              strokeWidth={5}
              color={habit.color}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                  <MoreVertical className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetail(habit.id)}>
                  <BarChart2 className="w-4 h-4 mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Streaks */}
        <div className="flex gap-3 mb-3">
          <div className="flex items-center gap-1 text-xs">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-semibold">{currentStreak}</span>
            <span className="text-muted-foreground">streak</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="font-semibold">{longestStreak}</span>
            <span className="text-muted-foreground">best</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: percentage >= 100 ? '#22c55e' : habit.color,
            }}
          />
        </div>

        <Button
          size="sm"
          className="w-full text-xs h-8"
          onClick={() => setLogOpen(true)}
          style={{
            backgroundColor: habit.color,
            color: '#fff',
            border: 'none',
          }}
        >
          {justLogged ? '✓ Logged' : 'Log Today'}
        </Button>
      </div>

      {/* Log Dialog */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{emoji}</span> Log {habit.name}
            </DialogTitle>
          </DialogHeader>
          <LogEntryInput
            habit={habit}
            currentValue={todayEntries[todayEntries.length - 1]?.value}
            onSuccess={(_val, _goalMet) => {
              setJustLogged(true);
              setTimeout(() => setLogOpen(false), 800);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <EditHabitDialog
        habit={habit}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
