from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class AssetResponse(BaseModel):
    asset_id: str
    state: str
    plant: str
    asset_type: str
    status: str
    criticality: Optional[str] = None
    location: Optional[Dict[str, float]] = None
    
    class Config:
        extra = "allow"  # Allow extra fields that aren't in the model


class AssetSummaryResponse(BaseModel):
    total: int
    working: int
    failure_predicted: int
    under_maintenance: int
    breakdown: int


class AnomalyDataPoint(BaseModel):
    time: str
    vibration: Optional[float] = None
    temperature: Optional[float] = None


class RootCauseProbability(BaseModel):
    cause: str
    probability: float


class RecommendationRequest(BaseModel):
    asset_id: Optional[str] = None
    state: Optional[str] = None
    plant: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class AnalysisRequest(BaseModel):
    asset_id: str
    historical_data: Optional[Dict[str, Any]] = None


class AIResponse(BaseModel):
    result: str


class AssistantChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class AssistantRequest(BaseModel):
    """Multi-turn assistant with page-scoped knowledge (RAG-style context in knowledge_base)."""

    messages: List[AssistantChatMessage]
    route: str = "/"
    page_title: Optional[str] = None
    knowledge_base: str = ""
    ui_context: Optional[Dict[str, Any]] = None

