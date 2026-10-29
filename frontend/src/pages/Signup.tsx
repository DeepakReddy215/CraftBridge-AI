import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { GlowCard } from '../components/ui/GlowCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, ArrowRight, ShoppingBag, Hammer } from 'lucide-react';
import type { UserRole } from '../types/api';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'customer' | 'artisan'>('customer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsLoading(true);
    try {
      await signup(name, email, role as UserRole);
      if (role === 'artisan') {
        navigate('/artisan');
      } else {
        navigate('/customer');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <GlowCard className="max-w-md w-full p-8" glowColor="teal">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-teal/20 text-teal border border-teal/30 mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-tx">Join CraftBridge</h2>
            <p className="text-xs text-mu mt-1">
              Choose your role to start commissioning or crafting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-tx/80 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs focus:ring-2 focus:ring-teal/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-tx/80 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs focus:ring-2 focus:ring-teal/50 focus:outline-none"
              />
            </div>

            {/* Role Radio Picker (Section 3.3: customer or artisan only) */}
            <div>
              <label className="block text-xs font-mono text-tx/80 mb-2">Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'customer'
                      ? 'bg-clay/10 border-clay shadow-sm'
                      : 'bg-cardBg border-cardBorder hover:border-white/20'
                  }`}
                >
                  <ShoppingBag className={`w-4 h-4 mb-1 ${role === 'customer' ? 'text-clay' : 'text-mu'}`} />
                  <div className="font-bold text-xs text-tx">Customer</div>
                  <div className="text-[10px] text-mu">Commission pottery</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('artisan')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'artisan'
                      ? 'bg-teal/10 border-teal shadow-sm'
                      : 'bg-cardBg border-cardBorder hover:border-white/20'
                  }`}
                >
                  <Hammer className={`w-4 h-4 mb-1 ${role === 'artisan' ? 'text-teal' : 'text-mu'}`} />
                  <div className="font-bold text-xs text-tx">Artisan</div>
                  <div className="text-[10px] text-mu">Craft & inspect</div>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="secondary"
              className="w-full mt-3"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-mu">
            Already have an account?{' '}
            <Link to="/login" className="text-teal hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </GlowCard>
      </div>
    </PageShell>
  );
};
