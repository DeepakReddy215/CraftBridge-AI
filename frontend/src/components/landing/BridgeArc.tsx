import React from 'react';

export const BridgeArc: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-4xl mx-auto overflow-hidden py-4 select-none ${className}`}>
      <svg
        viewBox="0 0 1000 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--ac)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f39c12" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--ac2)" stopOpacity="0.9" />
          </linearGradient>

          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient glow under the bridge */}
        <path
          d="M 50,210 C 250,50 750,50 950,210"
          stroke="url(#bridgeGrad)"
          strokeWidth="18"
          strokeLinecap="round"
          filter="url(#glowFilter)"
          opacity="0.35"
        />

        {/* Animated Main Arch */}
        <path
          d="M 50,210 C 250,50 750,50 950,210"
          stroke="url(#bridgeGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="animate-arc-draw"
        />

        {/* Vertical suspension cables */}
        {[180, 300, 420, 500, 580, 700, 820].map((x) => {
          // calculate approximate y on the bezier curve
          const t = (x - 50) / 900;
          const y = (1 - t) * (1 - t) * 210 + 2 * (1 - t) * t * 50 + t * t * 210;
          return (
            <g key={x}>
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={210}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <circle cx={x} cy={y} r="3" fill="#e4793f" />
            </g>
          );
        })}

        {/* Base deck line */}
        <line
          x1="30"
          y1="210"
          x2="970"
          y2="210"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="2"
        />

        {/* Heritage Anchor (Left) */}
        <circle cx="50" cy="210" r="10" fill="var(--ac)" />
        <text
          x="50"
          y="235"
          textAnchor="middle"
          fill="var(--ac)"
          fontSize="12"
          fontFamily="JetBrains Mono"
          fontWeight="600"
        >
          HERITAGE CRAFT
        </text>

        {/* AI Vision Anchor (Right) */}
        <circle cx="950" cy="210" r="10" fill="var(--ac2)" />
        <text
          x="950"
          y="235"
          textAnchor="middle"
          fill="var(--ac2)"
          fontSize="12"
          fontFamily="JetBrains Mono"
          fontWeight="600"
        >
          VISION INTELLIGENCE
        </text>
      </svg>
    </div>
  );
};
