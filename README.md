# CraftBridge AI (Website Build)

> **Precision AI Co-pilot for Artisans & Handcrafted Products**  
> Built strictly within zero-cost free-tier cloud limits (Render 512 MB RAM, Supabase Free, Google Gemini Flash Free, Groq Free).

---

## 1. System Architecture & Topology

```text
Browser (React SPA, Render Static Site)
 | HTTPS, JWT from Supabase Auth
 v
FastAPI (Render free Web Service, 512 MB RAM)
 |-- AI Gateway --> Gemini (primary) -> Groq (fallback) -> deterministic templates
 |-- Vision: ONNX YOLOv8n (onnxruntime CPU, in-process) + numpy k-means colour match
 |-- Logic: quality score, price range, demand, report builder (plain Python)
 v
Supabase: Postgres (data) | Storage (photos, models, datasets) | Auth (roles)

Developer only: Secret route in SPA (/${VITE_FORGE_SLUG}) -> /api/forge/* (role=developer)
 Model Forge generates Colab/Kaggle notebook -> Cloud trains -> posts webhook metrics -> Promotes model
```

---

## 2. Memory Budget on 512 MB (Render Free Web Service)

| Component | Target Memory Footprint | Strategy |
| :--- | :--- | :--- |
| **Python + FastAPI + Uvicorn** | ~90 – 110 MB | 1 Uvicorn worker, lightweight dependencies |
| **onnxruntime + yolov8n.onnx** | ~120 – 180 MB | CPU execution provider, intra-op thread=1, no torch |
| **numpy + Pillow** | ~40 – 70 MB | Client-side downscaled to max 1024 px JPEG |
| **Headroom for incoming requests** | >= 100 MB | Guarded with `asyncio.Semaphore(1)` lock |
| **Total Resident Set Size (RSS)** | **< 420 MB** | Safe under Render 512 MB ceiling |

---

## 3. Free AI Budget & Gateway Configuration

- **Primary Provider**: Google Gemini 1.5 Flash (via free Google AI Studio key, ~15 RPM, 250–1,000 RPD).
- **Fallback Provider**: Groq Free Tier (Llama 3.3 70B / 8B, ~30 RPM).
- **Deterministic Templates**: Unlimited offline fallback for Craft Briefs, Workshop Guidance, and Diagnostic Reports.
- **Quota Safety**: Stops AI calls at 90% of configured daily limit and reserves buffer for customer briefs.
- **Privacy Assurance**: Customer names, phone numbers, and addresses are **never** transmitted to LLM providers.

---

## 4. Key Workflows & Features

### 4.1 Customer Journey (Patron)
1. **C1 Bespoke Request**: Interactive vessel silhouette selection, ceramic glaze swatches, scale dimensions, and budget slider.
2. **C2 Status Stepper**: Real-time progress tracking across the 7 lifecycle states:  
   `DRAFT -> BRIEFED -> IN_PROGRESS -> UPLOADED -> ANALYSED -> PREVIEWED -> APPROVED`.
3. **C3 Preview & Certification**: Match percentage, defect bounding boxes, quality ring gauge, and 1-click approval or revision note.

### 4.2 Artisan Studio
1. **A1 Craft Brief**: Automated technical specifications (clay body formulation, target dimensions, critical tolerances).
2. **A2 Step Guidance**: Plain English milestones for throwing, centering, trimming, and Cone 6 firing.
3. **A3 Capture Gate**: 4-angle photo slots with client-side luminance and Laplacian blur checks that reject dark or blurry uploads.
4. **A4 Studio Diagnostic Report**: Cost-plus fair price breakdown, indicative demand rating, and prioritized action checklist.

### 4.3 Model Forge (Hidden Developer MLOps Console)
- Route guarded by secret slug (`VITE_FORGE_SLUG`) and `role=developer`.
- Generates ready-to-run Google Colab / Kaggle `.ipynb` notebooks.
- Live Recharts training curves (mAP@0.5, mAP@0.5:0.95, Loss, ETA).
- Passphrase-guarded atomic ONNX hot-swapping and rollback.

---

## 5. Quick Start (Local Development)

### 5.1 Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App starts at http://localhost:5173
```
Build for production:
```bash
npm run build
# Verified output: dist/ with lazy-loaded Forge chunk
```

### 5.2 Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# API docs at http://localhost:8000/docs
```

Run unit tests:
```bash
python tests/run_tests.py
# Verified: Worked price formula (Rs 495 -> Rs 720 to 845), scoring penalties, and demand rules pass
```

---

## 6. Render.com Deployment via Blueprint

1. Create a free Supabase project and run the SQL table definitions in `DECISIONS.md`.
2. Push repository to GitHub.
3. In Render Dashboard, click **New > Blueprint** and select this repository (`render.yaml`).
4. Configure environment variables in Render:
   - `DATABASE_URL` (Supabase connection string)
   - `GEMINI_API_KEY` (Google AI Studio free key)
   - `GROQ_API_KEY` (Groq free key)
   - `FORGE_PASSPHRASE` (Developer secret)
   - `VITE_FORGE_SLUG` (Hidden URL slug)
5. Deploy API first, copy Render URL into `VITE_API_URL`, then deploy Static Site.
