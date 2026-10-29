import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { Database, Plus, CheckCircle2, Shield, FolderGit2 } from 'lucide-react';
import type { DatasetRecord } from '../../types/api';

export const DatasetPanel: React.FC<{
  datasets: DatasetRecord[];
  onSelectDataset?: (id: string) => void;
  selectedId?: string;
}> = ({ datasets, onSelectDataset, selectedId }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [license, setLicense] = useState('CC-BY-4.0');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-teal" />
          <h3 className="text-base font-bold text-tx">Registered Pottery Defect Datasets</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? 'Cancel' : 'Register Dataset'}
        </Button>
      </div>

      {showAdd && (
        <GlowCard className="p-4 bg-white/[0.02] border-teal/30" glowColor="teal">
          <h4 className="text-xs font-mono uppercase text-teal font-semibold mb-3">
            Register Dataset via Kaggle or Roboflow
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              placeholder="Dataset Name (e.g. StudioPottery-Defects-v3)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-xs text-tx"
            />
            <input
              type="text"
              placeholder="Source URI (Kaggle slug or Roboflow link)"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-xs text-tx"
            />
            <input
              type="text"
              placeholder="License (e.g. MIT, CC-BY-4.0)"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-xs text-tx"
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setShowAdd(false);
                setName('');
                setSource('');
              }}
            >
              Save Registry
            </Button>
          </div>
        </GlowCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {datasets.map((ds) => {
          const isSelected = selectedId === ds.id;

          return (
            <GlowCard
              key={ds.id}
              className={`p-5 cursor-pointer transition-all ${
                isSelected ? 'border-teal ring-2 ring-teal/30 bg-teal/5' : ''
              }`}
              glowColor="teal"
              onClick={() => onSelectDataset?.(ds.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-sm text-tx">{ds.name}</h4>
                  <span className="text-[11px] font-mono text-mu block truncate max-w-xs">{ds.source}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-teal" />}
              </div>

              <div className="flex flex-wrap gap-1.5 my-3">
                {ds.classes.map((cls) => (
                  <span
                    key={cls}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-cardBorder text-tx/80"
                  >
                    {cls} ({ds.counts[cls] || 0})
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-mu pt-2 border-t border-cardBorder">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> License: {ds.license}
                </span>
                <span>ID: {ds.id}</span>
              </div>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
};
