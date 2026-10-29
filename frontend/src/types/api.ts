export type UserRole = 'customer' | 'artisan' | 'developer';

export type RequestStatus =
  | 'DRAFT'
  | 'BRIEFED'
  | 'IN_PROGRESS'
  | 'UPLOADED'
  | 'ANALYSED'
  | 'PREVIEWED'
  | 'REVISION_REQUESTED'
  | 'APPROVED';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  created_at: string;
}

export interface CraftRequest {
  id: string;
  customer_id: string;
  artisan_id?: string | null;
  product: string;
  style: string;
  colors: string[];
  size_label: string; // 'Small (12-18cm)', 'Medium (18-25cm)', 'Large (25-35cm)', 'Statement (35cm+)'
  budget: number;
  purpose: string;
  pattern: string;
  reference_image_path?: string | null;
  status: RequestStatus;
  created_at: string;
  brief?: CraftBrief | null;
}

export interface GuidanceStep {
  step: number;
  title: string;
  focus: string;
  checkpoint: string;
  tip?: string;
}

export interface CraftBrief {
  id?: string;
  request_id?: string;
  brief_json: {
    summary: string;
    product: string;
    target_dimensions: string;
    aesthetic_notes: string;
    palette_hex: string[];
    clay_body_recommendation: string;
    critical_tolerances: string[];
  };
  guidance_json: {
    stages: GuidanceStep[];
    quality_checklist: string[];
  };
  source: 'gemini' | 'groq' | 'template';
  version?: number;
  created_at?: string;
}

export interface SubmissionInput {
  request_id: string;
  artisan_id?: string;
  height_cm: number;
  material_cost: number;
  labour_hours: number;
  complexity: 'Low' | 'Medium' | 'High';
  image_paths: string[];
}

export interface Submission extends SubmissionInput {
  id: string;
  created_at: string;
}

export interface DefectBox {
  id: string;
  class_name: 'crack' | 'chip' | 'uneven_glaze' | 'stain' | string;
  confidence: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized (0..1)
  region: 'upper' | 'middle' | 'bottom' | 'left' | 'right';
}

export interface QualitySubscores {
  structural: number;
  finish: number;
  pattern: number;
  colour: number;
  shape: number;
}

export interface MatchDetail {
  colour_score: number;
  pattern_score: number;
  type_score: number;
  size_score: number;
  style_score: number;
  notes: string;
}

export interface RankedFix {
  priority: 'structural' | 'finish' | 'cosmetic' | 'advisory';
  title: string;
  description: string;
  action_step: string;
}

export interface AnalysisReport {
  executive_summary: string;
  passed_checks: string[];
  ranked_fixes: RankedFix[];
  artisan_praise: string;
  customer_guidance: string;
}

export interface AnalysisResult {
  id: string;
  submission_id: string;
  job_status: 'pending' | 'processing' | 'completed' | 'failed';
  stage: string; // 'Checking photos', 'Finding defects', 'Matching request', 'Scoring', 'Writing report', 'Completed'
  progress_pct: number;
  match_pct: number;
  match_detail: MatchDetail;
  defects: DefectBox[];
  annotated_path: string;
  quality_score: number;
  subscores: QualitySubscores;
  price_low: number;
  price_high: number;
  demand_level: 'Low' | 'Medium' | 'High';
  demand_score: number;
  report: AnalysisReport;
  model_version: string;
  source: 'gemini' | 'groq' | 'template';
  created_at: string;
}

export interface CustomerFeedback {
  id?: string;
  request_id: string;
  submission_id?: string;
  customer_comment: string;
  instruction: string;
  changed_fields?: Record<string, any>;
  created_at?: string;
}

export interface HealthCheckResponse {
  status: string;
  active_model: string;
  model_loaded: boolean;
  version: string;
  ai_budget: {
    gemini_rpm_remaining: number;
    gemini_rpd_remaining: number;
    groq_rpm_remaining: number;
    primary_provider: string;
  };
}

/* Model Forge Types */
export interface DatasetRecord {
  id: string;
  name: string;
  source: string;
  classes: string[];
  counts: Record<string, number>;
  license: string;
  uri?: string;
  created_at: string;
}

export interface TrainingRunConfig {
  dataset_id: string;
  base_model: 'yolov8n' | 'yolov8s';
  epochs: number;
  imgsz: number;
  batch: number;
  classes: string[];
  seed: number;
  split: string;
  augmentation: 'light' | 'standard' | 'heavy';
}

export interface EpochMetric {
  epoch: number;
  epochs: number;
  metrics: {
    'metrics/mAP50(B)': number;
    'metrics/mAP50-95(B)': number;
    'metrics/precision(B)': number;
    'metrics/recall(B)': number;
    [key: string]: number;
  };
  loss: number[];
  eta_seconds?: number;
}

export interface TrainingRun {
  id: string;
  dataset_id: string;
  config: TrainingRunConfig;
  status: 'pending' | 'running' | 'completed' | 'failed';
  metrics: EpochMetric[];
  final_metrics?: Record<string, number>;
  artifact_onnx?: string;
  notebook_url?: string;
  created_at: string;
}

export interface ModelItem {
  id: string;
  run_id: string;
  version: string;
  onnx_path: string;
  map50: number;
  is_active: boolean;
  promoted_at?: string;
}
