import React, { useState, useCallback } from 'react';
import { Habit, HabitType } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { BUILT_IN_HABITS, TodoTask, parseTodoValue, serializeTodoValue } from '../types/habit';
import { useAddLogEntry } from '../hooks/useQueries';
import { getTodayTimestamp } from '../utils/streakCalculator';
import GoalCompletionAnimation from './GoalCompletionAnimation';
import { Loader2, Plus, Trash2, Check } from 'lucide-react';

interface LogEntryInputProps {
  habit: Habit;
  currentValue?: string;
  onSuccess?: (newValue: string, goalMet: boolean) => void;
}

export default function LogEntryInput({ habit, currentValue, onSuccess }: LogEntryInputProps) {
  const builtIn = BUILT_IN_HABITS.find((b) => b.name === habit.name);
  const max = builtIn?.inputMax ?? 1000;
  const min = builtIn?.inputMin ?? 0;
  const step = builtIn?.inputStep ?? 1;

  const [numValue, setNumValue] = useState<number>(() => {
    if (currentValue) return parseFloat(currentValue) || 0;
    return 0;
  });
  const [boolValue, setBoolValue] = useState<boolean>(() => currentValue === 'true');
  const [todos, setTodos] = useState<TodoTask[]>(() =>
    habit.habitType === HabitType.text ? parseTodoValue(currentValue || '[]') : []
  );
  const [newTodo, setNewTodo] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addEntry = useAddLogEntry();

  const handleSubmit = useCallback(async () => {
    let value = '';
    if (habit.habitType === HabitType.numeric) {
      value = String(numValue);
    } else if (habit.habitType === HabitType.boolean_) {
      value = String(boolValue);
    } else {
      value = serializeTodoValue(todos);
    }

    const target = Number(habit.target);
    let goalMet = false;
    if (habit.habitType === HabitType.numeric) {
      goalMet = numValue >= target;
    } else if (habit.habitType === HabitType.boolean_) {
      goalMet = boolValue;
    } else {
      const doneTasks = todos.filter((t) => t.done).length;
      goalMet = doneTasks >= target;
    }

    await addEntry.mutateAsync({
      habitId: habit.id,
      date: getTodayTimestamp(),
      value,
      notes: '',
    });

    setSubmitted(true);
    if (goalMet) setShowCelebration(true);
    onSuccess?.(value, goalMet);
  }, [habit, numValue, boolValue, todos, addEntry, onSuccess]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now().toString(), text: newTodo.trim(), done: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="relative space-y-3">
      {showCelebration && (
        <GoalCompletionAnimation onDone={() => setShowCelebration(false)} />
      )}

      {habit.habitType === HabitType.numeric && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={numValue}
              min={min}
              max={max}
              step={step}
              onChange={(e) => setNumValue(parseFloat(e.target.value) || 0)}
              className="w-28 text-center font-semibold text-lg"
            />
            <span className="text-muted-foreground text-sm font-medium">{habit.unit}</span>
          </div>
          <Slider
            value={[numValue]}
            min={min}
            max={max}
            step={step}
            onValueChange={([v]) => setNumValue(v)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{min} {habit.unit}</span>
            <span>Target: {Number(habit.target)} {habit.unit}</span>
            <span>{max} {habit.unit}</span>
          </div>
        </div>
      )}

      {habit.habitType === HabitType.boolean_ && (
        <div className="flex items-center gap-3 py-2">
          <Checkbox
            id={`bool-${habit.id}`}
            checked={boolValue}
            onCheckedChange={(v) => setBoolValue(!!v)}
            className="w-6 h-6"
          />
          <label htmlFor={`bool-${habit.id}`} className="text-sm font-medium cursor-pointer">
            {boolValue ? 'Completed ✓' : 'Mark as done'}
          </label>
        </div>
      )}

      {habit.habitType === HabitType.text && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add a task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1"
            />
            <Button type="button" size="icon" variant="outline" onClick={addTodo}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {todos.map((task) => (
              <div key={task.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <Checkbox
                  checked={task.done}
                  onCheckedChange={() => toggleTodo(task.id)}
                />
                <span className={`flex-1 text-sm ${task.done ? 'line-through text-muted-foreground' : ''}`}>
                  {task.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeTodo(task.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {todos.length === 0 && (
              <p className="text-muted-foreground text-xs text-center py-2">No tasks yet</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {todos.filter((t) => t.done).length}/{todos.length} done · Target: {Number(habit.target)} tasks
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={addEntry.isPending}
        className="w-full"
        variant={submitted ? 'outline' : 'default'}
      >
        {addEntry.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
        ) : submitted ? (
          <><Check className="w-4 h-4 mr-2" /> Logged!</>
        ) : (
          'Log Entry'
        )}
      </Button>
    </div>
  );
}
