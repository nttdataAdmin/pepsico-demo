from fastapi import APIRouter
from app.services.ai_service import AIService
from app.services.data_loader import DataLoader
from app.api.models import RecommendationRequest, AnalysisRequest, AIResponse

router = APIRouter(prefix="/api/ai", tags=["ai"])
ai_service = AIService()
data_loader = DataLoader()


@router.post("/recommendations", response_model=AIResponse)
async def get_ai_recommendations(request: RecommendationRequest):
    """Get AI-generated recommendations"""
    # Get asset data
    assets = data_loader.get_assets_filtered(
        state=request.state,
        plant=request.plant,
        asset_id=request.asset_id
    )
    
    if not assets:
        return AIResponse(result="No assets found matching the criteria.")
    
    # Use first asset or aggregate data
    asset_data = assets[0] if len(assets) == 1 else {"assets": assets}
    
    # Generate recommendation
    recommendation = ai_service.generate_recommendations(
        asset_data=asset_data,
        context=request.context
    )
    
    return AIResponse(result=recommendation)


@router.post("/analysis", response_model=AIResponse)
async def get_ai_analysis(request: AnalysisRequest):
    """Get AI-generated analysis for a specific asset"""
    # Get asset data
    assets = data_loader.get_assets_filtered(asset_id=request.asset_id)
    
    if not assets:
        return AIResponse(result=f"No asset found with ID: {request.asset_id}")
    
    asset_data = assets[0]
    
    # Get related data for context
    anomalies = data_loader.load_anomalies()
    asset_anomalies = anomalies[anomalies.get("asset_id", "") == request.asset_id] if not anomalies.empty else None
    
    historical_data = request.historical_data or {}
    if not asset_anomalies.empty:
        historical_data["anomalies"] = asset_anomalies.to_dict(orient="records")
    
    # Generate analysis
    analysis = ai_service.generate_analysis(
        asset_id=request.asset_id,
        asset_data=asset_data,
        historical_data=historical_data if historical_data else None
    )
    
    return AIResponse(result=analysis)

