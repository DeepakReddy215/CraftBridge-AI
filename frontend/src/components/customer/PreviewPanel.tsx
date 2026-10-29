import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Chip } from '../ui/Chip';
import { Ring } from '../ui/Ring';
import { Bar } from '../ui/Bar';
import { Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { AnalysisResult } from '../../types/api';
import { formatPriceRange } from '../../lib/format';

export const PreviewPanel: React.FC<{ analysis: AnalysisResult }> = ({ analysis }) => {
  const [showBoxes, setShowBoxes] = useState(true);

  return (
    <div className="space-y-6">
      {/* Top Banner: Match Score & Quality Grade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlowCard className="p-4 flex items-center justify-between" glowColor="teal">
          <div>
            <span className="text-xs text-mu font-mono">Intent Match</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {analysis.match_pct}%
            </div>
            <span className="text-[11px] text-mu">Aligned with brief specs</span>
          </div>
          <Chip label="High Alignment" variant="ok" size="sm" />
        </GlowCard>

        <GlowCard className="p-4 flex items-center justify-between" glowColor="clay">
          <div>
            <span className="text-xs text-mu font-mono">Craft Quality Score</span>
            <div className="text-2xl font-bold font-mono text-clay">
              {analysis.quality_score}/100
            </div>
            <span className="text-[11px] text-mu">Vitrification & integrity</span>
          </div>
          <Chip label="Grade A Pottery" variant="clay" size="sm" />
        </GlowCard>

        <GlowCard className="p-4 flex items-center justify-between" glowColor="neutral">
          <div>
            <span className="text-xs text-mu font-mono">Fair Price Range</span>
            <div className="text-xl font-bold font-mono text-tx">
              {formatPriceRange(analysis.price_low, analysis.price_high)}
            </div>
            <span className="text-[11px] text-mu">Transparent cost breakdown</span>
          </div>
          <Chip label="Cost-Plus Verified" variant="neutral" size="sm" />
        </GlowCard>
      </div>

      {/* Main Review: Annotated Photo & Match Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Photo Display */}
        <div className="md:col-span-7">
          <GlowCard className="p-4" glowColor="clay">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cardBorder">
              <span className="text-xs font-mono text-tx font-medium">Finished Piece Review</span>
              <button
                type="button"
                onClick={() => setShowBoxes(!showBoxes)}
                className="text-xs font-mono text-clay hover:underline flex items-center gap-1"
              >
                {showBoxes ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showBoxes ? 'Hide Defect Boxes' : 'Show Defect Boxes'}
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-bg2 flex items-center justify-center">
              <img
                src={analysis.annotated_path}
                alt="Finished piece ready for approval"
                className="w-full h-full object-cover"
              />

              {showBoxes &&
                analysis.defects.map((def) => {
                  const [ymin, xmin, ymax, xmax] = def.box;
                  return (
                    <div
                      key={def.id}
                      className="absolute border-2 border-amber-400 bg-amber-400/20 rounded pointer-events-none"
                      style={{
                        top: `${ymin * 100}%`,
                        left: `${xmin * 100}%`,
                        width: `${(xmax - xmin) * 100}%`,
                        height: `${(ymax - ymin) * 100}%`,
                      }}
                    >
                      <span className="absolute -top-5 left-0 bg-amber-500 text-bg text-[9px] font-mono font-bold px-1 py-0.5 rounded shadow">
                        {def.class_name} {Math.round(def.confidence * 100)}%
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className="mt-3 text-[11px] font-mono text-mu flex items-center justify-between">
              <span>Model: {analysis.model_version}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Firing structure verified
              </span>
            </div>
          </GlowCard>
        </div>

        {/* Scoring & Notes Breakdown */}
        <div className="md:col-span-5 space-y-4">
          <GlowCard className="p-5" glowColor="teal">
            <h4 className="text-xs font-mono uppercase tracking-wider text-teal font-semibold mb-3">
              Intent Match Metrics
            </h4>
            <div className="space-y-3">
              <Bar value={analysis.match_detail.colour_score} label="Colour Palette Harmony" color="clay" size="sm" />
              <Bar value={analysis.match_detail.pattern_score} label="Texture & Fluting Fidelity" color="teal" size="sm" />
              <Bar value={analysis.match_detail.type_score} label="Vessel Silhouette Accuracy" color="emerald" size="sm" />
              <Bar value={analysis.match_detail.size_score} label="Dimensional Tolerance" color="teal" size="sm" />
            </div>

            <div className="mt-4 pt-3 border-t border-cardBorder text-xs text-tx/80 leading-relaxed">
              <span className="font-semibold text-tx">Analysis Summary: </span>
              {analysis.match_detail.notes}
            </div>
          </GlowCard>

          <GlowCard className="p-5" glowColor="neutral">
            <h4 className="text-xs font-mono uppercase tracking-wider text-mu font-semibold mb-2">
              Patron Guidance
            </h4>
            <p className="text-xs text-mu leading-relaxed">
              {analysis.report.customer_guidance}
            </p>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};
