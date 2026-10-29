import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface RingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const Ring: React.FC<RingProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'Quality Score',
  sublabel,
  className,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(Math.min(100, Math.max(0, score)));
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return 'stroke-emerald-400';
    if (score >= 65) return 'stroke-amber-400';
    return 'stroke-rose-400';
  };

  const getTextColor = () => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 65) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div
      className={twMerge(
        clsx('flex flex-col items-center justify-center relative select-none', className)
      )}
      style={{ width: size, height: size }}
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
      aria-label={label}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10 dark:text-white/10"
          fill="transparent"
        />
        {/* Animated fill circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={clsx('transition-all duration-1000 ease-out', getColor())}
          fill="transparent"
        />
      </svg>

      {/* Center score readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={clsx('text-3xl font-bold font-mono tracking-tight', getTextColor())}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-[11px] text-mu uppercase font-mono tracking-wider">/ 100</span>
        {sublabel && (
          <span className="text-[10px] text-tx/60 mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  );
};
