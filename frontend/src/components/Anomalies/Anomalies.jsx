import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getAnomalies as getMockAnomalies } from '../../data/mockData';
import { getAnomalies as fetchAnomaliesApi, getAnomalyAgentBriefing } from '../../services/api';
import { normalizeAnomalyRows } from '../../utils/anomalyTelemetry';
import VibrationChart from './VibrationChart';
import TemperatureChart from './TemperatureChart';
import DatabaseIndicator, { DatabasePreviewTable } from '../Layout/DatabaseIndicator';
import SelectPlaceGate from '../Layout/SelectPlaceGate';
import { DataFeedHint, AnomalySignalsPanel } from '../Agentic/IntegratedDataPanels';
import AnomaliesLoading from './AnomaliesLoading';
import AnomalyAgentPanel from './AnomalyAgentPanel';
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
  const [briefing, setBriefing] = useState(null);
  const [dataSource, setDataSource] = useState('api');
  const [refreshing, setRefreshing] = useState(false);
  const [activeModel, setActiveModel] = useState(null);
  const mounted = useRef(true);
  const debounceRef = useRef(null);
  const minLoadRef = useRef(null);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

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

  const loadTelemetryAndBriefing = useCallback(async (opts = { minSplash: true }) => {
    const f = filtersRef.current;
    const scopeKey = JSON.stringify(f);
    const start = Date.now();
    try {
      const [raw, br] = await Promise.all([fetchAnomaliesApi(f), getAnomalyAgentBriefing(f)]);
      if (!mounted.current || JSON.stringify(filtersRef.current) !== scopeKey) return;
      setAnomalyData(normalizeAnomalyRows(raw));
      setBriefing(br);
      setDataSource('api');
    } catch (e) {
      if (!mounted.current || JSON.stringify(filtersRef.current) !== scopeKey) return;
      console.warn('Anomalies: API unavailable, using embedded demo telemetry.', e?.message || e);
      setAnomalyData(normalizeAnomalyRows(getMockAnomalies(f)));
      setBriefing(null);
      setDataSource('mock');
    } finally {
      if (!mounted.current) return;
      if (opts.minSplash) {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        if (minLoadRef.current) clearTimeout(minLoadRef.current);
        minLoadRef.current = setTimeout(() => {
          if (mounted.current) setLoading(false);
        }, remaining);
      }
    }
  }, []);

  useEffect(() => {
    if (!filters.state) {
      setAnomalyData([]);
      setBriefing(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (cancelled || !mounted.current) return;
      loadTelemetryAndBriefing({ minSplash: true });
    }, 350);

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (minLoadRef.current) clearTimeout(minLoadRef.current);
    };
  }, [filters, selectedMonth, selectedYear, loadTelemetryAndBriefing]);

  const handleAgentRefresh = useCallback(async () => {
    if (!filters.state) return;
    setRefreshing(true);
    try {
      await loadTelemetryAndBriefing({ minSplash: false });
    } finally {
      if (mounted.current) setRefreshing(false);
    }
  }, [filters.state, loadTelemetryAndBriefing]);

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
    <div className={`anomalies-page ${dataSource === 'api' ? 'anomalies-page--live-api' : ''}`}>
      <h2 className="page-title">Production signals</h2>
      <p className="agentic-section-intro">
        Historian vibration and temperature streams are ingested through the API when available; the assessment
        agent fuses the same scope into a live narrative and prioritized signals. Line stops from Excel bundles
        still augment context below.
      </p>

      <AnomalyAgentPanel
        briefing={briefing}
        dataSource={dataSource}
        onRefresh={handleAgentRefresh}
        refreshing={refreshing}
      />

      <DataFeedHint />
      <AnomalySignalsPanel
        fusionMeta={
          briefing
            ? { correlationId: briefing.correlation_id, generatedAt: briefing.generated_at }
            : null
        }
        scopeFilters={filters}
      />

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
