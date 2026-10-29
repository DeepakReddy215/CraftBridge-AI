import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export interface SwatchProps {
  color: string;
  name?: string;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Swatch: React.FC<SwatchProps> = ({
  color,
  name,
  selected = false,
  onClick,
  size = 'md',
}) => {
  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={name || color}
      aria-label={name || color}
      className={clsx(
        'rounded-full relative border flex items-center justify-center transition-all duration-200 touch-target focus:outline-none focus:ring-2 focus:ring-clay/50',
        sizes[size],
        selected ? 'ring-2 ring-clay ring-offset-2 ring-offset-bg scale-110 border-white/80' : 'border-cardBorder hover:scale-105'
      )}
      style={{ backgroundColor: color }}
    >
      {selected && (
        <Check
          className={clsx(
            'w-4 h-4 drop-shadow stroke-[3]',
            isDarkColor(color) ? 'text-white' : 'text-neutral-900'
          )}
        />
      )}
    </button>
  );
};

function isDarkColor(hex: string): boolean {
  if (!hex || hex.length < 4) return true;
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2) || '0', 16);
  const g = parseInt(cleanHex.substring(2, 4) || '0', 16);
  const b = parseInt(cleanHex.substring(4, 6) || '0', 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}
