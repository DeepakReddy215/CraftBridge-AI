import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { SunMedium, Camera, Focus, Ban, ShieldCheck } from 'lucide-react';

export const CaptureGuide: React.FC = () => {
  return (
    <GlowCard className="p-5" glowColor="teal">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="w-5 h-5 text-teal" />
        <h4 className="text-sm font-bold text-tx">A3 Workshop Capture Standards</h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal/15 text-teal">Automated Gate</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-tx/80">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-cardBorder space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-tx">
            <SunMedium className="w-4 h-4 text-amber-400" /> Diffused Lighting
          </div>
          <p className="text-mu text-[11px]">
            Use bright, indirect daylight or neutral studio lamp. Harsh single-point flash causes artificial glaze glare.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-cardBorder space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-tx">
            <Focus className="w-4 h-4 text-emerald-400" /> Sharp Focus
          </div>
          <p className="text-mu text-[11px]">
            Tap your screen to focus right on the rim or neck before capturing. Blurry shots trigger an instant retake prompt.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-cardBorder space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-tx">
            <Ban className="w-4 h-4 text-rose-400" /> Clean Background
          </div>
          <p className="text-mu text-[11px]">
            Set piece against a plain wooden table or cloth background. Remove hands, pottery tools, and clutter.
          </p>
        </div>
      </div>
    </GlowCard>
  );
};
