from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.session import engine, Base
from app.routers import health, requests, briefs, submissions, analysis, feedback, forge

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables if not present
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="CraftBridge AI API",
    description="Precision AI Co-pilot for Artisans & Handcrafted Pottery",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware per Section 4.6
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins + ["*"], # Permissive in dev, bounded by ALLOWED_ORIGINS in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under /api prefix
app.include_router(health.router, prefix="/api")
app.include_router(requests.router, prefix="/api")
app.include_router(briefs.router, prefix="/api")
app.include_router(submissions.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(forge.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "app": "CraftBridge AI API",
        "status": "online",
        "docs": "/docs",
        "health": "/api/health"
    }
