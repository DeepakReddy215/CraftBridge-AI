import type {
  CraftRequest,
  CraftBrief,
  Submission,
  AnalysisResult,
  CustomerFeedback,
  HealthCheckResponse,
  DatasetRecord,
  TrainingRun,
  ModelItem,
  UserRole,
  EpochMetric,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const body = await response.json();
          errMessage = body.detail || body.message || errMessage;
        } catch {
          // ignore parsing error
        }
        throw new Error(errMessage);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  // Health
  async getHealth(): Promise<HealthCheckResponse> {
    try {
      return await this.request<HealthCheckResponse>('/health');
    } catch {
      // Mock health for offline preview
      return {
        status: 'demo_mode',
        active_model: 'yolov8n_pottery_v1.onnx',
        model_loaded: true,
        version: '1.0.0-free-tier',
        ai_budget: {
          gemini_rpm_remaining: 14,
          gemini_rpd_remaining: 242,
          groq_rpm_remaining: 29,
          primary_provider: 'gemini',
        },
      };
    }
  }

  // Requests
  async createRequest(data: Partial<CraftRequest>): Promise<CraftRequest> {
    try {
      return await this.request<CraftRequest>('/requests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return mockCreateRequest(data);
    }
  }

  async getRequests(role?: UserRole): Promise<CraftRequest[]> {
    try {
      return await this.request<CraftRequest[]>(`/requests${role ? `?role=${role}` : ''}`);
    } catch {
      return getStoredRequests();
    }
  }

  async getRequestById(id: string): Promise<CraftRequest> {
    try {
      return await this.request<CraftRequest>(`/requests/${id}`);
    } catch {
      const found = getStoredRequests().find(r => r.id === id);
      if (found) return found;
      return mockSingleRequest(id);
    }
  }

  // Brief
  async generateBrief(requestId: string): Promise<CraftBrief> {
    try {
      return await this.request<CraftBrief>(`/requests/${requestId}/brief`, {
        method: 'POST',
      });
    } catch {
      return mockBrief(requestId);
    }
  }

  // Assign Artisan
  async assignArtisan(requestId: string, artisanId?: string): Promise<CraftRequest> {
    try {
      return await this.request<CraftRequest>(`/requests/${requestId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ artisan_id: artisanId }),
      });
    } catch {
      return updateStoredRequestStatus(requestId, 'IN_PROGRESS');
    }
  }

  // Submissions
  async createSubmission(data: any): Promise<Submission> {
    try {
      return await this.request<Submission>(`/requests/${data.request_id}/submissions`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return mockSubmission(data);
    }
  }

  // Analysis
  async startAnalysis(submissionId: string): Promise<{ analysis_id: string; job_id: string }> {
    try {
      return await this.request<{ analysis_id: string; job_id: string }>(
        `/submissions/${submissionId}/analyze`,
        { method: 'POST' }
      );
    } catch {
      return { analysis_id: `an-${Date.now()}`, job_id: `job-${Date.now()}` };
    }
  }

  async getAnalysisStatus(analysisId: string): Promise<{ stage: string; progress_pct: number; status: string }> {
    try {
      return await this.request(`/analysis/${analysisId}/status`);
    } catch {
      return { stage: 'Writing report', progress_pct: 100, status: 'completed' };
    }
  }

  async getAnalysisReport(submissionId: string): Promise<AnalysisResult> {
    try {
      return await this.request<AnalysisResult>(`/submissions/${submissionId}/report`);
    } catch {
      return mockAnalysisResult(submissionId);
    }
  }

  // Feedback & Approval
  async submitFeedback(requestId: string, comment: string): Promise<CustomerFeedback> {
    try {
      return await this.request<CustomerFeedback>(`/requests/${requestId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ customer_comment: comment }),
      });
    } catch {
      updateStoredRequestStatus(requestId, 'REVISION_REQUESTED');
      return {
        request_id: requestId,
        customer_comment: comment,
        instruction: 'Revise glaze uniformity and address hairline seam near rim.',
        created_at: new Date().toISOString(),
      };
    }
  }

  async approveRequest(requestId: string): Promise<{ status: string }> {
    try {
      return await this.request(`/requests/${requestId}/approve`, {
        method: 'POST',
      });
    } catch {
      updateStoredRequestStatus(requestId, 'APPROVED');
      return { status: 'APPROVED' };
    }
  }

  // Forge Endpoints
  async getForgeDatasets(): Promise<DatasetRecord[]> {
    try {
      return await this.request<DatasetRecord[]>('/forge/datasets');
    } catch {
      return mockDatasets;
    }
  }

  async createForgeRun(config: any): Promise<{ run_id: string; notebook_url: string }> {
    try {
      return await this.request('/forge/runs', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    } catch {
      return { run_id: `run-${Date.now()}`, notebook_url: '#' };
    }
  }

  async getForgeRun(id: string): Promise<TrainingRun> {
    try {
      return await this.request<TrainingRun>(`/forge/runs/${id}`);
    } catch {
      return mockTrainingRun(id);
    }
  }

  async getForgeModels(): Promise<ModelItem[]> {
    try {
      return await this.request<ModelItem[]>('/forge/models');
    } catch {
      return mockModels;
    }
  }

  async promoteModel(id: string, passphrase?: string): Promise<{ status: string; version: string }> {
    try {
      return await this.request(`/forge/models/${id}/promote`, {
        method: 'POST',
        headers: passphrase ? { 'X-Forge-Passphrase': passphrase } : {},
      });
    } catch {
      return { status: 'promoted', version: `v1.2-onnx-${id.slice(0, 4)}` };
    }
  }
}

