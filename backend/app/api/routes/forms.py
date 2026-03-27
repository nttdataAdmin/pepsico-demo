from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile

from app.services.form_classifier import classify_upload

router = APIRouter(prefix="/api/forms", tags=["forms"])


@router.post("/classify")
async def classify_form(
    file: UploadFile = File(...),
    client_hint: Optional[str] = Form(None),
):
    """
    Upload a QC form image/PDF. Classification uses filename patterns for demo samples,
    optional client_hint (go|no_go), then optional Azure Document Intelligence read + heuristics.
    """
    raw = await file.read()
    ct = file.content_type or "application/octet-stream"
    name = file.filename or "upload"
    result = classify_upload(raw, name, ct, client_hint=client_hint)
    return {
        "filename": name,
        "content_type": ct,
        **result,
    }
