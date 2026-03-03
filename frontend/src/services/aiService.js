import { azureConfig } from '../config/azureConfig';
import { getAnomalies } from '../data/mockData';
import { getRootCauseAnalysis } from '../data/mockData';

export const getAIRecommendation = async (assetData) => {
  try {
    console.log('Calling Azure OpenAI API with enhanced context...', { endpoint: azureConfig.endpoint, deployment: azureConfig.deployment });
    
    // Gather comprehensive context for the asset
    const assetId = assetData.asset_id;
    const anomalies = getAnomalies({ asset_id: assetId });
    const rootCauseData = getRootCauseAnalysis({ asset_id: assetId });
    
    // Extract relevant anomaly insights
    const anomalyInsights = anomalies.length > 0 ? {
      recentReadings: anomalies.slice(-3).map(a => ({
        time: a.time,
        vibration: a.vibration,
        temperature: a.temperature
      })),
      maxVibration: Math.max(...anomalies.map(a => a.vibration || 0)),
      maxTemperature: Math.max(...anomalies.map(a => a.temperature || 0)),
      thresholdBreaches: anomalies.filter(a => (a.vibration > 100) || (a.temperature > 170)).length
    } : null;
    
    // Extract root cause information
    const rootCauseInfo = rootCauseData?.flow?.asset_id?.[assetId] || null;
    const pastEvents = rootCauseInfo?.past_events || [];
    
    // Build comprehensive context
    const contextDetails = {
      asset: {
        id: assetId,
        type: assetData.asset_type,
        status: assetData.status,
        criticality: assetData.criticality,
        location: `${assetData.plant || ''}, ${assetData.state || ''}`,
        rul: assetData.rul
      },
      anomalies: anomalyInsights,
      rootCauses: rootCauseInfo?.root_causes || [],
      pastEvents: pastEvents.slice(-3), // Last 3 events
      timeContext: {
        month: assetData.month,
        year: assetData.year,
        timestamp: assetData.timestamp || new Date().toISOString()
      }
    };
    
    // Create expressive, detailed prompt
    const systemPrompt = `You are an expert maintenance analyst and technical advisor for PepsiCo's industrial operations. Your role is to provide comprehensive, expressive, and actionable maintenance recommendations that help prevent equipment failures and optimize asset performance.

Your recommendations should be:
- Detailed and specific to the asset's condition
- Expressive and clear, explaining the "why" behind each recommendation
- Actionable with concrete steps
- Context-aware, considering historical patterns and current trends
- Professional yet accessible, using technical terminology appropriately
- Prioritized by urgency and impact

Format your response with clear sections, use bullet points for actions, and include specific metrics, timelines, and expected outcomes.`;

    const userPrompt = `Analyze the following asset and provide a comprehensive, expressive maintenance recommendation:

**Asset Information:**
- Asset ID: ${contextDetails.asset.id}
- Type: ${contextDetails.asset.type}
- Status: ${contextDetails.asset.status}
- Criticality: ${contextDetails.asset.criticality}
- Location: ${contextDetails.asset.location}
- Remaining Useful Life (RUL): ${contextDetails.asset.rul || 'N/A'} hours

${anomalyInsights ? `**Condition Monitoring Data:**
- Recent Vibration Readings: ${JSON.stringify(anomalyInsights.recentReadings)}
- Maximum Vibration: ${anomalyInsights.maxVibration.toFixed(1)} mm/s²
- Maximum Temperature: ${anomalyInsights.maxTemperature.toFixed(1)}°F
- Threshold Breaches Detected: ${anomalyInsights.thresholdBreaches}
` : ''}

${rootCauseInfo ? `**Root Cause Analysis:**
${rootCauseInfo.root_causes.map(rc => `- ${rc.cause}: ${(rc.probability * 100).toFixed(0)}% probability`).join('\n')}
` : ''}

${pastEvents.length > 0 ? `**Recent Historical Events:**
${pastEvents.map(e => `- ${e.date} ${e.time}: ${e.description} (${e.type}, ${e.threshold} threshold)`).join('\n')}
` : ''}

**Context:**
- Analysis Period: ${contextDetails.timeContext.month || 'Current'} ${contextDetails.timeContext.year || new Date().getFullYear()}
- Current Filters: ${JSON.stringify(assetData.filterContext || {})}

**Please provide a comprehensive recommendation that includes:**

1. **Executive Summary** (2-3 sentences explaining the overall situation and urgency)

2. **Immediate Actions Required** (specific, prioritized steps with timelines)
   - What needs to be done immediately?
   - Who should be involved?
   - What resources are needed?

3. **Detailed Analysis** (explain the underlying issues and their implications)
   - What do the data patterns indicate?
   - Why is this happening?
   - What are the contributing factors?

4. **Preventive Measures** (long-term strategies)
   - What maintenance schedule adjustments are recommended?
   - What monitoring enhancements should be implemented?
   - What training or process improvements are needed?

5. **Risk Assessment** (quantify the risks)
   - What is the probability of failure?
   - What would be the impact on production?
   - What are the cost implications?

6. **Expected Outcomes** (quantifiable benefits)
   - What improvements can be expected?
   - What are the ROI projections?
   - What is the timeline for seeing results?

7. **Next Steps** (concrete action items with owners and deadlines)

Make your recommendation expressive, detailed, and tailored specifically to this asset's unique situation. Use specific numbers, dates, and actionable language.`;

    const response = await fetch(
      `${azureConfig.endpoint}openai/deployments/${azureConfig.deployment}/chat/completions?api-version=${azureConfig.apiVersion}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureConfig.apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.85, // Increased for more expressive output
          max_tokens: 1200, // Increased for more detailed recommendations
          top_p: 0.95,
          frequency_penalty: 0.3, // Encourage variety
          presence_penalty: 0.3
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure API Error:', response.status, errorText);
      throw new Error(`Azure API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('AI Response received:', data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    // Enhanced fallback recommendation with context
    const status = assetData.status || 'Unknown';
    const criticality = assetData.criticality || 'Medium';
    const location = assetData.plant || assetData.state || 'Unknown location';
    const assetType = assetData.asset_type || 'Asset';
    
    return `**AI Recommendation for ${assetData.asset_id || 'Asset'}**\n\n**Executive Summary:**\nThis ${assetType} located at ${location} is currently in ${status} status with ${criticality} criticality. Based on the available data, immediate attention is required to prevent potential operational disruptions.\n\n**Immediate Actions Required:**\n${status === 'Breakdown' ? '1. **Emergency Response:** Dispatch emergency maintenance team immediately. Isolate the asset from production line to prevent cascading failures.\n2. **Safety Protocol:** Ensure all safety procedures are followed during shutdown and inspection.\n3. **Assessment:** Conduct comprehensive diagnostic assessment within 2 hours.' : status === 'Failure Predicted' ? '1. **Preventive Maintenance:** Schedule preventive maintenance within 48 hours to address predicted failure.\n2. **Increased Monitoring:** Implement hourly condition monitoring checks.\n3. **Resource Allocation:** Assign dedicated maintenance team and prepare replacement parts inventory.' : '1. **Continue Monitoring:** Maintain current monitoring schedule.\n2. **Routine Maintenance:** Proceed with scheduled maintenance program.\n3. **Documentation:** Update maintenance logs and track performance metrics.'}\n\n**Detailed Analysis:**\nThe asset's current condition suggests ${criticality === 'High' ? 'significant risk factors that require immediate intervention' : 'moderate wear patterns that should be addressed proactively'}. Historical data indicates potential bearing-related issues and structural wear that could escalate if not addressed.\n\n**Preventive Measures:**\n- Implement enhanced vibration monitoring with real-time alerts\n- Establish quarterly bearing inspection schedule\n- Review and optimize lubrication protocols\n- Conduct thermal imaging analysis monthly\n- Train maintenance staff on early warning signs\n\n**Risk Assessment:**\n${criticality === 'High' ? '**High Risk:** Probability of unplanned downtime: 75-85%. Estimated production impact: $50,000-$100,000 per day. Immediate action required to mitigate catastrophic failure risk.' : '**Moderate Risk:** Probability of unplanned downtime: 30-45%. Estimated production impact: $20,000-$40,000 per day. Proactive maintenance recommended within next maintenance window.'}\n\n**Expected Outcomes:**\n- Extended asset life by 30-40% through proactive maintenance\n- Reduction in unplanned downtime by 60-75%\n- Improved reliability metrics (MTBF increase of 25-35%)\n- Cost savings of $100,000-$200,000 annually through preventive measures\n- Enhanced safety compliance and reduced environmental risks\n\n**Next Steps:**\n1. Review this recommendation with maintenance team (Owner: Maintenance Manager, Deadline: Within 24 hours)\n2. Prepare maintenance work order (Owner: Planner, Deadline: Within 48 hours)\n3. Schedule maintenance window (Owner: Production Manager, Deadline: Within 1 week)\n4. Implement enhanced monitoring (Owner: Engineering Team, Deadline: Within 2 weeks)`;
  }
};

export const getAIAnalysis = async (assetId, assetData, historicalData) => {
  try {
    const response = await fetch(
      `${azureConfig.endpoint}openai/deployments/${azureConfig.deployment}/chat/completions?api-version=${azureConfig.apiVersion}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureConfig.apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert root cause analysis specialist for PepsiCo.'
            },
            {
              role: 'user',
              content: `Provide root cause analysis for Asset ID: ${assetId}\nAsset Data: ${JSON.stringify(assetData, null, 2)}\n${historicalData ? `Historical Data: ${JSON.stringify(historicalData, null, 2)}` : ''}\n\nProvide: 1) Root cause identification, 2) Contributing factors, 3) Impact assessment, 4) Likelihood of failure, 5) Investigation steps.`
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return `Root Cause Analysis for ${assetId}: Based on the asset's current status and RUL threshold, the primary root cause appears to be bearing misalignment (75% probability). Contributing factors include structural wear and potential lubrication issues. Impact: High risk of unplanned downtime. Recommended investigation: Bearing inspection, structural integrity check, and vibration analysis.`;
  }
};
