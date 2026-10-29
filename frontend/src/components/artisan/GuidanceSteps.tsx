import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { CheckCircle2, ChevronRight, Lightbulb, Compass } from 'lucide-react';
import type { GuidanceStep } from '../../types/api';

export const GuidanceSteps: React.FC<{ stages: GuidanceStep[]; checklist?: string[] }> = ({
  stages,
  checklist = [],
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-tx">A2 Step-By-Step Workshop Guidance</h3>
          <p className="text-xs text-mu">One clear decision per stage. Check off milestones as you throw.</p>
        </div>
        <span className="text-xs font-mono text-clay">
          {completedSteps.length} of {stages.length} Completed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((stage) => {
          const isDone = completedSteps.includes(stage.step);

          return (
            <GlowCard
              key={stage.step}
              className={`p-5 flex flex-col justify-between transition-all ${
                isDone ? 'border-emerald-500/40 bg-emerald-950/10' : ''
              }`}
              glowColor={isDone ? 'teal' : 'clay'}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-clay">
                    Stage {stage.step}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleStep(stage.step)}
                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                        : 'bg-white/5 text-mu border-cardBorder hover:text-tx'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isDone ? 'Milestone Met' : 'Mark Done'}
                  </button>
                </div>

                <h4 className="text-base font-bold text-tx mb-1">{stage.title}</h4>
                <div className="text-xs font-mono text-teal mb-2">Primary Focus: {stage.focus}</div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-cardBorder text-xs text-tx/90 mb-3">
                  <span className="font-semibold text-tx">Caliper Checkpoint: </span>
                  {stage.checkpoint}
                </div>

                {stage.tip && (
                  <div className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    <Lightbulb className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>{stage.tip}</span>
                  </div>
                )}
              </div>
            </GlowCard>
          );
        })}
      </div>

      {checklist.length > 0 && (
        <GlowCard className="p-5" glowColor="neutral">
          <h4 className="text-xs font-mono uppercase tracking-wider text-tx font-semibold mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-clay" /> Pre-Kiln Quality Sign-Off Checklist
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-tx/80 font-mono">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-cardBorder">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </GlowCard>
      )}
    </div>
  );
};
