import React, { useMemo } from 'react';
import './FlowVisualization.css';

const FlowVisualization = ({ data, selectedPath, onPathChange, thresholdCrossings = [] }) => {
  const flowData = useMemo(() => {
    if (!data || !data.flow) return null;

    const flow = data.flow;
    const states = flow.state || {};
    const plants = flow.plant || {};
    const assetIds = flow.asset_id || {};
    const rulThresholds = flow.rul_threshold || {};

    // Determine selected values
    const currentState = selectedPath.state || Object.keys(states)[0];
    const currentPlant = selectedPath.plant || Object.keys(plants).find(p => p.includes(currentState?.split(' ')[0] || '')) || Object.keys(plants)[0];
    const currentAssetId = selectedPath.asset_id || Object.keys(assetIds)[0];
    const currentRul = selectedPath.rul_threshold || (assetIds[currentAssetId]?.rul_threshold);

    // Get past events for selected asset
    const pastEvents = assetIds[currentAssetId]?.past_events || [];
    
    // Combine past events with threshold crossings for this asset
    const assetCrossings = thresholdCrossings.filter(c => c.asset_id === currentAssetId);
    const allPastEvents = [
      ...pastEvents.map(e => ({ ...e, source: 'historical' })),
      ...assetCrossings.map(c => ({
        date: selectedPath.date || '2023-02-20',
        time: c.time,
        type: c.type,
        threshold: c.threshold,
        value: c.value,
        previous: c.previous,
        description: `${c.type === 'vibration' ? 'Vibration' : 'Temperature'} crossed ${c.threshold} threshold`,
        source: 'detected'
      }))
    ].sort((a, b) => {
      const dateCompare = (a.date || '').localeCompare(b.date || '');
      if (dateCompare !== 0) return dateCompare;
      return (a.time || '').localeCompare(b.time || '');
    });

    return {
      total: data.total_assets || 0,
      states,
      plants,
      assetIds,
      rulThresholds,
      currentState,
      currentPlant,
      currentAssetId,
      currentRul,
      rootCauses: assetIds[currentAssetId]?.root_causes || rulThresholds[currentRul]?.root_causes || [],
      pastEvents: allPastEvents,
    };
  }, [data, selectedPath, thresholdCrossings]);

  if (!flowData) {
    return <div className="no-data">No data available</div>;
  }

  const getBarColor = (value, maxValue) => {
    const ratio = value / maxValue;
    if (ratio > 0.7) return 'var(--color-failure-predicted)';
    if (ratio > 0.4) return 'var(--color-under-maintenance)';
    return 'var(--color-working)';
  };

  const getMaxValue = (items) => {
    return Math.max(...Object.values(items), 1);
  };

  return (
    <div className="flow-visualization card">
      <div className="flow-container">
        {/* Count of Asset ID Column */}
        <div className="flow-column">
          <div className="column-header">
            <span className="lock-icon">🔒</span>
            Count of Asset ID
          </div>
          <div className="column-value">{flowData.total}</div>
          <div className="flow-line"></div>
        </div>

        {/* State Column */}
        <div className="flow-column">
          <div className="column-header">
            <span className="lock-icon">🔒</span>
            State
          </div>
          {flowData.currentState && (
            <div className="column-selected">{flowData.currentState}</div>
          )}
          <div className="column-items">
            {Object.entries(flowData.states).map(([state, count]) => (
              <div
                key={state}
                className={`column-item ${flowData.currentState === state ? 'selected' : ''}`}
                onClick={() => onPathChange({ ...selectedPath, state })}
              >
                <div className="item-label">{state}</div>
                <div className="item-bar-container">
                  <div
                    className="item-bar"
                    style={{
                      width: `${(count / getMaxValue(flowData.states)) * 100}%`,
                      backgroundColor: getBarColor(count, getMaxValue(flowData.states)),
                    }}
                  ></div>
                </div>
                <div className="item-value">{count}</div>
              </div>
            ))}
          </div>
          <div className="flow-line"></div>
        </div>

        {/* Plant Column */}
        <div className="flow-column">
          <div className="column-header">
            <span className="lock-icon">🔒</span>
            Plant
          </div>
          {flowData.currentPlant && (
            <div className="column-selected">{flowData.currentPlant}</div>
          )}
          <div className="column-items">
            {Object.entries(flowData.plants).map(([plant, count]) => (
              <div
                key={plant}
                className={`column-item ${flowData.currentPlant === plant ? 'selected' : ''}`}
                onClick={() => onPathChange({ ...selectedPath, plant })}
              >
                <div className="item-label">{plant}</div>
                <div className="item-bar-container">
                  <div
                    className="item-bar"
                    style={{
                      width: `${(count / getMaxValue(flowData.plants)) * 100}%`,
                      backgroundColor: getBarColor(count, getMaxValue(flowData.plants)),
                    }}
                  ></div>
                </div>
                <div className="item-value">{count}</div>
              </div>
            ))}
          </div>
          <div className="flow-line"></div>
        </div>

        {/* Asset ID Column */}
        <div className="flow-column">
          <div className="column-header">
            <span className="lock-icon">🔒</span>
            Asset ID
          </div>
          {flowData.currentAssetId && (
            <div className="column-selected">{flowData.currentAssetId}</div>
          )}
          <div className="column-items">
            {Object.entries(flowData.assetIds).slice(0, 5).map(([assetId, data]) => (
              <div
                key={assetId}
                className={`column-item ${flowData.currentAssetId === assetId ? 'selected' : ''}`}
                onClick={() => onPathChange({ ...selectedPath, asset_id: assetId, rul_threshold: data.rul_threshold })}
              >
                <div className="item-label">{assetId}</div>
                <div className="item-bar-container">
                  <div
                    className="item-bar"
                    style={{
                      width: '100%',
                      backgroundColor: getBarColor(1, 1),
                    }}
                  ></div>
                </div>
                <div className="item-value">1</div>
              </div>
            ))}
          </div>
          <div className="flow-line"></div>
        </div>

        {/* RUL Threshold Column */}
        <div className="flow-column">
          <div className="column-header">
            <span className="lock-icon">🔒</span>
            RUL threshold
          </div>
          {flowData.currentRul && (
            <div className="column-selected">{flowData.currentRul}</div>
          )}
          <div className="column-items">
            {flowData.currentRul && (
              <div className="column-item selected">
                <div className="item-label">{flowData.currentRul}</div>
                <div className="item-bar-container">
                  <div
                    className="item-bar"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-failure-predicted)',
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <div className="flow-line"></div>
        </div>

        {/* Root Cause Probability Column */}
        <div className="flow-column">
          <div className="column-header">
            <span className="lock-icon">🔒</span>
            Root Cause Probability
          </div>
          <div className="column-items">
            {flowData.rootCauses.map((cause, index) => (
              <div key={index} className="column-item">
                <div className="item-label">{cause.cause}</div>
                <div className="item-bar-container">
                  <div
                    className="item-bar"
                    style={{
                      width: `${cause.probability * 100}%`,
                      backgroundColor: 'var(--color-failure-predicted)',
                    }}
                  ></div>
                </div>
                <div className="item-value">{Math.round(cause.probability * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Past Events / Threshold Crossings Section */}
      {flowData.pastEvents && flowData.pastEvents.length > 0 && (
        <div className="past-events-section">
          <div className="section-header">
            <h3>📅 Past Events & Threshold Crossings</h3>
            <span className="events-count">{flowData.pastEvents.length} event(s)</span>
          </div>
          <div className="events-timeline">
            {flowData.pastEvents.map((event, idx) => (
              <div key={idx} className={`event-item ${event.threshold === 'critical' ? 'critical-event' : 'warning-event'}`}>
                <div className="event-marker">
                  <div className={`marker-dot ${event.threshold}`}></div>
                  {idx < flowData.pastEvents.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="event-content">
                  <div className="event-header">
                    <span className="event-date">{event.date || 'Today'}</span>
                    <span className="event-time">{event.time}</span>
                    <span className={`event-badge ${event.threshold}`}>
                      {event.threshold === 'critical' ? '🔴 Critical' : '🟡 Warning'}
                    </span>
                    {event.source === 'historical' && (
                      <span className="source-badge">Historical</span>
                    )}
                  </div>
                  <div className="event-description">{event.description}</div>
                  <div className="event-details">
                    <span className="detail-item">
                      <strong>Type:</strong> {event.type === 'vibration' ? 'Vibration' : 'Temperature'}
                    </span>
                    <span className="detail-item">
                      <strong>Value:</strong> {event.type === 'vibration' 
                        ? `${event.value.toFixed(1)} mm/s²` 
                        : `${event.value.toFixed(1)}°F`}
                    </span>
                    <span className="detail-item">
                      <strong>Previous:</strong> {event.type === 'vibration' 
                        ? `${event.previous.toFixed(1)} mm/s²` 
                        : `${event.previous.toFixed(1)}°F`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowVisualization;

