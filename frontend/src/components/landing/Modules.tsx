import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Cpu, Calculator, Zap, Terminal } from 'lucide-react';

const MODULES = [
  {
    icon: <Zap className="w-6 h-6 text-clay" />,
    name: 'Unified AI Gateway',
    tag: 'Free Tier Resilience',
    description:
      'Single entry point enforcing strict rate-limits (RPM/RPD token buckets), SHA-256 caching, Pydantic validation, and seamless fallback from Gemini 1.5 Flash to Groq Llama 3.3 to deterministic offline templates.',
    features: ['Zero PII transmission', '90% daily budget guard', 'Sub-second cached hits'],
  },
  {
    icon: <Cpu className="w-6 h-6 text-teal" />,
    name: 'ONNX Defect Engine',
    tag: '512MB RAM Optimized',
    description:
      'Lightweight YOLOv8n exported to ONNX, executing in-process on CPU with onnxruntime. Detects micro-cracks, rim chips, glaze crawl, and kiln ash stains without heavy PyTorch dependencies.',
    features: ['< 180MB RAM footprint', 'Async single-inference lock', 'Normalized coordinates'],
  },
  {
    icon: <Calculator className="w-6 h-6 text-amber-400" />,
    name: 'Deterministic Fair Pricing',
    tag: 'Transparent Mathematics',
    description:
      'Plain Python formulas eliminate black-box markups. Prices are calculated transparently from material costs, verified artisan labour hours, complexity scale, and kiln overhead.',
    features: ['Auditable formula breakdown', 'Seasonal demand indices', 'Indicative market bounds'],
  },
  {
    icon: <Terminal className="w-6 h-6 text-emerald-400" />,
    name: 'Model Forge (MLOps)',
    tag: 'Cloud-Agnostic Training',
    description:
      'Zero Render GPU overhead. Generates ready-to-run Google Colab and Kaggle notebooks, receives real-time epoch metrics via webhooks, and hot-swaps candidate models with smoke testing.',
    features: ['Live loss & mAP curves', 'Candidate vs. Active compare', 'Passphrase guarded'],
  },
];

export const Modules: React.FC = () => {
  return (
    <section className="py-20 border-t border-cardBorder relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-clay font-semibold">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-tx mt-2">
            Engineered For Free-Tier Excellence
          </h2>
          <p className="text-mu text-sm sm:text-base mt-3">
            Every module is tailored to run indefinitely within 512MB RAM and zero-cost cloud quotas without sacrificing precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODULES.map((m) => (
            <GlowCard key={m.name} className="p-7" glowColor="teal">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-cardBorder flex items-center justify-center shrink-0">
                  {m.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-teal font-semibold uppercase">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-tx mb-2">{m.name}</h3>
                  <p className="text-xs text-mu leading-relaxed mb-4">{m.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {m.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-cardBorder text-tx/80"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};
