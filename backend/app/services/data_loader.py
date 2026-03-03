import json
import csv
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
import pandas as pd


class DataLoader:
    def __init__(self, data_dir: str = None):
        if data_dir is None:
            # Get the data directory relative to this file
            current_dir = Path(__file__).parent.parent.parent
            data_dir = current_dir / "data"
        self.data_dir = Path(data_dir)
        self._assets = None
        self._root_causes = None
        self._anomalies_df = None
        self._recommendations_df = None
        self._maintenance_df = None
    
    def load_assets(self) -> Dict[str, Any]:
        """Load assets from JSON file"""
        if self._assets is None:
            assets_path = self.data_dir / "assets.json"
            if assets_path.exists():
                with open(assets_path, 'r') as f:
                    self._assets = json.load(f)
            else:
                self._assets = {}
        return self._assets
    
    def load_root_causes(self) -> Dict[str, Any]:
        """Load root causes from JSON file"""
        if self._root_causes is None:
            root_causes_path = self.data_dir / "root_causes.json"
            if root_causes_path.exists():
                with open(root_causes_path, 'r') as f:
                    self._root_causes = json.load(f)
            else:
                self._root_causes = {}
        return self._root_causes
    
    def load_anomalies(self) -> pd.DataFrame:
        """Load anomalies from CSV file"""
        if self._anomalies_df is None:
            anomalies_path = self.data_dir / "anomalies.csv"
            if anomalies_path.exists():
                self._anomalies_df = pd.read_csv(anomalies_path)
            else:
                self._anomalies_df = pd.DataFrame()
        return self._anomalies_df
    
    def load_recommendations(self) -> pd.DataFrame:
        """Load recommendations from CSV file"""
        if self._recommendations_df is None:
            recommendations_path = self.data_dir / "recommendations.csv"
            if recommendations_path.exists():
                self._recommendations_df = pd.read_csv(recommendations_path)
            else:
                self._recommendations_df = pd.DataFrame()
        return self._recommendations_df
    
    def load_maintenance(self) -> pd.DataFrame:
        """Load maintenance schedule from CSV file"""
        if self._maintenance_df is None:
            maintenance_path = self.data_dir / "maintenance.csv"
            if maintenance_path.exists():
                self._maintenance_df = pd.read_csv(maintenance_path)
            else:
                self._maintenance_df = pd.DataFrame()
        return self._maintenance_df
    
    def get_assets_filtered(
        self, 
        state: Optional[str] = None,
        plant: Optional[str] = None,
        asset_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get filtered assets"""
        assets = self.load_assets()
        asset_list = assets.get("assets", [])
        
        filtered = asset_list
        if state:
            filtered = [a for a in filtered if a.get("state") == state]
        if plant:
            filtered = [a for a in filtered if a.get("plant") == plant]
        if asset_id:
            filtered = [a for a in filtered if a.get("asset_id") == asset_id]
        
        return filtered
    
    def get_asset_summary(self) -> Dict[str, int]:
        """Get asset status summary"""
        assets = self.load_assets()
        asset_list = assets.get("assets", [])
        
        summary = {
            "total": len(asset_list),
            "working": 0,
            "failure_predicted": 0,
            "under_maintenance": 0,
            "breakdown": 0
        }
        
        for asset in asset_list:
            status = asset.get("status", "working").lower()
            if status == "working":
                summary["working"] += 1
            elif status == "failure predicted":
                summary["failure_predicted"] += 1
            elif status == "under maintenance":
                summary["under_maintenance"] += 1
            elif status == "breakdown":
                summary["breakdown"] += 1
        
        return summary

