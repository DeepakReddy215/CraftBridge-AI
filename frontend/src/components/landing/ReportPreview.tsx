import React, { useState } from 'react';
import { Ring } from '../ui/Ring';
import { Chip } from '../ui/Chip';
import { GlowCard } from '../ui/GlowCard';
import { ShieldCheck, Eye, EyeOff, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { formatCurrency, formatPriceRange } from '../../lib/format';

export const ReportPreview: React.FC = () => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <GlowCard className="p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl border-white/10" glowColor="clay">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-cardBorder gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-clay uppercase font-semibold">Live Analysis Preview</span>
            <Chip label="yolov8n-pottery.onnx" variant="teal" size="sm" />
            <Chip label="88% Match" variant="ok" size="sm" />
          </div>
          <h3 className="text-xl font-bold text-tx">Studio Ceramic Carafe (Glazed Terracotta)</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-cardBorder bg-white/5 hover:bg-white/10 text-tx transition-colors"
          >
            {showAnnotations ? <EyeOff className="w-3.5 h-3.5 text-clay" /> : <Eye className="w-3.5 h-3.5" />}
            {showAnnotations ? 'Hide Defect Boxes' : 'Show Defect Boxes'}
          </button>
        </div>
      </div>

      {/* Main Grid: Photo with Defect Boxes + Scoring Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
        {/* Left: Annotated Ceramic Photo */}
        <div className="md:col-span-7 relative rounded-2xl overflow-hidden border border-cardBorder aspect-[4/3] bg-bg2 flex items-center justify-center group">
          <img
            src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
            alt="Handcrafted ceramic vessel undergoing defect analysis"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />

          {/* ONNX YOLO Defect Bounding Boxes */}
          {showAnnotations && (
            <>
              {/* Defect 1: uneven_glaze */}
              <div
                className="absolute border-2 border-amber-400 bg-amber-400/20 rounded shadow-sm transition-all"
                style={{ top: '38%', left: '26%', width: '22%', height: '16%' }}
              >
                <span className="absolute -top-6 left-0 bg-amber-500 text-bg text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                  uneven_glaze 74%
                </span>
              </div>

              {/* Defect 2: stain */}
              <div
                className="absolute border-2 border-amber-300 bg-amber-300/15 rounded shadow-sm transition-all"
                style={{ top: '70%', left: '46%', width: '16%', height: '14%' }}
              >
                <span className="absolute -top-6 left-0 bg-amber-400 text-bg text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                  stain 68%
                </span>
              </div>
            </>
          )}

          {/* Bottom photo overlay caption */}
          <div className="absolute bottom-2 left-2 right-2 bg-bg/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cardBorder text-[11px] font-mono flex items-center justify-between text-tx/80">
            <span>Region: Middle-Left & Foot</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> No structural cracks
            </span>
          </div>
        </div>

        {/* Right: Scores & Valuation */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-around p-4 rounded-2xl bg-white/[0.02] border border-cardBorder">
            <Ring score={86} size={118} strokeWidth={9} sublabel="Pottery Grade A" />
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-mu">Integrity Breakdown:</div>
              <div className="flex justify-between gap-4">
                <span>Structural:</span>
                <span className="text-emerald-400 font-bold">95/100</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Finish:</span>
                <span className="text-amber-400 font-bold">78/100</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Colour:</span>
                <span className="text-emerald-400 font-bold">90/100</span>
              </div>
            </div>
          </div>

          {/* Pricing Estimation Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-cardBorder space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-mu font-medium">Price range (estimate)</span>
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-[11px] text-clay hover:underline flex items-center gap-1 font-mono"
              >
                <Info className="w-3 h-3" />
                {showBreakdown ? 'Hide formula' : 'View formula'}
              </button>
            </div>
            <div className="text-2xl font-bold font-mono text-tx">
              {formatPriceRange(720, 845)}
            </div>

            {showBreakdown && (
              <div className="mt-3 p-3 rounded-xl bg-bg2 border border-cardBorder text-[11px] font-mono text-tx/80 space-y-1 animate-in fade-in">
                <div>• Material (₹160) + Labour (4.5h × ₹65 = ₹292) + Overhead (₹43) = Base ₹495</div>
                <div>• Base × Complexity (1.2) × QualityFactor (1.14) × Margin (1.15)</div>
                <div>• Indicative market range: 0.92x to 1.08x</div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs border-t border-cardBorder/60">
              <span className="text-mu">Demand (indicative):</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                <TrendingUp className="w-3.5 h-3.5" /> High (5/5 Seasonal Bonus)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Fixes Checklist */}
      <div className="pt-4 border-t border-cardBorder">
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-mu mb-3">
          Ranked Artisan Actions (Priority Order)
        </h4>
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-tx">1. Smooth Uneven Glaze Sheen on Mid-Shoulder: </span>
              <span className="text-tx/80">Buff lightly with 400-grit diamond pad and seal with satin micro-wax before dispatch.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-cardBorder text-xs">
            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">2</span>
            <div>
              <span className="font-semibold text-tx">Wipe Kiln Ash Specks from Foot: </span>
              <span className="text-tx/80">Clean foot ring with diluted vinegar bath to remove residual refractory kiln dust.</span>
            </div>
          </div>
        </div>
      </div>
    </GlowCard>
  );
};
