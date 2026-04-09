import json
import logging
import re
from typing import Any, Dict, List, Optional

from openai import AzureOpenAI

from app.config import settings

logger = logging.getLogger(__name__)


def _assistant_reply_plain_text(text: str) -> str:
    """Strip common Markdown so chat reads as plain operational prose."""
    if not text:
        return text
    s = text.strip()
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"\1", s)
    s = re.sub(r"__([^_]+)__", r"\1", s)
    s = re.sub(r"`([^`]+)`", r"\1", s)
    s = re.sub(r"^#{1,6}\s+", "", s, flags=re.MULTILINE)
    s = re.sub(r"\[(.*?)\]\([^)]+\)", r"\1", s)
    return s.strip()


def _completion_budget_kwargs(limit: int) -> Dict[str, int]:
    """Azure gpt-4o+ uses max_completion_tokens; older chat models use max_tokens."""
    n = max(1, min(int(limit), 16384))
    if settings.azure_use_max_completion_tokens:
        return {"max_completion_tokens": n}
    return {"max_tokens": n}


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
                **_completion_budget_kwargs(500),
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
                **_completion_budget_kwargs(800),
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
                **_completion_budget_kwargs(700),
            )
            text = (response.choices[0].message.content or "").strip()
            return text or None
        except Exception as e:
            logger.warning("Work order narrative LLM failed: %s", e)
            return None

    def assistant_chat(
        self,
        messages: List[Dict[str, str]],
        route: str,
        page_title: Optional[str],
        knowledge_base: str,
        ui_context: Optional[Dict[str, Any]] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        General chat assistant grounded in the provided knowledge_base and optional UI snapshot.
        """
        if not self.client:
            return "Azure OpenAI is not configured. Set AZURE_ENDPOINT and AZURE_API_KEY in the backend .env file."

        cap = max_tokens if max_tokens is not None else settings.azure_assistant_max_tokens
        meta_parts = [f"Current app route: {route}"]
        if page_title:
            meta_parts.append(f"Page title: {page_title}")
        if ui_context:
            meta_parts.append("UI context (filters, selections):\n" + json.dumps(ui_context, indent=2)[:12000])
        meta_block = "\n".join(meta_parts)

        system = f"""You are a PepsiCo operations and reliability assistant helping with a maintenance and asset-health demo.

SESSION META (internal only — do not quote route names or meta labels to the user): route and filters tell you which step they are on and whether operatorRole is processing (fryer, thermal oil, seasoning train) or packaging (palletizer, case line, conveyors). Use that vocabulary naturally in answers.

Internal grounding (never mention these mechanics to the user):
- Use the facts in the KNOWLEDGE BASE block below to stay aligned with the same numbers, assets, and events as the demo session. Prefer the block titled with "Current screen data" when it conflicts with the shorter server grounding section. For processing lens, ignore server rows that imply a different story than that block.
- Do not tell the user that information comes from "the UI", "the screen", "the dashboard", "what you see", "the app shows", "live data", "JSON", "knowledge base", "snapshot", or similar. Answer in plain operational language as if you already know the plant situation.

Response style:
- Write in plain text only. Do not use Markdown: no asterisks for bold or italics, no hash headings, no backticks, no bullet asterisks (use simple lines starting with a dash or numbered lines like 1. 2. if you need lists).
- Be direct, professional, and readable: short paragraphs and simple lists are fine.
- Do not paste raw JSON unless the user explicitly asks for raw data.
- If something is not in the provided facts, say briefly that the detail is not available for this session or view — do not instruct them to "look at the screen" or "check the UI".

--- KNOWLEDGE BASE ---
{knowledge_base[:120000]}

--- SESSION META ---
{meta_block}
"""

        api_messages: List[Dict[str, str]] = [{"role": "system", "content": system}]
        for m in messages:
            role = m.get("role", "user")
            if role not in ("user", "assistant"):
                continue
            content = (m.get("content") or "").strip()
            if not content:
                continue
            api_messages.append({"role": role, "content": content[:32000]})

        if len(api_messages) <= 1:
            return "Send a message to continue."

        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=api_messages,
                temperature=0.45,
                **_completion_budget_kwargs(min(cap, 8192)),
            )
            raw = (response.choices[0].message.content or "").strip()
            return _assistant_reply_plain_text(raw) or "(No response)"
        except Exception as e:
            logger.warning("Assistant chat failed: %s", e)
            return f"Unable to reach the assistant: {e}"

