import React from 'react';
import { Stepper } from '../ui/Stepper';
import { GlowCard } from '../ui/GlowCard';
import { formatDate } from '../../lib/format';
import type { CraftRequest } from '../../types/api';
import { UserCheck, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export const StatusTimeline: React.FC<{ request: CraftRequest }> = ({ request }) => {
  return (
    <GlowCard className="p-6" glowColor="clay">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cardBorder gap-2">
        <div>
          <span className="text-[11px] font-mono text-mu uppercase">Request Identifier</span>
          <div className="text-base font-bold font-mono text-tx flex items-center gap-2">
            <span>#{request.id}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-clay/15 text-clay border border-clay/30 font-sans">
              {request.product}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-mu">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Placed {formatDate(request.created_at)}</span>
          </div>
          {request.artisan_id ? (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Artisan Assigned</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Matching Artisan</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Stepper currentStatus={request.status} />
      </div>
    </GlowCard>
  );
};
