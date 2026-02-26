import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Habit, LogEntry, Theme, HabitType, Frequency } from '../backend';
import { getDateRangeTimestamps, getTodayTimestamp } from '../utils/streakCalculator';

// ===== HABITS =====

export function useAllHabits() {
  const { actor, isFetching } = useActor();
  return useQuery<Habit[]>({
    queryKey: ['habits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHabits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHabit(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Habit>({
    queryKey: ['habit', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error('No actor or id');
      return actor.getHabit(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateHabit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      habitType: HabitType;
      unit: string;
      icon: number;
      color: string;
      target: bigint;
      frequency: Frequency;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.createHabit(
        params.name,
        params.habitType,
        params.unit,
        params.icon,
        params.color,
        params.target,
        params.frequency
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

export function useUpdateHabit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      unit: string;
      icon: number;
      color: string;
      target: bigint;
      frequency: Frequency;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateHabit(
        params.id,
        params.name,
        params.unit,
        params.icon,
        params.color,
        params.target,
        params.frequency
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['habit', vars.id.toString()] });
    },
  });
}

export function useDeleteHabit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteHabit(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['logEntries'] });
    },
  });
}

// ===== LOG ENTRIES =====

export function useLogEntriesForHabit(habitId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<LogEntry[]>({
    queryKey: ['logEntries', 'habit', habitId?.toString()],
    queryFn: async () => {
      if (!actor || habitId === null) return [];
      return actor.getLogEntriesForHabit(habitId);
    },
    enabled: !!actor && !isFetching && habitId !== null,
  });
}

export function useLogEntriesByRange(habitId: bigint | null, daysBack: number) {
  const { actor, isFetching } = useActor();
  return useQuery<LogEntry[]>({
    queryKey: ['logEntries', 'range', habitId?.toString(), daysBack],
    queryFn: async () => {
      if (!actor || habitId === null) return [];
      const { start, end } = getDateRangeTimestamps(daysBack);
      return actor.getLogEntriesByHabitAndDateRange(habitId, start, end);
    },
    enabled: !!actor && !isFetching && habitId !== null,
  });
}

export function useTodayEntry(habitId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<LogEntry[]>({
    queryKey: ['logEntries', 'today', habitId?.toString()],
    queryFn: async () => {
      if (!actor || habitId === null) return [];
      const todayStart = getTodayTimestamp();
      const todayEnd = todayStart + BigInt(86_400_000_000_000);
      return actor.getLogEntriesByHabitAndDateRange(habitId, todayStart, todayEnd);
    },
    enabled: !!actor && !isFetching && habitId !== null,
  });
}

export function useAddLogEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      habitId: bigint;
      date: bigint;
      value: string;
      notes: string;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.addLogEntry(params.habitId, params.date, params.value, params.notes);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['logEntries', 'habit', vars.habitId.toString()] });
      qc.invalidateQueries({ queryKey: ['logEntries', 'today', vars.habitId.toString()] });
      qc.invalidateQueries({ queryKey: ['logEntries', 'range', vars.habitId.toString()] });
    },
  });
}

export function useDeleteLogEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { habitId: bigint; date: bigint }) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteLogEntry(params.habitId, params.date);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['logEntries', 'habit', vars.habitId.toString()] });
      qc.invalidateQueries({ queryKey: ['logEntries', 'today', vars.habitId.toString()] });
      qc.invalidateQueries({ queryKey: ['logEntries', 'range', vars.habitId.toString()] });
    },
  });
}

// ===== THEME =====

export function useSavedTheme() {
  const { actor, isFetching } = useActor();
  return useQuery<Theme | null>({
    queryKey: ['theme'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTheme();
    },
    enabled: !!actor && !isFetching,
  });
}
