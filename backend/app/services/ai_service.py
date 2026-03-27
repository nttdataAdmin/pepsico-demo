import json
import logging
from typing import Any, Dict, List, Optional

from openai import AzureOpenAI

from app.config import settings

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.client = None
        self.deployment = settings.azure_deployment
        
        # Only initialize client if credentials are provided
        if settings.azure_api_key and settings.azure_endpoint:
            try:
                self.client = AzureOpenAI(
                    api_key=settings.azure_api_key,
                    api_version=settings.azure_api_version,
                    azure_endpoint=settings.azure_endpoint
                )
            except Exception as e:
                print(f"Warning: Failed to initialize Azure OpenAI client: {e}")
    
    def generate_recommendations(
        self, 
        asset_data: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Generate AI-powered recommendations based on asset data"""
        
        prompt = f"""You are an expert maintenance analyst for PepsiCo. Analyze the following asset data and provide actionable recommendations.

Asset Information:
{json.dumps(asset_data, indent=2)}

"""
        if context:
            prompt += f"""
Additional Context:
{json.dumps(context, indent=2)}

"""
        
        prompt += """
Provide a concise, actionable recommendation focusing on:
1. Immediate actions required
2. Preventive measures
3. Risk assessment
4. Expected outcomes

Format your response as a clear, professional recommendation suitable for management review."""

        if not self.client:
            return "Azure OpenAI is not configured. Please set up your API credentials in the .env file."

        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": "You are an expert maintenance and asset management analyst for PepsiCo."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Unable to generate AI recommendation: {str(e)}"
    
    def generate_analysis(
        self,
        asset_id: str,
        asset_data: Dict[str, Any],
        historical_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """Generate AI-powered analysis for a specific asset"""
        
        prompt = f"""You are an expert maintenance analyst for PepsiCo. Provide a detailed root cause analysis for the following asset.

Asset ID: {asset_id}
Asset Data:
{json.dumps(asset_data, indent=2)}

"""
        if historical_data:
            prompt += f"""
Historical Data:
{json.dumps(historical_data, indent=2)}

"""
        
        prompt += """
Provide a comprehensive analysis including:
1. Root cause identification
2. Contributing factors
3. Impact assessment
4. Likelihood of failure
5. Recommended investigation steps

Format your response as a professional analysis report."""

        if not self.client:
            return "Azure OpenAI is not configured. Please set up your API credentials in the .env file."
        
        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": "You are an expert maintenance and root cause analysis specialist for PepsiCo."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Unable to generate AI analysis: {str(e)}"

    def generate_work_order_narrative(
        self,
        work_order: Dict[str, Any],
        asset_context: Optional[Dict[str, Any]] = None,
        recent_anomalies: Optional[List[Dict[str, Any]]] = None,
    ) -> Optional[str]:
        """
        Short operational summary for a maintenance work-order email (what it means, context, next steps).
        Returns None if Azure OpenAI is not configured or the call fails (caller sends template-only mail).
        """
        if not self.client:
            return None

        payload = {
            "scheduled_work_order": work_order,
            "asset_record": asset_context,
            "recent_condition_rows_sample": (recent_anomalies or [])[:8],
        }
        prompt = f"""You are writing the body section of an internal maintenance notification email for PepsiCo operations.

Use ONLY the JSON facts below. Do not invent asset IDs, dates, or sensor values not present in the data.
If anomaly or asset details are missing or empty, say what is unknown briefly and still give useful generic guidance for this type of maintenance.

JSON context:
{json.dumps(payload, indent=2)}

Write a clear email-ready section with these headings (use plain text, no markdown):
1) What this is — one short paragraph on what this scheduled work order is and why it matters.
2) What we know — bullet lines from the work order and asset/anomaly data (paraphrase; do not dump raw JSON).
3) Recommended actions — 2–4 concrete next steps for the recipient.

Keep total length under 280 words. Professional, direct tone."""

        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a maintenance operations writer for PepsiCo. Be accurate and concise.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.5,
                max_tokens=700,
            )
            text = (response.choices[0].message.content or "").strip()
            return text or None
        except Exception as e:
            logger.warning("Work order narrative LLM failed: %s", e)
            return None

