import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { GlowCard } from '../components/ui/GlowCard';
import { Button } from '../components/ui/Button';
import { CaptureGuide } from '../components/artisan/CaptureGuide';
import { PhotoSlots } from '../components/artisan/PhotoSlots';
import { Bar } from '../components/ui/Bar';
import { useAnalysisPolling } from '../hooks/useAnalysisPolling';
import { api } from '../lib/api';
import { ArrowLeft, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const ArtisanUpload: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [heightCm, setHeightCm] = useState(23.5);
  const [materialCost, setMaterialCost] = useState(160);
  const [labourHours, setLabourHours] = useState(4.5);
  const [complexity, setComplexity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { currentStage, progress, isCompleted, report } = useAnalysisPolling(
    submissionId,
    isAnalyzing
  );

  const handleStartAnalysis = async () => {
    if (!id || photoUrls.length < 4) return;

    // 1. Create submission
    const sub = await api.createSubmission({
      request_id: id,
      height_cm: heightCm,
      material_cost: materialCost,
      labour_hours: labourHours,
      complexity,
      image_paths: photoUrls,
    });

    setSubmissionId(sub.id);
    setIsAnalyzing(true);
  };

  React.useEffect(() => {
    if (isCompleted && submissionId) {
      const timer = setTimeout(() => {
        navigate(`/artisan/requests/${id}/report`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, submissionId, id, navigate]);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-cardBorder">
          <Link
            to="/artisan"
            className="text-xs font-mono text-mu hover:text-tx inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workshop Queue
          </Link>
          <div className="text-xs font-mono text-mu">
            Target Vessel ID: <span className="text-teal font-bold">#{id}</span>
          </div>
        </div>

        {/* Capture Standards Guide */}
        <CaptureGuide />

        {/* 4 Photo Slots with blur/dark check */}
        <PhotoSlots onPhotosReady={setPhotoUrls} />

        {/* Physical & Workshop Cost Metric Inputs */}
        <GlowCard className="p-6" glowColor="teal">
          <h4 className="text-sm font-bold text-tx mb-4">
            Workshop Metrics & Material Cost Accounting
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-tx font-mono mb-1">Measured Height (cm)</label>
              <input
                type="number"
                step="0.1"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx font-mono"
              />
              <span className="text-[10px] text-mu mt-0.5 block">Target tolerance: 22 ± 1.5 cm</span>
            </div>

            <div>
              <label className="block text-tx font-mono mb-1">Raw Material Cost (₹)</label>
              <input
                type="number"
                value={materialCost}
                onChange={(e) => setMaterialCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx font-mono"
              />
              <span className="text-[10px] text-mu mt-0.5 block">Clay body, oxides & glaze frit</span>
            </div>

            <div>
              <label className="block text-tx font-mono mb-1">Artisan Throwing Hours</label>
              <input
                type="number"
                step="0.5"
                value={labourHours}
                onChange={(e) => setLabourHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx font-mono"
              />
              <span className="text-[10px] text-mu mt-0.5 block">Centering, fluting, trim & firing</span>
            </div>

            <div>
              <label className="block text-tx font-mono mb-1">Throwing Complexity</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-bg2 border border-cardBorder text-tx font-mono"
              >
                <option value="Low">Low (1.0x factor)</option>
                <option value="Medium">Medium (1.2x factor)</option>
                <option value="High">High (1.5x factor)</option>
              </select>
              <span className="text-[10px] text-mu mt-0.5 block">Neck narrowing & handle join</span>
            </div>
          </div>
        </GlowCard>

        {/* Asynchronous Analysis Progress Banner */}
        {isAnalyzing && (
          <GlowCard className="p-6 bg-teal/10 border-teal/40 space-y-4" glowColor="teal">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal animate-spin" />
                <div>
                  <h4 className="text-sm font-bold text-tx">
                    In-Process Analysis Running: {currentStage}
                  </h4>
                  <span className="text-[11px] font-mono text-mu">
                    YOLOv8n ONNX defect scan + CIEDE2000 colour match + Deterministic pricing
                  </span>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-teal">{progress}%</span>
            </div>

            <Bar value={progress} color="teal" size="md" showValue={false} />

            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              {['Checking photos', 'Finding defects', 'Matching request', 'Scoring', 'Writing report'].map(
                (stage) => (
                  <span
                    key={stage}
                    className={`px-2 py-0.5 rounded border ${
                      currentStage === stage
                        ? 'bg-teal text-bg font-bold border-teal'
                        : 'bg-white/[0.03] text-mu border-cardBorder'
                    }`}
                  >
                    • {stage}
                  </span>
                )
              )}
            </div>
          </GlowCard>
        )}

        {/* Start Analysis CTA */}
        {!isAnalyzing && (
          <div className="flex justify-end pt-2">
            <Button
              size="lg"
              variant="secondary"
              disabled={photoUrls.length < 4}
              onClick={handleStartAnalysis}
              leftIcon={<Cpu className="w-4 h-4" />}
            >
              Run ONNX Defect Detection & Report ({photoUrls.length}/4 Angles)
            </Button>
          </div>
        )}
      </div>
    </PageShell>
  );
};
