import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Camera, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, X } from 'lucide-react';
import { Chip } from '../ui/Chip';

export interface PhotoSlotItem {
  id: string;
  label: string;
  description: string;
  url: string | null;
  error?: string | null;
}

const DEFAULT_SLOTS: PhotoSlotItem[] = [
  { id: 'front', label: '1. Front Elevation', description: 'Head-on eye-level view', url: null },
  { id: 'back', label: '2. Reverse Elevation', description: '180° rotated rear perspective', url: null },
  { id: 'rim', label: '3. Rim & Interior', description: 'Top-down look into opening', url: null },
  { id: 'base', label: '4. Foot & Base', description: 'Underside trimming and foot', url: null },
];

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
];

export interface PhotoSlotsProps {
  onPhotosReady: (photoUrls: string[]) => void;
}

export const PhotoSlots: React.FC<PhotoSlotsProps> = ({ onPhotosReady }) => {
  const [slots, setSlots] = useState<PhotoSlotItem[]>(DEFAULT_SLOTS);
  const [isProcessing, setIsProcessing] = useState(false);

  // Client-side image validator (Luminance + Laplacian variance blur detection)
  const validateAndResizeImage = (file: File): Promise<{ dataUrl: string; error?: string }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1024;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: img.src });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // 1. Calculate Average Luminance
        let totalLum = 0;
        const totalPixels = width * height;
        const grayscale = new Float32Array(totalPixels);

        for (let i = 0; i < data.length; i += 4) {
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          totalLum += lum;
          grayscale[i / 4] = lum;
        }

        const avgLuminance = totalLum / totalPixels;

        // Check darkness gate
        if (avgLuminance < 40) {
          resolve({
            dataUrl: canvas.toDataURL('image/jpeg', 0.85),
            error: 'Photo is too dark (Luminance < 40). Please retake under better lighting.',
          });
          return;
        }

        // 2. Simple Laplacian Variance for Sharpness
        let laplacianSum = 0;
        let laplacianSqSum = 0;
        let counted = 0;

        for (let y = 1; y < height - 1; y += 2) {
          for (let x = 1; x < width - 1; x += 2) {
            const idx = y * width + x;
            const lap =
              -4 * grayscale[idx] +
              grayscale[idx - 1] +
              grayscale[idx + 1] +
              grayscale[idx - width] +
              grayscale[idx + width];
            laplacianSum += lap;
            laplacianSqSum += lap * lap;
            counted++;
          }
        }

        const meanLap = laplacianSum / counted;
        const variance = laplacianSqSum / counted - meanLap * meanLap;

        // Check blur gate
        if (variance < 28) {
          resolve({
            dataUrl: canvas.toDataURL('image/jpeg', 0.85),
            error: 'Photo appears blurry or out of focus. Tap the rim and retake steadily.',
          });
          return;
        }

        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.85) });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const result = await validateAndResizeImage(file);
    setIsProcessing(false);

    const updated = [...slots];
    updated[index] = {
      ...updated[index],
      url: result.dataUrl,
      error: result.error || null,
    };
    setSlots(updated);

    const validUrls = updated.map((s) => s.url).filter(Boolean) as string[];
    if (validUrls.length === 4 && !updated.some((s) => s.error)) {
      onPhotosReady(validUrls);
    }
  };

  const loadDemoPhotos = () => {
    const updated = slots.map((s, idx) => ({
      ...s,
      url: SAMPLE_PHOTOS[idx],
      error: null,
    }));
    setSlots(updated);
    onPhotosReady(SAMPLE_PHOTOS);
  };

  const clearSlot = (index: number) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], url: null, error: null };
    setSlots(updated);
  };

  const readyCount = slots.filter((s) => s.url && !s.error).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-tx">Required 4-Angle Inspection Photos</h4>
          <span className="text-xs text-mu">
            {readyCount} of 4 angles verified by client-side quality gate
          </span>
        </div>
        <button
          type="button"
          onClick={loadDemoPhotos}
          className="text-xs font-mono text-clay hover:underline inline-flex items-center gap-1.5 py-1 px-3 rounded-lg bg-clay/10 border border-clay/30"
        >
          <Sparkles className="w-3.5 h-3.5" /> Auto-Load 4 Demo Pottery Photos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {slots.map((slot, idx) => (
          <GlowCard
            key={slot.id}
            className={`p-4 flex flex-col justify-between aspect-[4/5] border ${
              slot.error
                ? 'border-rose-500/50 bg-rose-950/10'
                : slot.url
                ? 'border-emerald-500/40'
                : 'border-cardBorder'
            }`}
            glowColor={slot.url ? 'teal' : 'clay'}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-tx">{slot.label}</span>
              {slot.url && (
                <button
                  type="button"
                  onClick={() => clearSlot(idx)}
                  className="text-mu hover:text-bad p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Photo slot frame */}
            <div className="flex-1 rounded-xl bg-bg2 border border-cardBorder relative overflow-hidden flex flex-col items-center justify-center group">
              {slot.url ? (
                <img src={slot.url} alt={slot.label} className="w-full h-full object-cover" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center p-4 text-center">
                  <Camera className="w-8 h-8 text-mu group-hover:text-clay transition-colors mb-2" />
                  <span className="text-xs font-medium text-tx">Capture or Upload</span>
                  <span className="text-[10px] text-mu mt-1">{slot.description}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(idx, e)}
                    className="hidden"
                  />
                </label>
              )}

              {/* Status Pill */}
              {slot.url && !slot.error && (
                <div className="absolute bottom-2 left-2 right-2 bg-emerald-950/90 text-emerald-400 text-[10px] font-mono py-1 px-2 rounded-lg flex items-center justify-center gap-1 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Sharp & Illuminated
                </div>
              )}
            </div>

            {/* Error rejection banner */}
            {slot.error && (
              <div className="mt-2 text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 flex items-start gap-1.5 leading-tight">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{slot.error}</span>
              </div>
            )}
          </GlowCard>
        ))}
      </div>
    </div>
  );
};