export const api = new ApiClient();

/* Local Storage Mock Helpers for seamless zero-config UI preview & testing */
const STORAGE_KEY = 'craftbridge_local_requests_v1';

function getStoredRequests(): CraftRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialMockRequests;
}

function saveStoredRequests(list: CraftRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // fallback
  }
}

function updateStoredRequestStatus(id: string, status: any): CraftRequest {
  const list = getStoredRequests();
  const idx = list.findIndex(r => r.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], status };
    saveStoredRequests(list);
    return list[idx];
  }
  return mockSingleRequest(id);
}

function mockCreateRequest(data: Partial<CraftRequest>): CraftRequest {
  const req: CraftRequest = {
    id: `req-${Math.random().toString(36).substring(2, 9)}`,
    customer_id: 'cust-current',
    product: data.product || 'Terracotta Vase',
    style: data.style || 'Minimalist Matte',
    colors: data.colors?.length ? data.colors : ['#c85a20', '#14161b'],
    size_label: data.size_label || 'Medium (18-25cm)',
    budget: data.budget || 850,
    purpose: data.purpose || 'Living room center table focal piece',
    pattern: data.pattern || 'Ribbed geometric texture',
    reference_image_path: data.reference_image_path || null,
    status: 'BRIEFED',
    created_at: new Date().toISOString(),
    brief: {
      brief_json: {
        summary: `Handcrafted ${data.product || 'Terracotta Vase'} featuring ${data.style || 'Minimalist Matte'} profile with balanced proportion and tactile finish.`,
        product: data.product || 'Terracotta Vase',
        target_dimensions: 'Height: 22 ± 1.5 cm, Max Diameter: 14 cm',
        aesthetic_notes: 'Warm earthy undertones with smooth vertical fluting and satin unglazed mouth rim.',
        palette_hex: data.colors || ['#e4793f', '#4fd1c5'],
        clay_body_recommendation: 'Refined terracotta with 15% fine grog for structural stability',
        critical_tolerances: ['Base flatness < 1.5mm wobble', 'Wall thickness uniform 5-7mm', 'Zero glaze crawling around shoulder'],
      },
      guidance_json: {
        stages: [
          { step: 1, title: 'Clay Conditioning & Centering', focus: 'De-airing & cone wedging', checkpoint: 'Centering true to wheel head within 2mm', tip: 'Keep moisture even to prevent drying cracks.' },
          { step: 2, title: 'Pulling & Fluting Form', focus: 'Uniform wall graduation', checkpoint: 'Check 22cm height with calipers before trimming', tip: 'Use wooden rib for crisp fluting ribs.' },
          { step: 3, title: 'Slow Drying & Bisque Firing', focus: 'Even moisture release', checkpoint: 'Moisture < 2% before Cone 06 firing', tip: 'Wrap lip in wax resist to slow rim drying.' },
          { step: 4, title: 'Glazing & Vitrification', focus: 'Dip consistency and matte finish', checkpoint: 'Specific gravity 1.45 for glaze bath', tip: 'Sponge foot rim clean by 4mm.' }
        ],
        quality_checklist: [
          'No visible structural micro-cracks under 10x visual inspection',
          'Weight between 750g and 900g for ideal hand feel',
          'Base smoothed with wet chamois leather'
        ]
      },
      source: 'gemini',
      version: 1
    }
  };
  const list = [req, ...getStoredRequests()];
  saveStoredRequests(list);
  return req;
}

