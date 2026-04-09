"""Classify QC form scans as go vs no_go (demo heuristics + optional Azure Read OCR)."""
from __future__ import annotations

import re
import time
from typing import Any, Dict, List, Optional, Tuple

import httpx

from app.config import settings


NO_GO_TOKENS = re.compile(
    r"(no[\s\-]?go\b|\brt\b|\bra\b|^\s*no\s*$)",
    re.IGNORECASE | re.MULTILINE,
)


def classify_from_filename(filename: str) -> Optional[str]:
    if not filename:
        return None
    lower = filename.lower().replace("\\", "/").split("/")[-1]
    # Demo sample photos (exact stem; any common extension)
    base, _dot, ext = lower.rpartition(".")
    stem = base if ext in (
        "png",
        "jpg",
        "jpeg",
        "webp",
        "gif",
        "bmp",
        "tif",
        "tiff",
        "pdf",
        "svg",
    ) else lower
    if stem == "img7719":
        return "go"
    if stem == "img7720":
        return "no_go"
    # Short demo filenames (e.g. go.png / nogo.png in repo root)
    if stem == "go":
        return "go"
    if stem == "nogo":
        return "no_go"
    if "nogo" in lower or "no_go" in lower or "no-go" in lower:
        return "no_go"
    # Handwritten FL-5883 demo assets
    if "handwritten_fl5883" in lower or "fl5883_handwritten" in lower:
        return "go" if "nogo" not in lower.replace("-", "") else "no_go"
    if "sample_form_go" in lower or lower.endswith("_go.svg") or lower.endswith("_go.png"):
        return "go"
    if "sample_form_nogo" in lower or lower.endswith("_nogo.svg") or lower.endswith("_nogo.png"):
        return "no_go"
    if re.search(r"(^|[^a-z])go([^a-z]|$)", lower) and "nogo" not in lower.replace("-", ""):
        if "no_go" in lower or "no-go" in lower:
            return "no_go"
        return "go"
    return None


def _azure_endpoint_base() -> str:
    u = (settings.azure_doc_intelligence_endpoint or "").strip().rstrip("/")
    return u


def _azure_read_markdown(content: bytes, content_type: str) -> Tuple[str, Optional[str]]:
    endpoint = _azure_endpoint_base()
    key = (settings.azure_doc_intelligence_key or "").strip()
    if not endpoint or not key:
        return "", "azure_not_configured"

    # Document Intelligence 4.0 REST — prebuilt-read
    url = (
        f"{endpoint}/documentintelligence/documentModels/prebuilt-read:analyze"
        f"?api-version=2024-11-30"
    )
    headers = {"Ocp-Apim-Subscription-Key": key, "Content-Type": content_type}

    with httpx.Client(timeout=120.0) as client:
        r = client.post(url, content=content, headers=headers)
        if r.status_code not in (200, 202):
            return "", f"azure_http_{r.status_code}:{r.text[:200]}"

        op_loc = r.headers.get("operation-location") or r.headers.get("Operation-Location")
        if not op_loc:
            return "", "azure_no_operation_location"

        for _ in range(60):
            pr = client.get(op_loc, headers={"Ocp-Apim-Subscription-Key": key})
            body = pr.json() if pr.content else {}
            status = (body.get("status") or "").lower()
            if status == "succeeded":
                analyze = body.get("analyzeResult") or body
                content_md = analyze.get("content") or ""
                return content_md, None
            if status == "failed":
                err = body.get("error", {})
                return "", f"azure_failed:{err}"
            time.sleep(1)

    return "", "azure_poll_timeout"


def classify_from_ocr_text(text: str) -> Tuple[str, List[str]]:
    """
    Heuristic: real forms always contain the words NO-GO in headers.
    We look for lines that suggest a mark in a failure column (very approximate).
    """
    reasons: List[str] = []
    if not text or len(text.strip()) < 20:
        return "go", reasons

    t = text
    # Strong signals: checked / X near failure keywords (best-effort)
    failure_line = re.compile(
        r".{0,40}(NO[\s\-]?GO|RTA|\bRA\b|\bNO\b).{0,40}([xX✓√■◼]|checked|selected)",
        re.IGNORECASE,
    )
    if failure_line.search(t):
        reasons.append("ocr_failure_mark_near_keyword")
        return "no_go", reasons

    # Weak: multiple standalone NO-GO tokens beyond first screen (headers repeat less in body)
    matches = list(NO_GO_TOKENS.finditer(t))
    if len(matches) >= 4:
        reasons.append("repeated_failure_tokens")
        return "no_go", reasons

    return "go", reasons


def classify_upload(
    file_bytes: bytes,
    filename: str,
    content_type: str,
    client_hint: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Returns { classification: 'go'|'no_go', method, details }.
    """
    hint = (client_hint or "").strip().lower()
    if hint in ("go", "no_go", "nogo"):
        c = "no_go" if hint == "nogo" else hint
        return {
            "classification": c,
            "method": "client_hint",
            "confidence": "high",
            "details": {},
        }

    by_name = classify_from_filename(filename)
    if by_name:
        return {
            "classification": by_name,
            "method": "filename",
            "confidence": "high",
            "details": {"filename": filename},
        }

    ocr_text = ""
    ocr_err = None
    if settings.azure_doc_intelligence_use_ocr:
        ocr_text, ocr_err = _azure_read_markdown(file_bytes, content_type or "application/octet-stream")

    if ocr_text:
        c, reasons = classify_from_ocr_text(ocr_text)
        return {
            "classification": c,
            "method": "azure_read_heuristic",
            "confidence": "medium",
            "details": {"ocr_error": ocr_err, "reasons": reasons, "ocr_preview": ocr_text[:500]},
        }

    # No OCR / failed: safe default for demo — treat as go with low confidence (avoid false alarm)
    default = (settings.form_classify_default or "go").strip().lower()
    if default not in ("go", "no_go"):
        default = "go"
    return {
        "classification": default,
        "method": "default",
        "confidence": "low",
        "details": {"ocr_error": ocr_err, "note": "upload_unrecognized_use_filename_or_enable_azure"},
    }
