import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { AlertTriangle, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';
import type { RankedFix } from '../../types/api';

export const FixList: React.FC<{ fixes: RankedFix[]; praise?: string }> = ({
  fixes,
  praise,
}) => {
  const getBadgeStyle = (priority: RankedFix['priority']) => {
    switch (priority) {
      case 'structural':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'finish':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'cosmetic':
        return 'bg-teal/15 text-teal border-teal/30';
      default:
        return 'bg-white/10 text-mu border-cardBorder';
    }
  };

  return (
    <div className="space-y-4">
      {praise && (
        <GlowCard className="p-4 bg-emerald-950/10 border-emerald-500/20" glowColor="teal">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase">
                Master Potter Evaluation
              </span>
              <p className="text-xs text-tx/90 mt-1 leading-relaxed">{praise}</p>
            </div>
          </div>
        </GlowCard>
      )}

      <div>
        <h4 className="text-xs font-mono uppercase tracking-wider text-mu font-semibold mb-3">
          Ranked Artisan Actions & Polish Roadmap
        </h4>

        {fixes.length === 0 ? (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-cardBorder text-xs text-mu text-center">
            No corrective actions needed. The piece meets high grade standards!
          </div>
        ) : (
          <div className="space-y-3">
            {fixes.map((fix, idx) => (
              <GlowCard key={idx} className="p-4" glowColor={fix.priority === 'structural' ? 'clay' : 'teal'}>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-cardBorder flex items-center justify-center text-xs font-mono font-bold text-tx shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${getBadgeStyle(fix.priority)}`}>
                        {fix.priority}
                      </span>
                      <h5 className="text-sm font-bold text-tx">{fix.title}</h5>
                    </div>
                    <p className="text-xs text-mu leading-relaxed">{fix.description}</p>
                    <div className="mt-2 p-2.5 rounded-xl bg-white/[0.02] border border-cardBorder text-xs text-tx/90 flex items-start gap-2">
                      <Wrench className="w-3.5 h-3.5 text-clay shrink-0 mt-0.5" />
                      <span>
                        <strong>Workshop Action: </strong>
                        {fix.action_step}
                      </span>
                    </div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
