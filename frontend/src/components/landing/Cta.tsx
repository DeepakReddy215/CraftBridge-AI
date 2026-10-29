import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Cta: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlowCard className="p-10 sm:p-16 text-center max-w-4xl mx-auto relative overflow-hidden" glowColor="clay">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clay/20 text-clay text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Ready for Zero-Cost Production
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-tx tracking-tight">
              Start Bridging Heritage Craft & AI Today
            </h2>

            <p className="text-sm sm:text-base text-mu max-w-2xl mx-auto leading-relaxed">
              Experience the end-to-end workflow: submit a bespoke request, generate an automated craft brief, run ONNX defect detection, and inspect fair-value pricing.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/customer">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Customer Journey
                </Button>
              </Link>
              <Link to="/artisan">
                <Button size="lg" variant="outline">
                  Explore Artisan Journey
                </Button>
              </Link>
            </div>
          </div>
        </GlowCard>
      </div>
    </section>
  );
};
