import React from 'react';
import { Sparkles, ShieldCheck, Heart, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-cardBorder bg-bg2/40 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-clay flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <span className="font-bold text-base tracking-tight text-tx">CraftBridge AI</span>
            </div>
            <p className="text-xs text-mu leading-relaxed">
              Precision AI co-pilot bridging heritage handmade pottery with computer vision, fair pricing, and customer intent.
            </p>
          </div>

          {/* Col 2: System Spec */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-tx/90">Zero-Cost Topology</h4>
            <ul className="text-xs text-mu space-y-1.5 font-mono">
              <li>• Render Free (512MB RAM, 0.1 CPU)</li>
              <li>• YOLOv8n ONNX Runtime CPU</li>
              <li>• Gemini Flash + Groq Fallback</li>
              <li>• Supabase Postgres & Storage</li>
            </ul>
          </div>

          {/* Col 3: Fair Crafting */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-tx/90">Transparent Valuation</h4>
            <p className="text-xs text-mu leading-relaxed">
              Prices, demand, and quality are mathematical estimates derived from raw material cost, skilled labour hours, and defect penalty formulas. Never opaque black-box pricing.
            </p>
          </div>

          {/* Col 4: Privacy & Ethics */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-tx/90 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal" /> Privacy Notice
            </h4>
            <p className="text-xs text-mu leading-relaxed">
              We never transmit customer names, phone numbers, or addresses to LLM providers. Prompts contain craft specifications only.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-cardBorder/60 flex flex-col sm:flex-row items-center justify-between text-xs text-mu gap-4">
          <p>© 2026 CraftBridge AI. Built for artisans everywhere.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Free-Tier Verified
            </span>
            <span>•</span>
            <span className="text-mu">Space Grotesk + JetBrains Mono</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
