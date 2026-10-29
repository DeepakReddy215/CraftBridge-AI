import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { Play, Download, ExternalLink, Settings, Cpu, Flame } from 'lucide-react';
import type { TrainingRunConfig } from '../../types/api';

export const RunConfigForm: React.FC<{
  datasetId: string;
  onGenerateRun: (config: TrainingRunConfig) => Promise<void>;
  isGenerating?: boolean;
}> = ({ datasetId, onGenerateRun, isGenerating = false }) => {
  const [baseModel, setBaseModel] = useState<'yolov8n' | 'yolov8s'>('yolov8n');
  const [epochs, setEpochs] = useState(25);
  const [imgsz, setImgsz] = useState(640);
  const [batch, setBatch] = useState(16);
  const [seed, setSeed] = useState(42);
  const [augmentation, setAugmentation] = useState<'light' | 'standard' | 'heavy'>('standard');

  const classes = ['crack', 'chip', 'uneven_glaze', 'stain'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateRun({
      dataset_id: datasetId,
      base_model: baseModel,
      epochs,
      imgsz,
      batch,
      classes,
      seed,
      split: '70/20/10',
      augmentation,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <GlowCard className="p-6 space-y-6" glowColor="teal">
        <div className="flex items-center justify-between pb-3 border-b border-cardBorder">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal" />
            <h3 className="text-base font-bold text-tx">Training Run Hyperparameters</h3>
          </div>
          <span className="text-xs font-mono text-mu">Free GPU Offload (Colab / Kaggle)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Base Model */}
          <div>
            <label className="block text-xs font-mono text-tx/80 mb-1">Architecture</label>
            <select
              value={baseModel}
              onChange={(e) => setBaseModel(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs font-mono"
            >
              <option value="yolov8n">yolov8n (Nano - 3.2M params / 12MB ONNX)</option>
              <option value="yolov8s">yolov8s (Small - 11.2M params)</option>
            </select>
          </div>

          {/* Epochs */}
          <div>
            <label className="block text-xs font-mono text-tx/80 mb-1">Epochs</label>
            <input
              type="number"
              min={1}
              max={300}
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs font-mono"
            />
          </div>

          {/* Image Size */}
          <div>
            <label className="block text-xs font-mono text-tx/80 mb-1">Image Size (px)</label>
            <select
              value={imgsz}
              onChange={(e) => setImgsz(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs font-mono"
            >
              <option value={640}>640 px (Recommended)</option>
              <option value={480}>480 px (Ultra-Low Memory Mode)</option>
            </select>
          </div>

          {/* Batch Size */}
          <div>
            <label className="block text-xs font-mono text-tx/80 mb-1">Batch Size</label>
            <select
              value={batch}
              onChange={(e) => setBatch(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs font-mono"
            >
              <option value={16}>16 (Colab T4 Free)</option>
              <option value={32}>32 (Kaggle P100 Free)</option>
              <option value={8}>8 (CPU Safe)</option>
            </select>
          </div>
        </div>

        {/* Classes & Augmentation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cardBorder">
          <div>
            <span className="text-xs font-mono text-tx/80 block mb-1">Target Defect Classes:</span>
            <div className="flex flex-wrap gap-1.5">
              {classes.map((c) => (
                <span
                  key={c}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-teal/10 text-teal border border-teal/20"
                >
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-tx/80 mb-1">Augmentation Preset</label>
            <select
              value={augmentation}
              onChange={(e) => setAugmentation(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs font-mono"
            >
              <option value="standard">Standard (Mosaic, Flips, HSV Shift)</option>
              <option value="heavy">Heavy (Affine, Perspective, Glaze Glare)</option>
              <option value="light">Light (Minimal Crop & Rotation)</option>
            </select>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-cardBorder gap-3">
          <span className="text-[11px] font-mono text-mu">
            Target: Render Free Safe ONNX export with metadata
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="submit"
              size="md"
              variant="secondary"
              isLoading={isGenerating}
              leftIcon={<Flame className="w-4 h-4" />}
            >
              Generate Colab / Kaggle .ipynb
            </Button>
          </div>
        </div>
      </GlowCard>
    </form>
  );
};
