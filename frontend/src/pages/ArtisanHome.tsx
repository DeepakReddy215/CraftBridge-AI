import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { GlowCard } from '../components/ui/GlowCard';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { useRequestList } from '../hooks/useRequest';
import { formatCurrency, formatDate } from '../lib/format';
import { Hammer, Sparkles, Camera, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ArtisanHome: React.FC = () => {
  const { requests, loading } = useRequestList('artisan');

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Atelier Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cardBorder">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hammer className="w-5 h-5 text-teal" />
              <h1 className="text-2xl font-bold text-tx">Artisan Atelier Studio</h1>
            </div>
            <p className="text-xs text-mu">
              Workshop queue: receive AI throwing briefs, verify photo quality, and generate fair-value diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Chip label="Devi Prasad Studio" variant="teal" size="md" />
            <Chip label="Master Thrower" variant="clay" size="sm" />
          </div>
        </div>

        {/* Requests Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-wider text-tx/80 font-semibold">
              Assigned Workshop Orders ({requests.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <GlowCard key={req.id} className="p-6 flex flex-col justify-between" glowColor="teal">
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
                  <div className="text-xs font-mono text-teal mb-3">{req.size_label}</div>

                  <p className="text-xs text-mu line-clamp-2 mb-4 leading-relaxed">
                    {req.purpose || 'Studio craft request'}
                  </p>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-cardBorder mb-4 text-xs font-mono text-tx/80 flex justify-between">
                    <span>Target Budget:</span>
                    <span className="font-bold text-clay">{formatCurrency(req.budget)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-cardBorder space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link to={`/artisan/requests/${req.id}/brief`}>
                      <Button size="sm" variant="outline" className="w-full text-xs" leftIcon={<FileText className="w-3.5 h-3.5 text-clay" />}>
                        A1/A2 Brief
                      </Button>
                    </Link>
                    <Link to={`/artisan/requests/${req.id}/upload`}>
                      <Button size="sm" variant="secondary" className="w-full text-xs" leftIcon={<Camera className="w-3.5 h-3.5" />}>
                        A3 Upload
                      </Button>
                    </Link>
                  </div>

                  <Link to={`/artisan/requests/${req.id}/report`} className="block">
                    <Button size="sm" variant="ghost" className="w-full text-xs text-mu hover:text-tx">
                      View A4 Diagnostic Report →
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
