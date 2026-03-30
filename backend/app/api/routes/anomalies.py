from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Query

from app.services.anomaly_agent_briefing import build_anomaly_agent_briefing
from app.services.data_loader import DataLoader

router = APIRouter(prefix="/api/anomalies", tags=["anomalies"])
data_loader = DataLoader()


def _filter_rows(
    rows: List[Dict[str, Any]],
    state: Optional[str],
    plant: Optional[str],
    asset_id: Optional[str],
) -> List[Dict[str, Any]]:
    out = rows
    if state and out and "state" in out[0]:
        out = [r for r in out if r.get("state") == state]
    if plant and out and "plant" in out[0]:
        out = [r for r in out if r.get("plant") == plant]
    if asset_id and out and "asset_id" in out[0]:
        out = [r for r in out if r.get("asset_id") == asset_id]
    return out


@router.get("")
async def get_anomalies(
    state: Optional[str] = Query(None, description="Filter by state"),
    plant: Optional[str] = Query(None, description="Filter by plant"),
    asset_id: Optional[str] = Query(None, description="Filter by asset ID"),
):
    """Get anomaly monitoring data (vibration and temperature)"""
    rows = data_loader.load_anomalies()
    if not rows:
        return []
    return _filter_rows(rows, state, plant, asset_id)


@router.get("/agent-briefing")
async def get_anomaly_agent_briefing(
    state: Optional[str] = Query(None, description="Filter by state"),
    plant: Optional[str] = Query(None, description="Filter by plant"),
    asset_id: Optional[str] = Query(None, description="Filter by asset ID"),
):
    """Fused narrative + structured signals for the anomalies agent panel (same scope as telemetry)."""
    rows = data_loader.load_anomalies()
    filtered = _filter_rows(rows or [], state, plant, asset_id)
    return build_anomaly_agent_briefing(filtered, state=state, plant=plant, asset_id=asset_id)
