import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { AnalysisResult } from '../types/api';

const PIPELINE_STAGES = [
  'Checking photos',
  'Finding defects',
  'Matching request',
  'Scoring',
  'Writing report',
  'Completed'
];

export function useAnalysisPolling(submissionId: string | null, active: boolean) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState(PIPELINE_STAGES[0]);
  const [progress, setProgress] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [report, setReport] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !submissionId) return;

    let cancelled = false;
    let step = 0;

    const interval = setInterval(async () => {
      if (cancelled) return;
      step++;

      if (step < PIPELINE_STAGES.length - 1) {
        setCurrentStageIndex(step);
        setCurrentStage(PIPELINE_STAGES[step]);
        setProgress(Math.round(((step + 1) / PIPELINE_STAGES.length) * 100));
      } else {
        // Complete stage
        clearInterval(interval);
        try {
          const res = await api.getAnalysisReport(submissionId);
          if (!cancelled) {
            setCurrentStageIndex(PIPELINE_STAGES.length - 1);
            setCurrentStage('Completed');
            setProgress(100);
            setReport(res);
            setIsCompleted(true);
          }
        } catch (err: any) {
          if (!cancelled) {
            setError(err.message || 'Analysis failed');
          }
        }
      }
    }, 1800);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [submissionId, active]);

  return {
    currentStage,
    currentStageIndex,
    stages: PIPELINE_STAGES,
    progress,
    isCompleted,
    report,
    error,
  };
}
