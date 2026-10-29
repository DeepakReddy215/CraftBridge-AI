import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BarProps {
  value: number; // 0 to 100
  label?: string;
  showValue?: boolean;
  color?: 'clay' | 'teal' | 'emerald' | 'amber' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Bar: React.FC<BarProps> = ({
  value,
  label,
  showValue = true,
  color = 'clay',
  size = 'md',
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const colors = {
    clay: 'bg-gradient-to-r from-clay/80 to-clay',
    teal: 'bg-gradient-to-r from-teal/80 to-teal',
    emerald: 'bg-gradient-to-r from-emerald-500/80 to-emerald-400',
    amber: 'bg-gradient-to-r from-amber-500/80 to-amber-400',
    rose: 'bg-gradient-to-r from-rose-500/80 to-rose-400',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={twMerge('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          {label && <span className="font-medium text-tx/80">{label}</span>}
          {showValue && <span className="font-mono text-mu">{clamped}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-white/10 dark:bg-white/10 rounded-full overflow-hidden', heights[size])}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-700 ease-out',
            colors[color]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
