import React, { ChangeEvent } from 'react';
import { clsx } from 'clsx';
import { formatCurrency } from '../../lib/format';

export interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatAsCurrency?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  step = 50,
  value,
  onChange,
  formatAsCurrency = true,
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={clsx('w-full space-y-2', className)}>
      <div className="flex justify-between items-center text-sm">
        <label className="font-medium text-tx/90">{label}</label>
        <span className="font-mono font-bold text-clay text-base">
          {formatAsCurrency ? formatCurrency(value) : value}
        </span>
      </div>
      <div className="relative py-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className="w-full h-2 bg-white/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-clay focus:outline-none focus:ring-2 focus:ring-clay/50"
          style={{
            background: `linear-gradient(to right, var(--ac) 0%, var(--ac) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
          }}
        />
        <div className="flex justify-between text-[11px] font-mono text-mu mt-1">
          <span>{formatAsCurrency ? formatCurrency(min) : min}</span>
          <span>{formatAsCurrency ? formatCurrency(max) : max}</span>
        </div>
      </div>
    </div>
  );
};
