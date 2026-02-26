import React, { useState } from 'react';
import { useAllHabits } from '../hooks/useQueries';
import HabitCard from '../components/HabitCard';
import CustomHabitBuilder from '../components/CustomHabitBuilder';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Sparkles } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Dashboard() {
  const { data: habits = [], isLoading } = useAllHabits();
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Habits</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Habit</span>
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && habits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
          <img
            src="/assets/generated/onboarding-hero.dim_800x400.png"
            alt="Start tracking habits"
            className="w-full max-w-md rounded-2xl mb-8 object-cover shadow-lg"
          />
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Start Your Journey</h2>
          </div>
          <p className="text-muted-foreground max-w-sm mb-6">
            Track your daily habits, build streaks, and visualize your progress. Add your first habit to get started!
          </p>
          <Button onClick={() => setCreateOpen(true)} size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Add Your First Habit
          </Button>
        </div>
      )}

      {/* Habit grid */}
      {!isLoading && habits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit, i) => (
            <HabitCard
              key={habit.id.toString()}
              habit={habit}
              index={i}
              onViewDetail={(id) => navigate({ to: '/habit/$id', params: { id: id.toString() } })}
            />
          ))}
        </div>
      )}

      <CustomHabitBuilder
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
