import React, { useState, useEffect } from 'react';
import { getAssetSummary, getAssetsFiltered } from '../../data/mockData';
import AssetStatusSummary from './AssetStatusSummary';
import MapView from './MapView';
import SummaryPanel from './SummaryPanel';
import DatabaseIndicator from '../Layout/DatabaseIndicator';
import './ExecutiveSummary.css';

const ExecutiveSummary = ({ selectedMonth, selectedYear, filters, onFiltersChange }) => {
  const [summary, setSummary] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filters, selectedMonth, selectedYear]);

  const loadData = () => {
    setLoading(true);
    // Simulate async loading
    setTimeout(() => {
      const summaryData = getAssetSummary();
      const assetsData = getAssetsFiltered(filters);
      setSummary(summaryData);
      setAssets(assetsData);
      setLoading(false);
    }, 300);
  };

  const states = ['California', 'Louisiana', 'New York', 'North Carolina', 'North Dakota'];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="executive-summary">
      <div className="database-indicators-row">
        <DatabaseIndicator source="Asset Database" status="active" />
        <DatabaseIndicator source="Condition Monitoring" status="active" />
        <DatabaseIndicator source="Maintenance Records" status="active" />
      </div>
      <div className="state-filters">
        {states.map((state) => (
          <button
            key={state}
            className={`state-button ${filters.state === state ? 'active' : ''}`}
            onClick={() => {
              if (onFiltersChange) {
                onFiltersChange({
                  ...filters,
                  state: filters.state === state ? null : state
                });
              }
            }}
          >
            {state}
          </button>
        ))}
      </div>

      <div className="summary-layout">
        <div className="left-panel">
          <AssetStatusSummary summary={summary} />
        </div>

        <div className="center-panel">
          <MapView 
            assets={assets} 
            selectedState={filters.state}
            summary={summary}
          />
        </div>

        <div className="right-panel">
          <SummaryPanel 
            assets={assets}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;

