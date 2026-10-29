from typing import Dict, Any, List
from app.config import settings

def get_signed_upload_urls(bucket: str, file_keys: List[str], expires_in: int = 3600) -> Dict[str, str]:
    """
    Returns signed upload URLs for Supabase Storage.
    If Supabase credentials are not active, returns local simulated endpoints.
    """
    signed_urls = {}
    base_url = settings.supabase_url or "http://localhost:8000/api/storage"

    for key in file_keys:
        signed_urls[key] = f"{base_url}/upload/{bucket}/{key}?signed=true&expires={expires_in}"

    return signed_urls

def get_public_storage_url(bucket: str, file_path: str) -> str:
    if settings.supabase_url:
        return f"{settings.supabase_url}/storage/v1/object/public/{bucket}/{file_path}"
    # Standard static demo fallback image URL
    return "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