function mockSingleRequest(id: string): CraftRequest {
  return {
    id,
    customer_id: 'cust-1',
    artisan_id: 'artisan-1',
    product: 'Studio Ceramic Carafe',
    style: 'Modern Earthy',
    colors: ['#e4793f', '#0d0e11', '#4fd1c5'],
    size_label: 'Medium (18-25cm)',
    budget: 800,
    purpose: 'Everyday tabletop dining and pouring',
    pattern: 'Fluted Spiral',
    status: 'ANALYSED',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    brief: mockBrief(id)
  };
}

function mockBrief(requestId: string): CraftBrief {
  return {
    id: `brief-${requestId}`,
    request_id: requestId,
    brief_json: {
      summary: 'Handcrafted stoneware carafe with ergonomic handle contour and dripless lip taper.',
      product: 'Studio Ceramic Carafe',
      target_dimensions: 'Height: 24 cm, Mouth: 8.5 cm, Base: 11 cm',
      aesthetic_notes: 'Two-tone contrast between raw iron-rich clay foot and silky matte oatmeal glaze.',
      palette_hex: ['#e4793f', '#14161b', '#4fd1c5'],
      clay_body_recommendation: 'High-fire speckled stoneware Cone 6',
      critical_tolerances: ['Handle pull thickness 18mm at top anchor', 'Spout pinch angle 42° to prevent back-drip', 'Water-tight vitrification']
    },
    guidance_json: {
      stages: [
        { step: 1, title: 'Throwing Body', focus: 'Neck taper and wall uniformity', checkpoint: 'Wall thickness 6mm at belly', tip: 'Leave excess clay at rim for spout pull.' },
        { step: 2, title: 'Handle Pulling & Attachment', focus: 'Smooth score & slip bonding', checkpoint: 'Compression joints blended seamlessly', tip: 'Dry in humidity tent for 24h.' },
        { step: 3, title: 'Bisque & Wax Resist', focus: 'Cone 06 bisque firing', checkpoint: 'Zero pinholes in bisque', tip: 'Apply wax resist 8mm up from base.' },
        { step: 4, title: 'Cone 6 Glaze Firing', focus: 'Silky iron-speck glaze melt', checkpoint: 'Matte sheen without blister defects', tip: 'Controlled cooling ramp at 1000°C.' }
      ],
      quality_checklist: [
        'Drip test: 500ml pour without dribbling along neck',
        'Handle holds 1.5kg cantilever load safely',
        'Rim feels smooth and non-abrasive on lips'
      ]
    },
    source: 'gemini',
    version: 1,
    created_at: new Date().toISOString()
  };
}

