import React from 'react';
import { clsx } from 'clsx';

export interface IconTileProps {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const IconTile: React.FC<IconTileProps> = ({
  label,
  description,
  icon,
  selected = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 touch-target focus:outline-none focus:ring-2 focus:ring-clay/50',
        selected
          ? 'bg-clay/10 border-clay shadow-md shadow-clay/15 scale-[1.02]'
          : 'bg-cardBg border-cardBorder hover:border-white/20 hover:bg-white/[0.03]',
        className
      )}
    >
      <div
        className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors',
          selected ? 'bg-clay text-white shadow-sm' : 'bg-white/5 text-tx/80'
        )}
      >
        {icon}
      </div>
      <span className="font-semibold text-sm text-tx">{label}</span>
      {description && <span className="text-xs text-mu mt-0.5 line-clamp-1">{description}</span>}
    </button>
  );
};
