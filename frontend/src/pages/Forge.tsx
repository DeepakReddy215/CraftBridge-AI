import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { GlowCard } from '../components/ui/GlowCard';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { DatasetPanel } from '../components/forge/DatasetPanel';
import { RunConfigForm } from '../components/forge/RunConfigForm';
import { LiveMetrics } from '../components/forge/LiveMetrics';
import { ClassAPChart } from '../components/forge/ClassAPChart';
import { LogStream } from '../components/forge/LogStream';
import { ModelRegistry } from '../components/forge/ModelRegistry';
import { PromoteDialog } from '../components/forge/PromoteDialog';
import { api, mockDatasets, mockModels, mockTrainingRun } from '../lib/api';
import type { DatasetRecord, ModelItem, TrainingRunConfig, TrainingRun } from '../types/api';
import { Terminal, Database, Activity, Cpu, ExternalLink, Download, Sparkles } from 'lucide-react';

export const Forge: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'datasets' | 'train' | 'metrics' | 'models'>('metrics');
  const [datasets] = useState<DatasetRecord[]>(mockDatasets);
  const [selectedDatasetId, setSelectedDatasetId] = useState(mockDatasets[0].id);
  const [models, setModels] = useState<ModelItem[]>(mockModels);
  const [currentRun, setCurrentRun] = useState<TrainingRun>(mockTrainingRun('run-902'));
  const [promoteCandidate, setPromoteCandidate] = useState<ModelItem | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRun = async (config: TrainingRunConfig) => {
    setIsGenerating(true);
    try {
      const res = await api.createForgeRun(config);
      setCurrentRun(mockTrainingRun(res.run_id));
      setActiveTab('metrics');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromoteConfirm = async (passphrase: string) => {
    if (!promoteCandidate) return;
    setIsPromoting(true);
    try {
      await api.promoteModel(promoteCandidate.id, passphrase);
      // Update models
      setModels(
        models.map((m) => ({
          ...m,
          is_active: m.id === promoteCandidate.id,
        }))
      );
      setPromoteCandidate(null);
    } finally {
      setIsPromoting(false);
    }
  };

  const downloadColabNotebook = () => {
    const notebookCode = {
      cells: [
        {
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            '!pip -q install ultralytics requests\\n',
            `RUN_ID, TOKEN, API = "${currentRun.id}", "forge_token_882910", "${import.meta.env.VITE_API_URL || 'https://craftbridge-api.onrender.com'}"\\n`,
            'from ultralytics import YOLO\\nimport requests\\n',
            'def post(path, data):\\n    requests.post(f"{API}/api/forge/runs/{RUN_ID}/{path}", json=data, headers={"X-Run-Token": TOKEN}, timeout=20)\\n',
            'def on_epoch_end(trainer):\\n    m = {k: float(v) for k, v in trainer.metrics.items()}\\n    post("metrics", {"epoch": trainer.epoch + 1, "epochs": trainer.epochs, "metrics": m, "loss": [float(x) for x in trainer.tloss]})\\n',
            'model = YOLO("yolov8n.pt")\\nmodel.add_callback("on_fit_epoch_end", on_epoch_end)\\n',
            'model.train(data="data.yaml", epochs=25, imgsz=640, batch=16, seed=42)\\n',
            'best = YOLO("runs/detect/train/weights/best.pt")\\nbest.export(format="onnx", imgsz=640, simplify=True)\\n',
            'post("finish", {"status": "done", "final": best.val(data="data.yaml").results_dict})\\n',
          ],
        },
      ],
      metadata: {
        language_info: { name: 'python' },
      },
      nbformat: 4,
      nbformat_minor: 2,
    };

    const blob = new Blob([JSON.stringify(notebookCode, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `craftbridge_train_${currentRun.id}.ipynb`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Forge Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cardBorder">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-5 h-5 text-teal" />
              <h1 className="text-2xl font-bold text-tx">Model Forge: Hidden Developer Console</h1>
              <Chip label="Developer Role" variant="teal" size="sm" />
            </div>
            <p className="text-xs text-mu">
              Zero server GPU compute. Prepare YOLO defect runs, download Colab/Kaggle notebooks, monitor live curves, and hot-swap production ONNX models.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={downloadColabNotebook}
            >
              Export .ipynb
            </Button>
            <a
              href="https://colab.research.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button size="sm" variant="secondary" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                Open Google Colab
              </Button>
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-cardBorder pb-2">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              activeTab === 'metrics'
                ? 'bg-teal text-bg font-bold shadow-sm'
                : 'text-tx/70 hover:text-tx hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Live Run Curves
          </button>

          <button
            onClick={() => setActiveTab('train')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              activeTab === 'train'
                ? 'bg-teal text-bg font-bold shadow-sm'
                : 'text-tx/70 hover:text-tx hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Configure New Run
          </button>

          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              activeTab === 'datasets'
                ? 'bg-teal text-bg font-bold shadow-sm'
                : 'text-tx/70 hover:text-tx hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Datasets Registry
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              activeTab === 'models'
                ? 'bg-teal text-bg font-bold shadow-sm'
                : 'text-tx/70 hover:text-tx hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Active Models & Hot-Swap
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <LiveMetrics metrics={currentRun.metrics} status={currentRun.status} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClassAPChart />
              <LogStream />
            </div>
          </div>
        )}

        {activeTab === 'train' && (
          <RunConfigForm
            datasetId={selectedDatasetId}
            onGenerateRun={handleGenerateRun}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'datasets' && (
          <DatasetPanel
            datasets={datasets}
            selectedId={selectedDatasetId}
            onSelectDataset={(id) => {
              setSelectedDatasetId(id);
              setActiveTab('train');
            }}
          />
        )}

        {activeTab === 'models' && (
          <ModelRegistry
            models={models}
            onOpenPromote={(mod) => setPromoteCandidate(mod)}
          />
        )}

        {/* Promote Confirmation Dialog */}
        <PromoteDialog
          model={promoteCandidate}
          onClose={() => setPromoteCandidate(null)}
          onConfirm={handlePromoteConfirm}
          isLoading={isPromoting}
        />
      </div>
    </PageShell>
  );
};
