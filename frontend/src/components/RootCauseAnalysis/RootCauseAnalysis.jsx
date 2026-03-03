import React, { useState, useEffect, useMemo } from 'react';
import { getRootCauseAnalysis, getAnomalies } from '../../data/mockData';
import FlowVisualization from './FlowVisualization';
import './RootCauseAnalysis.css';

const RootCauseAnalysis = ({ selectedMonth, selectedYear, filters }) => {
  const [rootCauseData, setRootCauseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState({
    state: null,
    plant: null,
    asset_id: null,
    rul_threshold: null,
  });

  useEffect(() => {
    loadRootCauseData();
  }, [filters, selectedPath]);

  const loadRootCauseData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = getRootCauseAnalysis({
        ...filters,
        rul_threshold: selectedPath.rul_threshold,
      });
      setRootCauseData(data);
      setLoading(false);
    }, 300);
  };

  // Get threshold crossings from anomaly data
  const thresholdCrossings = useMemo(() => {
    const anomalyData = getAnomalies(filters);
    const crossings = [];
    
    // Group by asset
    const assetGroups = {};
    anomalyData.forEach(item => {
      if (!assetGroups[item.asset_id]) {
        assetGroups[item.asset_id] = [];
      }
      assetGroups[item.asset_id].push(item);
    });

    // Find threshold crossings for each asset
    Object.entries(assetGroups).forEach(([asset_id, readings]) => {
      const sorted = readings.sort((a, b) => {
        const timeA = a.time.split(':');
        const timeB = b.time.split(':');
        return parseInt(timeA[0]) * 60 + parseInt(timeA[1]) - (parseInt(timeB[0]) * 60 + parseInt(timeB[1]));
      });

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        
        // Vibration threshold crossings
        if (prev.vibration <= 100 && curr.vibration > 100) {
          crossings.push({
            asset_id,
            plant: curr.plant,
            time: curr.time,
            type: 'vibration',
            threshold: 'warning',
            value: curr.vibration,
            previous: prev.vibration
          });
        }
        if (prev.vibration <= 120 && curr.vibration > 120) {
          crossings.push({
            asset_id,
            plant: curr.plant,
            time: curr.time,
            type: 'vibration',
            threshold: 'critical',
            value: curr.vibration,
            previous: prev.vibration
          });
        }
        
        // Temperature threshold crossings
        if (prev.temperature <= 170 && curr.temperature > 170) {
          crossings.push({
            asset_id,
            plant: curr.plant,
            time: curr.time,
            type: 'temperature',
            threshold: 'warning',
            value: curr.temperature,
            previous: prev.temperature
          });
        }
        if (prev.temperature <= 180 && curr.temperature > 180) {
          crossings.push({
            asset_id,
            plant: curr.plant,
            time: curr.time,
            type: 'temperature',
            threshold: 'critical',
            value: curr.temperature,
            previous: prev.temperature
          });
        }
      }
    });

    return crossings.sort((a, b) => {
      if (a.threshold !== b.threshold) {
        return a.threshold === 'critical' ? -1 : 1;
      }
      return a.time.localeCompare(b.time);
    });
  }, [filters]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="root-cause-page">
      <h2 className="page-title">ROOT CAUSE ANALYSIS</h2>
      
      {/* Threshold Crossings Section */}
      {thresholdCrossings.length > 0 && (
        <div className="threshold-crossings-section card">
          <div className="section-header">
            <h3>⚠️ Threshold Crossings Analysis</h3>
            <span className="crossings-count">{thresholdCrossings.length} crossing(s) detected</span>
          </div>
          <div className="crossings-table">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Asset ID</th>
                  <th>Plant</th>
                  <th>Type</th>
                  <th>Threshold</th>
                  <th>Value</th>
                  <th>Previous</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {thresholdCrossings.map((crossing, idx) => (
                  <tr key={idx} className={crossing.threshold === 'critical' ? 'critical-row' : 'warning-row'}>
                    <td>{crossing.time}</td>
                    <td>{crossing.asset_id}</td>
                    <td>{crossing.plant}</td>
                    <td>
                      <span className={`type-badge ${crossing.type}`}>
                        {crossing.type === 'vibration' ? 'Vibration' : 'Temperature'}
                      </span>
                    </td>
                    <td>
                      <span className={`threshold-badge ${crossing.threshold}`}>
                        {crossing.threshold === 'critical' ? '🔴 Critical' : '🟡 Warning'}
                      </span>
                    </td>
                    <td className="value-cell">
                      {crossing.type === 'vibration' 
                        ? `${crossing.value.toFixed(1)} mm/s²`
                        : `${crossing.value.toFixed(1)}°F`
                      }
                    </td>
                    <td className="previous-cell">
                      {crossing.type === 'vibration' 
                        ? `${crossing.previous.toFixed(1)} mm/s²`
                        : `${crossing.previous.toFixed(1)}°F`
                      }
                    </td>
                    <td>
                      <span className="action-badge">
                        {crossing.threshold === 'critical' ? 'Immediate' : 'Monitor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FlowVisualization 
        data={rootCauseData} 
        selectedPath={selectedPath}
        onPathChange={setSelectedPath}
        thresholdCrossings={thresholdCrossings}
      />
    </div>
  );
};

export default RootCauseAnalysis;

