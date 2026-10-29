import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { ShoppingBag, Hammer, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Roles: React.FC = () => {
  return (
    <section className="py-20 border-t border-cardBorder relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-mu font-semibold">
            Dual Persona Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-tx mt-2">
            Tailored Experiences For Every Maker & Patron
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Card */}
          <GlowCard className="p-8 flex flex-col justify-between" glowColor="clay">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-clay/15 text-clay border border-clay/30 flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-clay font-semibold">
                For Patrons & Collectors
              </span>
              <h3 className="text-2xl font-bold text-tx mt-1 mb-3">
                Bespoke Artisanal Commissioning
              </h3>
              <p className="text-sm text-mu leading-relaxed mb-6">
                Turn your decorative ideas into reality without ambiguity. Select product silhouettes, ceramic color swatches, and budget caps. Watch the piece come alive with verified quality checkpoints.
              </p>
              <ul className="space-y-2.5 text-xs text-tx/90 mb-8 font-mono">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-clay" /> Visual match percentage against your reference
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-clay" /> Verified absence of hairline structural cracks
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-clay" /> 1-Click revision feedback before dispatch
                </li>
              </ul>
            </div>
            <Link to="/customer">
              <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Patron Request
              </Button>
            </Link>
          </GlowCard>

          {/* Artisan Card */}
          <GlowCard className="p-8 flex flex-col justify-between" glowColor="teal">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal/15 text-teal border border-teal/30 flex items-center justify-center mb-6">
                <Hammer className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-teal font-semibold">
                For Independent Potters & Studios
              </span>
              <h3 className="text-2xl font-bold text-tx mt-1 mb-3">
                Intelligent Studio Assistant
              </h3>
              <p className="text-sm text-mu leading-relaxed mb-6">
                Never undercharge your craftsmanship again. Receive structured briefs, step-by-step drying/firing guidance, automatic defect diagnostics, and an auditable fair market valuation.
              </p>
              <ul className="space-y-2.5 text-xs text-tx/90 mb-8 font-mono">
                <li className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-teal" /> Guaranteed fair compensation based on labour hours
                </li>
                <li className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-teal" /> Prioritized actionable fixes (polish, re-fire, sponge)
                </li>
                <li className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-teal" /> Client-side photo quality and lighting verification
                </li>
              </ul>
            </div>
            <Link to="/artisan">
              <Button variant="secondary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Open Artisan Workspace
              </Button>
            </Link>
          </GlowCard>
        </div>
      </div>
    </section>
  );
};
