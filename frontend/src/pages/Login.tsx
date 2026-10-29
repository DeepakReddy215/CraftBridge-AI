import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { GlowCard } from '../components/ui/GlowCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, ArrowRight, UserCheck, Hammer, ShoppingBag, ShieldCheck } from 'lucide-react';
import type { UserRole } from '../types/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('devi.potter@craftbridge.io');
  const [role, setRole] = useState<UserRole>('artisan');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, role);
      if (role === 'artisan') {
        navigate('/artisan');
      } else if (role === 'customer') {
        navigate('/customer');
      } else {
        const forgeSlug = import.meta.env.VITE_FORGE_SLUG || 'forge-secret-8931';
        navigate(`/${forgeSlug}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginAs = async (chosenRole: UserRole, mockEmail: string) => {
    setIsLoading(true);
    try {
      await login(mockEmail, chosenRole);
      if (chosenRole === 'artisan') navigate('/artisan');
      else if (chosenRole === 'customer') navigate('/customer');
      else {
        const forgeSlug = import.meta.env.VITE_FORGE_SLUG || 'forge-secret-8931';
        navigate(`/${forgeSlug}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <GlowCard className="max-w-md w-full p-8" glowColor="clay">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-clay to-[#b84e1b] mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-clay/20">
              <Sparkles className="w-6 h-6 text-amber-200" />
            </div>
            <h2 className="text-2xl font-bold text-tx">Sign In to CraftBridge</h2>
            <p className="text-xs text-mu mt-1">Access your atelier dashboard or customer orders</p>
          </div>

          {/* Quick Demo Role Selectors */}
          <div className="mb-6 space-y-2">
            <span className="text-[11px] font-mono text-mu uppercase tracking-wider block text-center">
              Instant Demo Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLoginAs('customer', 'anita.patron@craftbridge.io')}
                className="p-2.5 rounded-xl border border-cardBorder bg-white/[0.02] hover:border-clay hover:bg-clay/5 text-center transition-all text-xs flex flex-col items-center gap-1"
              >
                <ShoppingBag className="w-4 h-4 text-clay" />
                <span className="font-semibold text-tx">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => quickLoginAs('artisan', 'devi.potter@craftbridge.io')}
                className="p-2.5 rounded-xl border border-cardBorder bg-white/[0.02] hover:border-teal hover:bg-teal/5 text-center transition-all text-xs flex flex-col items-center gap-1"
              >
                <Hammer className="w-4 h-4 text-teal" />
                <span className="font-semibold text-tx">Artisan</span>
              </button>

              <button
                type="button"
                onClick={() => quickLoginAs('developer', 'dev.lead@craftbridge.io')}
                className="p-2.5 rounded-xl border border-cardBorder bg-white/[0.02] hover:border-amber-400 hover:bg-amber-400/5 text-center transition-all text-xs flex flex-col items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-tx">Forge Dev</span>
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cardBorder" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-bg2 px-2 text-mu">Or enter credentials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-tx/80 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs focus:ring-2 focus:ring-clay/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-tx/80 mb-1">Select Persona</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs focus:ring-2 focus:ring-clay/50 focus:outline-none font-mono"
              >
                <option value="customer">Customer / Patron</option>
                <option value="artisan">Artisan / Potter</option>
                <option value="developer">Developer (Model Forge)</option>
              </select>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Enter Dashboard
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-mu">
            Don't have an account?{' '}
            <Link to="/signup" className="text-clay hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </GlowCard>
      </div>
    </PageShell>
  );
};
