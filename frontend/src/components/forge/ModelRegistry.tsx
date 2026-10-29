import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { CheckCircle2, RotateCcw, ArrowUpRight, Cpu, HardDrive } from 'lucide-react';
import type { ModelItem } from '../../types/api';

export const ModelRegistry: React.FC<{
  models: ModelItem[];
  onOpenPromote: (model: ModelItem) => void;
  onRollback?: () => void;
}> = ({ models, onOpenPromote, onRollback }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-clay" />
          <h3 className="text-base font-bold text-tx">Production Model Registry</h3>
        </div>
        {onRollback && (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={onRollback}
          >
            Rollback to Previous
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-cardBorder bg-cardBg">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-cardBorder bg-white/[0.02] text-mu uppercase text-[10px]">
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Model Version</th>
              <th className="py-3 px-4">mAP@0.5</th>
              <th className="py-3 px-4">ONNX Size</th>
              <th className="py-3 px-4">Latency (CPU)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cardBorder/60 text-tx">
            {models.map((mod) => (
              <tr key={mod.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4">
                  {mod.is_active ? (
                    <Chip label="ACTIVE IN PROD" variant="ok" size="sm" />
                  ) : (
                    <Chip label="CANDIDATE" variant="neutral" size="sm" />
                  )}
                </td>
                <td className="py-3 px-4 font-bold text-tx">{mod.version}</td>
                <td className="py-3 px-4 text-teal font-semibold">{(mod.map50 * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-mu">12.2 MB</td>
                <td className="py-3 px-4 text-mu">~120 ms</td>
                <td className="py-3 px-4 text-right">
                  {!mod.is_active ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onOpenPromote(mod)}
                      rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                    >
                      Promote Model
                    </Button>
                  ) : (
                    <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Serving Requests
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
