import React, { useEffect, useRef } from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  completedColor?: string;
  label?: string;
}

export default function CircularProgress({
  percentage,
  size = 72,
  strokeWidth = 6,
  color = 'var(--theme-primary)',
  completedColor = '#22c55e',
  label,
}: CircularProgressProps) {
  const clampedPct = Math.min(Math.max(percentage, 0), 100);
  const isComplete = percentage >= 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPct / 100) * circumference;
  const strokeColor = isComplete ? completedColor : color;

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = String(offset);
    }
  }, [offset]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted opacity-30"
        />
        {/* Progress arc */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="progress-ring-circle"
          style={{ filter: isComplete ? `drop-shadow(0 0 4px ${completedColor})` : undefined }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none"
          style={{
            fontSize: size < 60 ? '0.6rem' : '0.75rem',
            color: isComplete ? completedColor : 'var(--theme-primary)',
          }}
        >
          {isComplete ? '✓' : `${Math.round(clampedPct)}%`}
        </span>
        {label && (
          <span className="text-muted-foreground leading-none mt-0.5" style={{ fontSize: '0.55rem' }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
