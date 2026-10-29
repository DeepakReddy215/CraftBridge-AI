import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ChipProps {
  label: string;
  variant?: 'ok' | 'warn' | 'bad' | 'clay' | 'teal' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  icon,
  className,
}) => {
  const variants = {
    ok: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 dark:text-emerald-400',
    warn: 'bg-amber-500/15 text-amber-400 border-amber-500/30 dark:text-amber-400',
    bad: 'bg-rose-500/15 text-rose-400 border-rose-500/30 dark:text-rose-400',
    clay: 'bg-clay/15 text-clay border-clay/30',
    teal: 'bg-teal/15 text-teal border-teal/30',
    neutral: 'bg-white/5 text-tx/80 border-cardBorder',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full gap-1 font-mono tracking-tight',
    md: 'text-xs px-3 py-1 rounded-full gap-1.5 font-medium',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center border select-none transition-colors',
          variants[variant],
          sizes[size],
          className
        )
      )}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
