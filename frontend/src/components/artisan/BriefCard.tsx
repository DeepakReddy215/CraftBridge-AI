import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Chip } from '../ui/Chip';
import { Sparkles, Layers, Ruler, AlertCircle } from 'lucide-react';
import type { CraftBrief } from '../../types/api';

export const BriefCard: React.FC<{ brief: CraftBrief }> = ({ brief }) => {
  const { brief_json, source } = brief;

  return (
    <GlowCard className="p-6 sm:p-8" glowColor="clay">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cardBorder gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-clay/20 text-clay flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-tx">A1 AI Craft Brief: {brief_json.product}</h3>
            <span className="text-xs text-mu font-mono">Synthesized for studio execution</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Chip
            label={`Source: ${source.toUpperCase()}`}
            variant={source === 'gemini' ? 'clay' : source === 'groq' ? 'teal' : 'neutral'}
            size="sm"
          />
          {source === 'template' && (
            <span className="text-[10px] text-amber-400 font-mono">(Offline basic template)</span>
          )}
        </div>
      </div>

      <div className="my-6 space-y-4">
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-mu mb-1">Executive Summary</h4>
          <p className="text-sm text-tx/90 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-cardBorder">
            {brief_json.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Dimensions */}
          <div className="p-4 rounded-xl bg-bg2 border border-cardBorder space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-clay font-semibold uppercase">
              <Ruler className="w-3.5 h-3.5" /> Target Dimensions & Caliper Band
            </div>
            <p className="text-xs font-mono text-tx font-medium">{brief_json.target_dimensions}</p>
          </div>

          {/* Clay Body */}
          <div className="p-4 rounded-xl bg-bg2 border border-cardBorder space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-teal font-semibold uppercase">
              <Layers className="w-3.5 h-3.5" /> Clay Body & Firing Recommendation
            </div>
            <p className="text-xs text-tx font-medium">{brief_json.clay_body_recommendation}</p>
          </div>
        </div>

        {/* Aesthetic Notes */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-mu mb-1">Aesthetic & Surface Finish</h4>
          <p className="text-xs text-tx/80">{brief_json.aesthetic_notes}</p>
        </div>

        {/* Critical Tolerances */}
        {brief_json.critical_tolerances?.length > 0 && (
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-clay mb-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Critical Tolerances & Checkpoints
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {brief_json.critical_tolerances.map((tol, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-clay/5 border border-clay/20 text-[11px] font-mono text-tx/90 flex items-start gap-1.5"
                >
                  <span className="text-clay font-bold">#{i + 1}</span>
                  <span>{tol}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlowCard>
  );
};
