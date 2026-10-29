import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { GlowCard } from '../components/ui/GlowCard';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { useRequestList } from '../hooks/useRequest';
import { formatCurrency, formatDate } from '../lib/format';
import { Plus, ShoppingBag, ArrowRight, Clock, Sparkles } from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const { requests, loading } = useRequestList('customer');

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cardBorder">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-5 h-5 text-clay" />
              <h1 className="text-2xl font-bold text-tx">Patron Commission Dashboard</h1>
            </div>
            <p className="text-xs text-mu">
              Track your bespoke pottery commissions from brief synthesis to final certified delivery.
            </p>
          </div>
          <Link to="/customer/new">
            <Button size="md" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Commission New Vessel
            </Button>
          </Link>
        </div>

        {/* Requests Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-wider text-tx/80 font-semibold">
              Active Commissions ({requests.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <GlowCard key={req.id} className="p-6 flex flex-col justify-between" glowColor="clay">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-mu font-bold">#{req.id}</span>
                    <Chip
                      label={req.status}
                      variant={
                        req.status === 'APPROVED'
                          ? 'ok'
                          : req.status === 'ANALYSED'
                          ? 'teal'
                          : req.status === 'IN_PROGRESS'
                          ? 'clay'
                          : 'neutral'
                      }
                      size="sm"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-tx mb-1">{req.product}</h3>
                  <div className="text-xs font-mono text-clay mb-3">{req.style}</div>

                  <p className="text-xs text-mu line-clamp-2 mb-4 leading-relaxed">
                    {req.purpose || 'Custom hand-thrown pottery design'}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-mono text-mu">Palette:</span>
                    <div className="flex items-center gap-1.5">
                      {req.colors.map((c) => (
                        <div
                          key={c}
                          className="w-4 h-4 rounded-full border border-cardBorder"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-cardBorder flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-mu block">Budget</span>
                    <span className="font-mono text-sm font-bold text-tx">
                      {formatCurrency(req.budget)}
                    </span>
                  </div>

                  <Link to={`/customer/requests/${req.id}`}>
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Progress
                    </Button>
                  </Link>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};
