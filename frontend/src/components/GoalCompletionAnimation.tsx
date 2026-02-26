import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

const COLORS = ['#22c55e', '#fbbf24', '#f43f5e', '#38bdf8', '#a78bfa', '#fb923c'];

export default function GoalCompletionAnimation({ onDone }: { onDone?: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const ps: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.4,
      size: 5 + Math.random() * 6,
    }));
    setParticles(ps);
    const timer = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, 1400);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            top: '20%',
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            borderRadius: p.id % 3 === 0 ? '50%' : '2px',
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-checkmark-pop text-4xl">🎉</div>
      </div>
    </div>
  );
}
