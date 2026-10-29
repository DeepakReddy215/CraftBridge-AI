import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { BridgeArc } from './BridgeArc';
import { ReportPreview } from './ReportPreview';
import { ArrowRight, Sparkles, CheckCircle2, Cpu, Hammer } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-clay/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-teal/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Chip
            icon={<Sparkles className="w-3.5 h-3.5 text-clay" />}
            label="Zero-Cost Cloud Architecture • YOLOv8n ONNX + Gemini 1.5 Flash"
            variant="clay"
            size="md"
          />
        </div>

        {/* Main H1 Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-tx max-w-5xl mx-auto leading-[1.1]">
          Where Heritage Craft Meets{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay via-amber-400 to-teal">
            Vision Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-mu max-w-3xl mx-auto leading-relaxed">
          CraftBridge AI empowers traditional artisans with instant defect diagnosis, transparent fair pricing, and guided production—while delivering buyers verified handcrafted perfection.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/customer">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Commission Bespoke Piece
            </Button>
          </Link>
          <Link to="/artisan">
            <Button size="lg" variant="outline" leftIcon={<Hammer className="w-4 h-4 text-clay" />}>
              Open Artisan Studio
            </Button>
          </Link>
        </div>

        {/* Key Feature Trust Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-tx/80 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ONNX Defect Detection (Crack, Chip, Glaze)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transparent Cost-Plus Pricing
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free-Tier Gemini & Groq Gateway
          </span>
        </div>

        {/* Dynamic Bridge Arc */}
        <div className="mt-12">
          <BridgeArc />
        </div>

        {/* Live Interactive Report Preview */}
        <div className="mt-10">
          <ReportPreview />
        </div>
      </div>
    </section>
  );
};
