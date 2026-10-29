import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import type { DefectBox } from '../../types/api';

export interface AnnotatedPhotoProps {
  imageUrl: string;
  defects: DefectBox[];
  className?: string;
}

export const AnnotatedPhoto: React.FC<AnnotatedPhotoProps> = ({
  imageUrl,
  defects,
  className = '',
}) => {
  const [showBoxes, setShowBoxes] = useState(true);
  const [selectedDefect, setSelectedDefect] = useState<string | null>(null);

  return (
    <GlowCard className={`p-4 ${className}`} glowColor="clay">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cardBorder">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-tx">ONNX Vision Diagnostic</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-clay/15 text-clay">
            {defects.length} Flags Detected
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowBoxes(!showBoxes)}
          className="text-xs font-mono text-clay hover:underline flex items-center gap-1.5"
        >
          {showBoxes ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showBoxes ? 'Hide Bounding Boxes' : 'Show Bounding Boxes'}
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-bg2 flex items-center justify-center">
        <img src={imageUrl} alt="Defect analysis target" className="w-full h-full object-cover" />

        {showBoxes &&
          defects.map((def) => {
            const [ymin, xmin, ymax, xmax] = def.box;
            const isSelected = selectedDefect === def.id;
            const isSevere = def.class_name === 'crack' || def.class_name === 'chip';

            return (
              <div
                key={def.id}
                onClick={() => setSelectedDefect(isSelected ? null : def.id)}
                className={`absolute border-2 transition-all cursor-pointer ${
                  isSevere
                    ? 'border-rose-400 bg-rose-400/20'
                    : 'border-amber-400 bg-amber-400/20'
                } ${isSelected ? 'ring-2 ring-white scale-102 z-20' : 'z-10'}`}
                style={{
                  top: `${ymin * 100}%`,
                  left: `${xmin * 100}%`,
                  width: `${(xmax - xmin) * 100}%`,
                  height: `${(ymax - ymin) * 100}%`,
                }}
              >
                <span
                  className={`absolute -top-5 left-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow ${
                    isSevere ? 'bg-rose-500 text-white' : 'bg-amber-400 text-bg'
                  }`}
                >
                  {def.class_name} ({Math.round(def.confidence * 100)}%) [{def.region}]
                </span>
              </div>
            );
          })}
      </div>

      {defects.length === 0 ? (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Clean inspection: Zero surface or structural defects identified.</span>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono">
          {defects.map((def) => (
            <button
              key={def.id}
              onClick={() => setSelectedDefect(selectedDefect === def.id ? null : def.id)}
              className={`px-2 py-1 rounded-lg border text-left ${
                selectedDefect === def.id
                  ? 'bg-clay/20 border-clay text-clay'
                  : 'bg-white/[0.02] border-cardBorder text-mu hover:text-tx'
              }`}
            >
              • {def.class_name} ({def.region} zone)
            </button>
          ))}
        </div>
      )}
    </GlowCard>
  );
};