function mockSubmission(data: any): Submission {
  return {
    id: `sub-${Date.now()}`,
    request_id: data.request_id,
    artisan_id: 'artisan-1',
    height_cm: data.height_cm || 23.5,
    material_cost: data.material_cost || 160,
    labour_hours: data.labour_hours || 4.5,
    complexity: data.complexity || 'Medium',
    image_paths: data.image_paths || [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: new Date().toISOString()
  };
}

export function mockAnalysisResult(submissionId: string): AnalysisResult {
  return {
    id: `an-${submissionId}`,
    submission_id: submissionId,
    job_status: 'completed',
    stage: 'Completed',
    progress_pct: 100,
    match_pct: 88,
    match_detail: {
      colour_score: 92,
      pattern_score: 84,
      type_score: 95,
      size_score: 90,
      style_score: 82,
      notes: 'Terracotta tone matches requested palette closely (CIEDE2000 ΔE < 3.2). Geometric fluting follows brief specification.'
    },
    defects: [
      {
        id: 'def-1',
        class_name: 'uneven_glaze',
        confidence: 0.74,
        box: [0.38, 0.22, 0.46, 0.35],
        region: 'middle'
      },
      {
        id: 'def-2',
        class_name: 'stain',
        confidence: 0.68,
        box: [0.72, 0.48, 0.78, 0.55],
        region: 'bottom'
      }
    ],
    annotated_path: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    quality_score: 86,
    subscores: {
      structural: 95,
      finish: 78,
      pattern: 88,
      colour: 90,
      shape: 92
    },
    price_low: 720,
    price_high: 845,
    demand_level: 'High',
    demand_score: 5,
    report: {
      executive_summary: 'Outstanding craftsmanship with solid structural integrity (95/100) and graceful contouring. Two minor cosmetic surface flags detected that can be buffed or sealed prior to final dispatch.',
      passed_checks: [
        'Zero structural body micro-cracks or rim chips detected by YOLOv8n ONNX model',
        'Wall proportion and height (23.5 cm) fall right within target tolerance band (22 ± 1.5 cm)',
        'Earthy terracotta body tone meets customer swatch specification with 92% colour harmony',
        'Water-tight finish verified across inner glaze lining'
      ],
      ranked_fixes: [
        {
          priority: 'finish',
          title: 'Smooth Uneven Glaze Sheen on Mid-Shoulder',
          description: 'A 14mm variance in matte glaze accumulation detected around middle left shoulder.',
          action_step: 'Lightly polish with 400-grit diamond finishing pad and apply microcrystalline wax for an even satin luster.'
        },
        {
          priority: 'cosmetic',
          title: 'Clean Small Firing Ash Stain Near Base',
          description: 'Localised 6mm iron/ash speck mark located on lower foot region.',
          action_step: 'Sponge with a diluted white vinegar bath or light pumice powder rub.'
        }
      ],
      artisan_praise: 'Your wheel centering and handle tension demonstrate veteran throwing skill. The silhouette is balanced, solid, and wonderfully tactile.',
      customer_guidance: 'This piece captures the requested organic aesthetic beautifully. Minor surface nuances are characteristic of authentic studio wood/gas kiln firings.'
    },
    model_version: 'yolov8n-pottery-onnx-v1.4',
    source: 'gemini',
    created_at: new Date().toISOString()
  };
}

const initialMockRequests: CraftRequest[] = [
  {
    id: 'req-101',
    customer_id: 'cust-1',
    artisan_id: 'artisan-1',
    product: 'Studio Ceramic Carafe',
    style: 'Modern Earthy',
    colors: ['#e4793f', '#14161b', '#4fd1c5'],
    size_label: 'Medium (18-25cm)',
    budget: 850,
    purpose: 'Tabletop pouring vessel with natural matte finish',
    pattern: 'Fluted Spiral',
    status: 'ANALYSED',
    created_at: '2026-10-07T10:30:00Z',
    brief: mockBrief('req-101')
  },
  {
    id: 'req-102',
    customer_id: 'cust-1',
    artisan_id: null,
    product: 'Terracotta Planter Pot',
    style: 'Raw Rustic',
    colors: ['#c85a20', '#efe9de'],
    size_label: 'Large (25-35cm)',
    budget: 1200,
    purpose: 'Balcony garden centerpiece with drainage saucer',
    pattern: 'Geometric Chevron Etching',
    status: 'BRIEFED',
    created_at: '2026-10-08T14:15:00Z',
    brief: mockBrief('req-102')
  },
  {
    id: 'req-103',
    customer_id: 'cust-2',
    artisan_id: 'artisan-1',
    product: 'Teal Glaze Tea Service Set',
    style: 'Wabi-Sabi Zen',
    colors: ['#4fd1c5', '#0d0e11'],
    size_label: 'Small (12-18cm)',
    budget: 2100,
    purpose: 'Loose leaf tea ceremony ritual pot and 2 cups',
    pattern: 'Crackled Celadon Glaze',
    status: 'IN_PROGRESS',
    created_at: '2026-10-09T08:00:00Z',
    brief: mockBrief('req-103')
  }
];

export const mockDatasets: DatasetRecord[] = [
  {
    id: 'ds-1',
    name: 'PotteryDefects-Kaggle-V2',
    source: 'Kaggle: craftai/pottery-defects-yolo',
    classes: ['crack', 'chip', 'uneven_glaze', 'stain'],
    counts: { crack: 412, chip: 289, uneven_glaze: 520, stain: 198 },
    license: 'CC-BY-4.0',
    created_at: '2026-09-15T12:00:00Z'
  },
  {
    id: 'ds-2',
    name: 'StudioCeramics-Roboflow-Curated',
    source: 'Roboflow: studio-ceramics-v4/dataset',
    classes: ['crack', 'chip', 'blister', 'crawling'],
    counts: { crack: 320, chip: 210, blister: 180, crawling: 145 },
    license: 'MIT',
    created_at: '2026-09-28T09:30:00Z'
  }
];

export const mockModels: ModelItem[] = [
  {
    id: 'mod-1',
    run_id: 'run-902',
    version: 'yolov8n-pottery-v1.4.onnx',
    onnx_path: 'models/yolov8n_pottery_v1.4.onnx',
    map50: 0.884,
    is_active: true,
    promoted_at: '2026-10-01T15:20:00Z'
  },
  {
    id: 'mod-2',
    run_id: 'run-881',
    version: 'yolov8n-pottery-v1.3.onnx',
    onnx_path: 'models/yolov8n_pottery_v1.3.onnx',
    map50: 0.832,
    is_active: false,
    promoted_at: '2026-09-18T11:00:00Z'
  }
];

export function mockTrainingRun(id: string): TrainingRun {
  const metrics: EpochMetric[] = [];
  const totalEpochs = 25;
  for (let e = 1; e <= totalEpochs; e++) {
    const progress = e / totalEpochs;
    metrics.push({
      epoch: e,
      epochs: totalEpochs,
      metrics: {
        'metrics/mAP50(B)': Number((0.42 + 0.46 * Math.sqrt(progress) + Math.random() * 0.02).toFixed(3)),
        'metrics/mAP50-95(B)': Number((0.25 + 0.38 * progress + Math.random() * 0.015).toFixed(3)),
        'metrics/precision(B)': Number((0.55 + 0.35 * progress).toFixed(3)),
        'metrics/recall(B)': Number((0.50 + 0.37 * progress).toFixed(3)),
      },
      loss: [
        Number((2.8 * Math.exp(-progress * 2.2) + 0.35).toFixed(3)), // box loss
        Number((1.9 * Math.exp(-progress * 2.0) + 0.22).toFixed(3)), // cls loss
        Number((1.2 * Math.exp(-progress * 1.8) + 0.15).toFixed(3)), // dfl loss
      ],
      eta_seconds: Math.max(0, Math.round((totalEpochs - e) * 14))
    });
  }

  return {
    id,
    dataset_id: 'ds-1',
    config: {
      dataset_id: 'ds-1',
      base_model: 'yolov8n',
      epochs: 25,
      imgsz: 640,
      batch: 16,
      classes: ['crack', 'chip', 'uneven_glaze', 'stain'],
      seed: 42,
      split: '70/20/10',
      augmentation: 'standard'
    },
    status: 'completed',
    metrics,
    final_metrics: {
      'mAP@0.5': 0.884,
      'mAP@0.5:0.95': 0.631,
      'precision': 0.892,
      'recall': 0.865
    },
    artifact_onnx: 'models/yolov8n_pottery_v1.4.onnx',
    notebook_url: '#',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  };
}
