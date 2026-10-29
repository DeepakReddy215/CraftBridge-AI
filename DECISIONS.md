# CraftBridge AI - Architecture & Free-Tier Decisions (DECISIONS.md)

This log documents all architectural decisions made to operate CraftBridge AI at strictly **zero dollar cost** within free-tier quotas (Render 512 MB, Supabase Free, Google Gemini Free, Groq Free).

---

## 1. Zero-Cost Hosting & Compute Topology
- **Frontend**: Render Static Site (Unlimited bandwidth / static requests, $0/month). `/*` rewritten to `/index.html`.
- **Backend**: Render Free Web Service (512 MB RAM, 0.1 vCPU).
  - Sleeps after 15 minutes of idle time.
  - **Mitigation**: Dedicated client-side wake-up ping to `/api/health` with animated progress status and exponential backoff retry.
- **Worker Configuration**: Single Uvicorn worker process to keep base RAM footprint under 110 MB.
- **Model Execution in API**: ONNX Runtime CPU execution on `yolov8n.onnx` (~12 MB). No PyTorch, no Ultralytics, no OpenCLIP at runtime in the production API image to guarantee memory stays strictly below the 512 MB ceiling.
- **Concurrency Guard**: Asynchronous Semaphore (`asyncio.Semaphore(1)`) around defect inference so concurrent requests never load multiple ONNX inference buffers into memory simultaneously.

---

## 2. Database & Persistent Storage
- **Database**: Supabase Postgres free tier (500 MB DB) instead of Render Postgres (which expires after 30 days on free tier).
- **Blob Storage**: Supabase Storage buckets (`photos`, `models`, `datasets`) with signed upload/download URLs instead of local disk storage (Render containers have ephemeral disks that wipe on sleep/restart).
- **Cold Boot & Model Bootstrap**: Active ONNX model downloaded to `/tmp` upon boot or lazily loaded on the first analysis request. Temporary files only reside in `/tmp`.

---

## 3. AI Gateway & Fallback Chain
- **Primary LLM**: Google Gemini 1.5 Flash (via free Google AI Studio API key).
- **Text Fallback**: Groq Free Tier (Llama 3.3 70B / 8B) if Gemini hits rate limits (429) or timeouts.
- **Deterministic Fallback**: Local rule-based templates for Craft Briefs, Quality Recommendations, and Report summaries when both AI provider limits are exhausted or offline.
- **Zero Hallucination / Security**:
  - Pydantic v2 strict schema enforcement with retry logic.
  - All customer inputs sanitized, stripped of HTML, and length-bounded to neutralize prompt injection.
  - Personal identifiable information (PII) like names, emails, and exact addresses is never sent to LLM providers.
- **Caching**: SHA-256 hash of task + normalized prompt stored in `ai_cache` to eliminate redundant API calls for recurring prompts.

---

## 4. Model Forge (Training & MLOps)
- **Zero Cloud GPU Cost**: YOLO training is never executed on Render. Model Forge prepares datasets, generates standard Google Colab / Kaggle `.ipynb` notebooks configured with run tokens and automated webhook callbacks.
- **Live Stream**: The notebook streams epoch metrics (box loss, class loss, mAP@0.5, mAP@0.5:0.95) back to `/api/forge/runs/{id}/metrics`.
- **Promotion & Hot Swapping**: Model Forge enables candidate vs. active model side-by-side comparison. Promotion downloads `best.onnx`, executes a smoke inference on a reference pottery sample, and atomically hot-swaps the runtime model session in memory with zero downtime and rollback support.

---

## 5. Client-Side Quality Gate & Processing
- **Image Resizing**: Client resizes photos to max 1024 px JPEG (~300 KB) prior to transmission, saving egress bandwidth and server CPU cycles.
- **Client-Side Blurry / Dark Gate**: Web Worker Laplacian variance and luminance checks reject poor photos immediately before upload, ensuring artisans get instant feedback without wasting server resources.
