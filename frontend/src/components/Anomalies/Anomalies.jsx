import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getAnomalies } from '../../data/mockData';
import VibrationChart from './VibrationChart';
import TemperatureChart from './TemperatureChart';
import DatabaseIndicator, { DatabasePreviewTable } from '../Layout/DatabaseIndicator';
import SelectPlaceGate from '../Layout/SelectPlaceGate';
import { DataFeedHint, AnomalySignalsPanel } from '../Agentic/IntegratedDataPanels';
import AnomaliesLoading from './AnomaliesLoading';
import { useAppFlow } from '../../context/AppFlowContext';
import { resolveAnomalyIndicatorFeeds } from '../../utils/agenticSynthesis';
import './Anomalies.css';

const MIN_LOADING_MS = 1200;

const MODEL_LABELS = {
  historian: 'Historian stream',
  vibration: 'Vibration model',
  thermal: 'Thermal model',
};

const Anomalies = ({ selectedMonth, selectedYear, filters, onFiltersChange }) => {
  const { excelBundle } = useAppFlow();
  const [anomalyData, setAnomalyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModel, setActiveModel] = useState(null);
  const mounted = useRef(true);

  const indicatorFeeds = useMemo(
    () => resolveAnomalyIndicatorFeeds(excelBundle || {}, filters, anomalyData),
    [excelBundle, filters, anomalyData]
  );

  const toggleModel = (id) => {
    setActiveModel((m) => (m === id ? null : id));
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!filters.state) {
      setAnomalyData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const start = Date.now();

    const load = () => {
      const data = getAnomalies(filters);
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
      setTimeout(() => {
        if (!mounted.current) return;
        setAnomalyData(data);
        setLoading(false);
      }, remaining);
    };

    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
  }, [filters, selectedMonth, selectedYear]);

  if (!filters.state) {
    return (
      <div className="anomalies-page">
        <h2 className="page-title">Production signals</h2>
        <SelectPlaceGate
          filters={filters}
          onFiltersChange={onFiltersChange}
          title="Select a location for this step"
          hint="Anomalies and telemetry load per site. Pick Beloit or Jonesboro (same as Executive summary), or choose one here."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="anomalies-page">
        <h2 className="page-title">Production signals</h2>
        <AnomaliesLoading />
      </div>
    );
  }

  return (
    <div className="anomalies-page">
      <h2 className="page-title">Production signals</h2>
      <p className="agentic-section-intro">
        Line stops, KPI triggers, and alarm context are correlated below. Telemetry validates what the historian
        already flagged—so recommendations and RCA stay tied to real production beats, not isolated numbers.
      </p>

      <DataFeedHint />
      <AnomalySignalsPanel />

      <div className="database-indicators-row">
        <DatabaseIndicator
          source={MODEL_LABELS.historian}
          status="active"
          dataPreview={{
            records: indicatorFeeds.historian.records,
            lastSync: indicatorFeeds.historian.lastSync,
            data: indicatorFeeds.historian.data,
          }}
          subtitle={indicatorFeeds.historian.subtitle}
          onToggle={() => toggleModel('historian')}
          selected={activeModel === 'historian'}
        />
        <DatabaseIndicator
          source={MODEL_LABELS.vibration}
          status="active"
          dataPreview={{
            records: indicatorFeeds.vibration.records,
            lastSync: indicatorFeeds.vibration.lastSync,
            data: indicatorFeeds.vibration.data,
          }}
          subtitle={indicatorFeeds.vibration.subtitle}
          onToggle={() => toggleModel('vibration')}
          selected={activeModel === 'vibration'}
        />
        <DatabaseIndicator
          source={MODEL_LABELS.thermal}
          status="active"
          dataPreview={{
            records: indicatorFeeds.thermal.records,
            lastSync: indicatorFeeds.thermal.lastSync,
            data: indicatorFeeds.thermal.data,
          }}
          subtitle={indicatorFeeds.thermal.subtitle}
          onToggle={() => toggleModel('thermal')}
          selected={activeModel === 'thermal'}
        />
      </div>

      {activeModel && (
        <div className="anomaly-model-inline-detail" role="region" aria-label={MODEL_LABELS[activeModel]}>
          <div className="anomaly-model-inline-header">
            <h3 className="anomaly-model-inline-title">{MODEL_LABELS[activeModel]}</h3>
            <button type="button" className="anomaly-model-inline-close" onClick={() => setActiveModel(null)}>
              Close
            </button>
          </div>
          <p className="anomaly-model-inline-meta">
            {indicatorFeeds[activeModel].records.toLocaleString()} record(s) · {indicatorFeeds[activeModel].lastSync}
          </p>
          <DatabasePreviewTable
            data={indicatorFeeds[activeModel].data}
            emptyLabel="No rows for this model in the current scope."
          />
        </div>
      )}

      <h3 className="anomalies-telemetry-title">Live telemetry · condition traces</h3>
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
