from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from app.services.data_loader import DataLoader
import pandas as pd

router = APIRouter(prefix="/api/maintenance", tags=["maintenance"])
data_loader = DataLoader()


@router.get("")
async def get_maintenance_schedule(
    state: Optional[str] = Query(None, description="Filter by state"),
    plant: Optional[str] = Query(None, description="Filter by plant"),
    asset_id: Optional[str] = Query(None, description="Filter by asset ID")
):
    """Get maintenance schedule data"""
    df = data_loader.load_maintenance()
    
    if df.empty:
        return []
    
    # Apply filters
    if state and "state" in df.columns:
        df = df[df["state"] == state]
    if plant and "plant" in df.columns:
        df = df[df["plant"] == plant]
    if asset_id and "asset_id" in df.columns:
        df = df[df["asset_id"] == asset_id]
    
    # Convert to list of dictionaries
    result = df.to_dict(orient="records")
    return result

