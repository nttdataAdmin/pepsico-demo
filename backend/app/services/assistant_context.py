"""Compact JSON snapshots for the in-app assistant (grounding in backend data)."""

import json
from typing import Any, Dict, List, Optional

from app.services.data_loader import DataLoader


def _status_breakdown(rows: List[Dict[str, Any]]) -> Dict[str, int]:
    out = {"working": 0, "failure_predicted": 0, "under_maintenance": 0, "breakdown": 0, "other": 0}
    for a in rows:
        s = str(a.get("status", "")).lower()
        if s == "working":
            out["working"] += 1
        elif s == "failure predicted":
            out["failure_predicted"] += 1
        elif s == "under maintenance":
            out["under_maintenance"] += 1
        elif s == "breakdown":
            out["breakdown"] += 1
        else:
            out["other"] += 1
    return out


def build_executive_assistant_snapshot(
    data_loader: DataLoader,
    ui_context: Optional[Dict[str, Any]],
    client_route: str = "",
) -> str:
    ctx = ui_context or {}
    filters = ctx.get("filters") or {}
    state = filters.get("state")
    plant = filters.get("plant")
    asset_id = filters.get("asset_id")

    summary_all = data_loader.get_asset_summary()
    filtered_assets = data_loader.get_assets_filtered(state=state, plant=plant, asset_id=asset_id)
    filtered_ids = {a.get("asset_id") for a in filtered_assets if a.get("asset_id")}

    anomalies = data_loader.load_anomalies()
    if filtered_ids:
        anomalies_scoped = [r for r in anomalies if r.get("asset_id") in filtered_ids]
    else:
        anomalies_scoped = anomalies

    recommendations = data_loader.load_recommendations()
    maintenance = data_loader.load_maintenance()
    root = data_loader.load_root_causes()
    root_keys = list(root.keys()) if isinstance(root, dict) else None

    pack: Dict[str, Any] = {
        "app": "PepsiCo Management System demo",
        "client_route": client_route,
        "data_sources": "backend/data: assets.json, anomalies.csv, recommendations.csv, maintenance.csv, root_causes.json",
        "period_ui": {"month": ctx.get("selectedMonth"), "year": ctx.get("selectedYear")},
        "filters": {"state": state, "plant": plant, "asset_id": asset_id},
        "fleet_summary_unfiltered": summary_all,
        "filtered_asset_count": len(filtered_assets),
        "filtered_status_breakdown": _status_breakdown(filtered_assets),
        "filtered_assets": filtered_assets[:60],
        "anomaly_rows_scoped_sample": anomalies_scoped[:100],
        "anomaly_rows_total_in_dataset": len(anomalies),
        "recommendations_sample": recommendations[:60],
        "maintenance_sample": maintenance[:60],
        "root_causes_json_top_level_keys": root_keys,
    }

    raw = json.dumps(pack, indent=2, default=str)
    return raw[:100000]
