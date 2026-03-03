from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from app.services.data_loader import DataLoader
import pandas as pd

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])
data_loader = DataLoader()


@router.get("")
async def get_recommendations(
    state: Optional[str] = Query(None, description="Filter by state"),
    plant: Optional[str] = Query(None, description="Filter by plant"),
    asset_id: Optional[str] = Query(None, description="Filter by asset ID"),
    year: Optional[int] = Query(None, description="Filter by year"),
    month: Optional[str] = Query(None, description="Filter by month")
):
    """Get recommendations data"""
    df = data_loader.load_recommendations()
    
    if df.empty:
        return []
    
    # Apply filters
    if state and "state" in df.columns:
        df = df[df["state"] == state]
    if plant and "plant" in df.columns:
        df = df[df["plant"] == plant]
    if asset_id and "asset_id" in df.columns:
        df = df[df["asset_id"] == asset_id]
    if year and "year" in df.columns:
        df = df[df["year"] == year]
    if month and "month" in df.columns:
        df = df[df["month"] == month]
    
    # Convert to list of dictionaries
    result = df.to_dict(orient="records")
    return result

