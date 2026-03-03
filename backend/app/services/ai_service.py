from openai import AzureOpenAI
from typing import Dict, Any, Optional
from app.config import settings
import json


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

