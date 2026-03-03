import React, { useState, useEffect } from 'react';
import { getAnomalies } from '../../data/mockData';
import FiltersPanel from './FiltersPanel';
import VibrationChart from './VibrationChart';
import TemperatureChart from './TemperatureChart';
import DatabaseIndicator from '../Layout/DatabaseIndicator';
import './Anomalies.css';

const Anomalies = ({ selectedMonth, selectedYear, filters }) => {
  const [anomalyData, setAnomalyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnomalies();
  }, [filters, selectedMonth, selectedYear]);

  const loadAnomalies = () => {
    setLoading(true);
    setTimeout(() => {
      // If no filters, show all anomalies; otherwise filter
      const hasFilters = filters.state || filters.plant || filters.asset_id;
      const data = hasFilters ? getAnomalies(filters) : getAnomalies({});
      console.log('Loaded anomalies:', data.length, 'with filters:', filters);
      setAnomalyData(data);
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="anomalies-page">
      <h2 className="page-title">ANOMALIES (CONDITION MONITORING)</h2>
      <div className="database-indicators-row">
        <DatabaseIndicator source="Sensor Data Stream" status="active" />
        <DatabaseIndicator source="Vibration Sensors" status="active" />
        <DatabaseIndicator source="Temperature Sensors" status="active" />
      </div>
      <div className="anomalies-layout">
        <div className="charts-container">
          <div className="chart-wrapper">
            <VibrationChart data={anomalyData} />
          </div>
          <div className="chart-wrapper">
            <TemperatureChart data={anomalyData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anomalies;

