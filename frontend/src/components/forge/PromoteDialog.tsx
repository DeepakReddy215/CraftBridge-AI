import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { ShieldCheck, AlertCircle, X, KeyRound, CheckCircle2 } from 'lucide-react';
import type { ModelItem } from '../../types/api';

export interface PromoteDialogProps {
  model: ModelItem | null;
  onClose: () => void;
  onConfirm: (passphrase: string) => Promise<void>;
  isLoading?: boolean;
}

export const PromoteDialog: React.FC<PromoteDialogProps> = ({
  model,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [smokeTested, setSmokeTested] = useState(false);

  if (!model) return null;

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(passphrase);
    setSmokeTested(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-md flex items-center justify-center p-4">
      <GlowCard className="max-w-md w-full p-6 bg-bg2 border-clay/30 shadow-2xl" glowColor="clay">
        <div className="flex items-center justify-between pb-3 border-b border-cardBorder">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-clay" />
            <h3 className="text-base font-bold text-tx">Promote Model to Production</h3>
          </div>
          <button onClick={onClose} className="text-mu hover:text-tx p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePromote} className="my-5 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-cardBorder space-y-1">
            <div className="font-mono text-mu">Target Model:</div>
            <div className="text-sm font-bold font-mono text-tx">{model.version}</div>
            <div className="font-mono text-teal">mAP@0.5: {(model.map50 * 100).toFixed(1)}%</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Automated Smoke Test & Hot-Swap
            </div>
            <p className="text-[11px] leading-relaxed">
              FastAPI will download the ONNX artifact to /tmp, perform a test inference on a reference sample, and atomically swap the active session without downtime.
            </p>
          </div>

          <div>
            <label className="block text-tx font-mono font-medium mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-clay" /> Developer Passphrase (FORGE_PASSPHRASE)
            </label>
            <input
              type="password"
              placeholder="Enter developer passphrase..."
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg border border-cardBorder text-tx text-xs font-mono focus:ring-2 focus:ring-clay/50 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Verify & Hot-Swap Model
            </Button>
          </div>
        </form>
      </GlowCard>
    </div>
  );
};
