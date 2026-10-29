import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import type { EpochMetric } from '../../types/api';
import { Activity, Clock, Award } from 'lucide-react';

export const LiveMetrics: React.FC<{ metrics: EpochMetric[]; status?: string }> = ({
  metrics,
  status = 'completed',
}) => {
  if (metrics.length === 0) {
    return (
      <GlowCard className="p-8 text-center text-mu text-xs font-mono" glowColor="teal">
        No training run active. Generate and start a notebook in Colab to stream live curves.
      </GlowCard>
    );
  }

  const chartData = metrics.map((m) => ({
    epoch: m.epoch,
    mAP50: m.metrics['metrics/mAP50(B)'],
    mAP50_95: m.metrics['metrics/mAP50-95(B)'],
    precision: m.metrics['metrics/precision(B)'],
    recall: m.metrics['metrics/recall(B)'],
    boxLoss: m.loss[0],
    clsLoss: m.loss[1],
  }));

  const latest = metrics[metrics.length - 1];

  return (
    <div className="space-y-6">
      {/* Live Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <GlowCard className="p-3 text-center" glowColor="teal">
          <span className="text-[10px] font-mono text-mu uppercase">Latest mAP@0.5</span>
          <div className="text-xl font-bold font-mono text-teal">
            {latest?.metrics['metrics/mAP50(B)']}
          </div>
        </GlowCard>

        <GlowCard className="p-3 text-center" glowColor="clay">
          <span className="text-[10px] font-mono text-mu uppercase">mAP@0.5:0.95</span>
          <div className="text-xl font-bold font-mono text-clay">
            {latest?.metrics['metrics/mAP50-95(B)']}
          </div>
        </GlowCard>

        <GlowCard className="p-3 text-center" glowColor="neutral">
          <span className="text-[10px] font-mono text-mu uppercase">Precision</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {latest?.metrics['metrics/precision(B)']}
          </div>
        </GlowCard>

        <GlowCard className="p-3 text-center" glowColor="neutral">
          <span className="text-[10px] font-mono text-mu uppercase">Recall</span>
          <div className="text-xl font-bold font-mono text-amber-400">
            {latest?.metrics['metrics/recall(B)']}
          </div>
        </GlowCard>
      </div>

      {/* 1. Validation Accuracy Curves (mAP@0.5, mAP@0.5:0.95) */}
      <GlowCard className="p-5" glowColor="teal">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal" />
            <h4 className="text-sm font-bold text-tx font-mono">Validation Accuracy Curves (mAP)</h4>
          </div>
          <span className="text-xs font-mono text-mu">
            Epoch {latest.epoch} of {latest.epochs}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="epoch" stroke="var(--mu)" fontSize={11} />
              <YAxis domain={[0, 1]} stroke="var(--mu)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg2)',
                  borderColor: 'var(--card-border)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Line
                type="monotone"
                dataKey="mAP50"
                name="mAP@0.5"
                stroke="#4fd1c5"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="mAP50_95"
                name="mAP@0.5:0.95"
                stroke="#e4793f"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlowCard>

      {/* 2. Loss Curves */}
      <GlowCard className="p-5" glowColor="clay">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-clay" />
            <h4 className="text-sm font-bold text-tx font-mono">Training Loss Convergence (Box / Cls)</h4>
          </div>
          <span className="text-xs font-mono text-emerald-400">Converging</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="epoch" stroke="var(--mu)" fontSize={11} />
              <YAxis stroke="var(--mu)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg2)',
                  borderColor: 'var(--card-border)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Line
                type="monotone"
                dataKey="boxLoss"
                name="Box Loss"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="clsLoss"
                name="Class Loss"
                stroke="#f87171"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlowCard>
    </div>
  );
};
