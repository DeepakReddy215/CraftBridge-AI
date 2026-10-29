import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { 
  FileEdit, 
  Sparkles, 
  Flame, 
  Camera, 
  Cpu, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';

const LIFECYCLE_STAGES = [
  {
    step: '1',
    status: 'DRAFT',
    icon: <FileEdit className="w-5 h-5 text-mu" />,
    title: 'Customer Intent',
    description: 'Buyer selects product silhouettes, color swatches, dimensions, and target budget.',
  },
  {
    step: '2',
    status: 'BRIEFED',
    icon: <Sparkles className="w-5 h-5 text-clay" />,
    title: 'AI Craft Brief',
    description: 'Gemini synthesizes a technical brief: clay body, moisture tolerances, and step checkpoints.',
  },
  {
    step: '3',
    status: 'IN_PROGRESS',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
    title: 'Artisan Throwing',
    description: 'Artisan receives plain-language step milestones for centering, throwing, trimming, and firing.',
  },
  {
    step: '4',
    status: 'UPLOADED',
    icon: <Camera className="w-5 h-5 text-teal" />,
    title: 'Multi-Angle Photos',
    description: '4 standardized photos captured with client-side blur and illumination verification.',
  },
  {
    step: '5',
    status: 'ANALYSED',
    icon: <Cpu className="w-5 h-5 text-clay" />,
    title: 'YOLOv8n ONNX & Vision',
    description: 'Micro-cracks, glaze crawling, and shape deviations detected with sub-second inference.',
  },
  {
    step: '6',
    status: 'PREVIEWED',
    icon: <RotateCcw className="w-5 h-5 text-amber-300" />,
    title: 'Collaborative Review',
    description: 'Customer reviews match percentage and report summary; requests minor polish if needed.',
  },
  {
    step: '7',
    status: 'APPROVED',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    title: 'Fair-Value Dispatch',
    description: 'Final piece certified with transparent cost breakdown and authentic craft badge.',
  },
];

export const Lifecycle: React.FC = () => {
  return (
    <section className="py-20 border-t border-cardBorder relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-teal font-semibold">
            End-To-End Provenance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-tx mt-2">
            The 7-Stage Craft Lifecycle
          </h2>
          <p className="text-mu text-sm sm:text-base mt-3">
            Every commissioned piece flows through a transparent, verified lifecycle from first sketch to final kiln discharge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {LIFECYCLE_STAGES.map((s, idx) => (
            <GlowCard
              key={s.step}
              className={`p-5 flex flex-col justify-between ${idx === 6 ? 'lg:col-span-2' : ''}`}
              glowColor={idx % 2 === 0 ? 'clay' : 'teal'}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-cardBorder flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-mu px-2 py-0.5 rounded-full bg-white/[0.03] border border-cardBorder">
                    0{s.step}
                  </span>
                </div>
                <div className="text-xs font-mono text-clay uppercase font-semibold mb-1">
                  {s.status}
                </div>
                <h3 className="font-bold text-base text-tx mb-2">{s.title}</h3>
                <p className="text-xs text-mu leading-relaxed">{s.description}</p>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};
