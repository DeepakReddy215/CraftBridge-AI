import React, { useRef, useEffect } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Terminal, Copy, Check } from 'lucide-react';

const DEFAULT_LOGS = [
  '[Forge Init] Worker registered run_id: run-902, token verified.',
  '[Colab Environment] GPU: Tesla T4 (15360MiB), CUDA 12.2',
  '[Dataset Sync] PotteryDefects-Kaggle-V2 unzipped: 1,421 images, 1,421 labels.',
  '[Ultralytics YOLO] Model: yolov8n.yaml transferred 355/355 weights from pretrained.',
  '[Epoch 01/25] box_loss: 2.14, cls_loss: 1.82, mAP50: 0.442, mAP50-95: 0.261',
  '[Epoch 05/25] box_loss: 1.48, cls_loss: 1.15, mAP50: 0.612, mAP50-95: 0.395',
  '[Epoch 10/25] box_loss: 0.98, cls_loss: 0.72, mAP50: 0.741, mAP50-95: 0.510',
  '[Epoch 18/25] box_loss: 0.52, cls_loss: 0.38, mAP50: 0.838, mAP50-95: 0.589',
  '[Epoch 25/25] box_loss: 0.39, cls_loss: 0.24, mAP50: 0.884, mAP50-95: 0.631',
  '[Validation Final] mAP@0.5: 0.884, Precision: 0.892, Recall: 0.865',
  '[ONNX Export] best.pt -> best.onnx (imgsz=640, simplify=True, size=12.2 MB)',
  '[Signed Upload] best.onnx uploaded to Supabase Storage: models/yolov8n_pottery_v1.4.onnx',
  '[Forge Webhook] Run completed successfully. Status: ready for smoke test promotion.',
];

export const LogStream: React.FC<{ logs?: string[] }> = ({ logs = DEFAULT_LOGS }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <GlowCard className="p-4" glowColor="neutral">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cardBorder">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-tx">
            Live Notebook Webhook Stream
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Listening
        </span>
      </div>

      <div
        ref={containerRef}
        className="h-44 overflow-y-auto rounded-xl bg-bg2 p-3 font-mono text-[11px] space-y-1 text-tx/80 leading-relaxed border border-cardBorder/60"
      >
        {logs.map((line, i) => (
          <div key={i} className="hover:bg-white/[0.02] px-1 rounded">
            <span className="text-mu mr-2">[{i + 1 < 10 ? `0${i + 1}` : i + 1}]</span>
            <span
              className={
                line.includes('completed') || line.includes('Final')
                  ? 'text-emerald-400 font-semibold'
                  : line.includes('Epoch')
                  ? 'text-teal'
                  : 'text-tx/90'
              }
            >
              {line}
            </span>
          </div>
        ))}
      </div>
    </GlowCard>
  );
};
