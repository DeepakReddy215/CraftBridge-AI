import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

const SAMPLE_PER_CLASS_AP = [
  { class: 'crack', ap50: 0.912, fill: '#f87171' },
  { class: 'chip', ap50: 0.884, fill: '#fbbf24' },
  { class: 'uneven_glaze', ap50: 0.852, fill: '#4fd1c5' },
  { class: 'stain', ap50: 0.891, fill: '#e4793f' },
];

export const ClassAPChart: React.FC<{ data?: typeof SAMPLE_PER_CLASS_AP }> = ({
  data = SAMPLE_PER_CLASS_AP,
}) => {
  return (
    <GlowCard className="p-5" glowColor="teal">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-teal" />
          <h4 className="text-sm font-bold text-tx font-mono">Per-Class Average Precision (mAP@0.5)</h4>
        </div>
        <span className="text-xs font-mono text-mu">Target: &gt; 0.80 per class</span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="class" stroke="var(--mu)" fontSize={11} />
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
            <Bar dataKey="ap50" name="mAP@0.5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlowCard>
  );
};
