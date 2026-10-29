import React, { useState, useRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: 'clay' | 'teal' | 'neutral';
  interactive?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className,
  glowColor = 'clay',
  interactive = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const glowStyles = {
    clay: 'rgba(228, 121, 63, 0.15)',
    teal: 'rgba(79, 209, 197, 0.15)',
    neutral: 'rgba(255, 255, 255, 0.08)',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={twMerge(
        clsx(
          'relative rounded-[22px] bg-cardBg border border-cardBorder backdrop-blur-md overflow-hidden transition-all duration-300',
          interactive && 'hover:border-clay/40 hover:-translate-y-0.5',
          className
        )
      )}
      {...props}
    >
      {/* Radial Glow follower */}
      {interactive && mousePos && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles[glowColor]}, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const Card = GlowCard;
