import React from 'react';
import { clsx } from 'clsx';
import { Check, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import type { RequestStatus } from '../../types/api';

const STATUS_STEPS: { status: RequestStatus; label: string }[] = [
  { status: 'DRAFT', label: 'Draft' },
  { status: 'BRIEFED', label: 'AI Briefed' },
  { status: 'IN_PROGRESS', label: 'Crafting' },
  { status: 'UPLOADED', label: 'Photos Uploaded' },
  { status: 'ANALYSED', label: 'Quality Analysed' },
  { status: 'PREVIEWED', label: 'Reviewing' },
  { status: 'APPROVED', label: 'Approved' },
];

export interface StepperProps {
  currentStatus: RequestStatus;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ currentStatus, className }) => {
  const currentIndex = STATUS_STEPS.findIndex(s => s.status === currentStatus);
  const isRevision = currentStatus === 'REVISION_REQUESTED';

  return (
    <div className={clsx('w-full py-4', className)}>
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 dark:bg-white/10 -translate-y-1/2 z-0" />

        {STATUS_STEPS.map((step, index) => {
          const isDone = index < currentIndex || (currentStatus === 'APPROVED' && index <= currentIndex);
          const isCurrent = step.status === currentStatus || (isRevision && step.status === 'PREVIEWED');

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center">
              <div
                className={clsx(
                  'w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all duration-300',
                  isDone && 'bg-emerald-500 text-bg ring-4 ring-emerald-500/20',
                  isCurrent && !isDone && 'bg-clay text-white ring-4 ring-clay/30 animate-pulse',
                  !isDone && !isCurrent && 'bg-bg2 text-mu border border-cardBorder'
                )}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isCurrent ? (
                  isRevision ? (
                    <AlertTriangle className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={clsx(
                  'text-[11px] mt-2 font-medium tracking-tight text-center max-w-[80px]',
                  isCurrent ? 'text-clay font-bold' : isDone ? 'text-tx/90' : 'text-mu'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {isRevision && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-400 bg-amber-500/10 py-1.5 px-3 rounded-lg border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" />
          <span>Customer requested revision — artisan updating piece</span>
        </div>
      )}
    </div>
  );
};
