import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Ring } from '../ui/Ring';
import { Chip } from '../ui/Chip';
import { AnnotatedPhoto } from './AnnotatedPhoto';
import { FixList } from './FixList';
import { formatPriceRange, formatCurrency } from '../../lib/format';
import { TrendingUp, Calculator, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import type { AnalysisResult } from '../../types/api';

export const ReportView: React.FC<{ analysis: AnalysisResult }> = ({ analysis }) => {
  const [showFormula, setShowFormula] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Banner: Quality Score, Price, Demand */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Ring & Quality */}
        <GlowCard className="p-4 flex items-center justify-around" glowColor="clay">
          <Ring score={analysis.quality_score} size={115} strokeWidth={9} sublabel="Overall Score" />
          <div className="text-xs font-mono space-y-1">
            <div className="text-mu">Subscores:</div>
            <div className="text-tx/90">Structural: <span className="text-emerald-400 font-bold">{analysis.subscores.structural}</span></div>
            <div className="text-tx/90">Finish: <span className="text-amber-400 font-bold">{analysis.subscores.finish}</span></div>
            <div className="text-tx/90">Pattern: <span className="text-emerald-400 font-bold">{analysis.subscores.pattern}</span></div>
          </div>
        </GlowCard>

        {/* Fair Price Range */}
        <GlowCard className="p-5 flex flex-col justify-between" glowColor="teal">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-mu">Price range (estimate)</span>
              <Chip label="Cost-Plus" variant="teal" size="sm" />
            </div>
            <div className="text-2xl font-bold font-mono text-tx mt-2">
              {formatPriceRange(analysis.price_low, analysis.price_high)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFormula(!showFormula)}
            className="text-[11px] font-mono text-clay flex items-center gap-1 hover:underline pt-2 mt-2 border-t border-cardBorder"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{showFormula ? 'Hide Formula Breakdown' : 'Show Formula Breakdown'}</span>
            {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </GlowCard>

        {/* Demand Badge */}
        <GlowCard className="p-5 flex flex-col justify-between" glowColor="neutral">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-mu">Demand (indicative)</span>
              <Chip
                label={analysis.demand_level}
                variant={analysis.demand_level === 'High' ? 'ok' : 'warn'}
                size="sm"
              />
            </div>
            <div className="text-xl font-bold font-mono text-tx mt-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Score {analysis.demand_score} / 5</span>
            </div>
          </div>
          <span className="text-[11px] text-mu pt-2 mt-2 border-t border-cardBorder font-mono">
            Seasonal craft boost active
          </span>
        </GlowCard>
      </div>

      {/* Expandable Formula Breakdown Panel */}
      {showFormula && (
        <GlowCard className="p-5 bg-white/[0.02]" glowColor="clay">
          <h4 className="text-xs font-mono font-bold text-clay uppercase mb-2">
            Deterministic Price Formula Audit
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-tx/85">
            <div className="space-y-1.5 p-3 rounded-xl bg-bg2 border border-cardBorder">
              <div>• Base = Material (₹160) + Labour (4.5h × ₹65) + Overhead (₹43) = ₹495</div>
              <div>• Complexity Multiplier: Medium = 1.20x</div>
              <div>• Quality Factor: 0.80 + (0.40 × {analysis.quality_score}/100) = 1.144x</div>
            </div>
            <div className="space-y-1.5 p-3 rounded-xl bg-bg2 border border-cardBorder">
              <div>• Studio Margin: 15% (1.15x)</div>
              <div>• Midpoint Price: ₹495 × 1.20 × 1.144 × 1.15 = ₹781</div>
              <div>• Indicative Bounds (0.92x to 1.08x): ₹720 to ₹845</div>
            </div>
          </div>
        </GlowCard>
      )}

      {/* Match Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-mu">Customer Match:</span>
        <Chip label={`Total Match: ${analysis.match_pct}%`} variant="ok" size="md" />
        <Chip label={`Colour: ${analysis.match_detail.colour_score}/30`} variant="neutral" size="sm" />
        <Chip label={`Pattern: ${analysis.match_detail.pattern_score}/25`} variant="neutral" size="sm" />
        <Chip label={`Type: ${analysis.match_detail.type_score}/20`} variant="neutral" size="sm" />
        <Chip label={`Size: ${analysis.match_detail.size_score}/15`} variant="neutral" size="sm" />
        <Chip label={`Style: ${analysis.match_detail.style_score}/10`} variant="neutral" size="sm" />
      </div>

      {/* Main Grid: Annotated Photo + Ranked Fixes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6">
          <AnnotatedPhoto
            imageUrl={analysis.annotated_path}
            defects={analysis.defects}
          />
        </div>
        <div className="md:col-span-6">
          <FixList
            fixes={analysis.report.ranked_fixes}
            praise={analysis.report.artisan_praise}
          />
        </div>
      </div>
    </div>
  );
};
