from fastapi import APIRouter
from app.services.ai_service import AIService
from app.services.data_loader import DataLoader
from app.services.assistant_context import build_executive_assistant_snapshot
from app.api.models import RecommendationRequest, AnalysisRequest, AIResponse, AssistantRequest

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
    
    anomalies = data_loader.load_anomalies()
    asset_anomalies = [r for r in anomalies if r.get("asset_id") == request.asset_id]

    historical_data = request.historical_data or {}
    if asset_anomalies:
        historical_data["anomalies"] = asset_anomalies
    
    # Generate analysis
    analysis = ai_service.generate_analysis(
        asset_id=request.asset_id,
        asset_data=asset_data,
        historical_data=historical_data if historical_data else None
    )
    
    return AIResponse(result=analysis)


ASSISTANT_ALLOWED_ROUTES = frozenset(
    {
        "/executive-summary",
        "/anomalies",
        "/root-cause",
        "/recommendations",
        "/maintenance",
    }
)


@router.post("/assistant", response_model=AIResponse)
async def assistant_chat(request: AssistantRequest):
    """Dashboard assistant (all steps except login/upload); merges backend dataset snapshot."""
    route = (request.route or "").strip().rstrip("/") or "/"
    if route not in ASSISTANT_ALLOWED_ROUTES:
        return AIResponse(
            result="The assistant is available on dashboard steps (Executive summary, Anomalies, Root cause, Recommendations, Maintenance), not on Login or Upload."
        )

    kb = (request.knowledge_base or "").strip()
    try:
        snap = build_executive_assistant_snapshot(data_loader, request.ui_context, client_route=route)
        kb = f"{kb}\n\n--- Server grounding (packaging CSV/JSON snapshot, or processing-lens instruction) ---\n{snap}"
    except Exception as e:
        kb = f"{kb}\n\n(Backend data snapshot failed: {e})"

    payload = [{"role": m.role, "content": m.content} for m in request.messages]
    text = ai_service.assistant_chat(
        messages=payload,
        route=request.route,
        page_title=request.page_title,
        knowledge_base=kb,
        ui_context=request.ui_context,
    )
    return AIResponse(result=text)

