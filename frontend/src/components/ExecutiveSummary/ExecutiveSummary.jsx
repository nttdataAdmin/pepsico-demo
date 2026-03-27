import React, { useState, useEffect, useMemo } from 'react';
import { getAssetSummaryFiltered, getAssetsFiltered } from '../../data/mockData';
import AssetStatusSummary from './AssetStatusSummary';
import MapView from './MapView';
import SummaryPanel from './SummaryPanel';
import DatabaseIndicator from '../Layout/DatabaseIndicator';
import {
  DataFeedHint,
  ExecutiveLandingStreams,
} from '../Agentic/IntegratedDataPanels';
import { useAppFlow } from '../../context/AppFlowContext';
import { summarizeExecutiveFeeds } from '../../utils/agenticSynthesis';
import { SITE_LOCATIONS } from '../../config/siteLocations';
import './ExecutiveSummary.css';

const ExecutiveSummary = ({ selectedMonth, selectedYear, filters, onFiltersChange }) => {
  const { excelBundle } = useAppFlow();
  const feeds = useMemo(() => summarizeExecutiveFeeds(excelBundle || {}), [excelBundle]);

  const [summary, setSummary] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const plantOptions = useMemo(() => {
    if (!filters.state) return [];
    const plants = new Set();
    getAssetsFiltered({ state: filters.state }).forEach((a) => plants.add(a.plant));
    return [...plants].sort();
  }, [filters.state]);

  const placeSelected = !!filters.state;

  useEffect(() => {
    loadData();
  }, [filters, selectedMonth, selectedYear]);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      if (!filters.state) {
        setSummary(null);
        setAssets([]);
        setLoading(false);
        return;
      }
      const assetsData = getAssetsFiltered(filters);
      setSummary(getAssetSummaryFiltered(filters));
      setAssets(assetsData);
      setLoading(false);
    }, 280);
  };

  if (loading && placeSelected) {
    return <div className="loading">Loading site data…</div>;
  }

  return (
    <div className="executive-summary">
      <DataFeedHint />

      <section className="es-place-section card" aria-labelledby="place-heading">
        <h2 id="place-heading" className="es-place-title">
          Location scope
        </h2>
        <p className="es-place-caption">
          Select a <strong>state or region</strong> first. Optional: narrow to one <strong>plant</strong>. All
          sections below (KPI strip, map, feeds, chart) use this scope.
        </p>
        <div className="state-filters es-state-row" role="group" aria-label="Location">
          {SITE_LOCATIONS.map((state) => (
            <button
              key={state}
              type="button"
              className={`state-button ${filters.state === state ? 'active' : ''}`}
              onClick={() => {
                if (onFiltersChange) {
                  onFiltersChange({
                    ...filters,
                    state: filters.state === state ? null : state,
                    plant: null,
                  });
                }
              }}
            >
              {state}
            </button>
          ))}
        </div>
        {filters.state ? (
          <div className="plant-filters" role="group" aria-label="Plant">
            <button
              type="button"
              className={`plant-chip ${!filters.plant ? 'active' : ''}`}
              onClick={() => onFiltersChange && onFiltersChange({ ...filters, plant: null })}
            >
              All plants
            </button>
            {plantOptions.map((plant) => (
              <button
                key={plant}
                type="button"
                className={`plant-chip ${filters.plant === plant ? 'active' : ''}`}
                onClick={() =>
                  onFiltersChange &&
                  onFiltersChange({
                    ...filters,
                    plant: filters.plant === plant ? null : plant,
                  })
                }
              >
                {plant}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      {!placeSelected ? (
        <div className="es-prompt card">
          <p>
            Choose a location above to load the <strong>site KPI strip</strong>, <strong>fleet map</strong>,{' '}
            <strong>integrated feeds</strong>, and <strong>exception chart</strong> for that territory.
          </p>
        </div>
      ) : (
        <>
          <div className="database-indicators-row">
            <DatabaseIndicator
              source="Workforce & labor actuals"
              status="active"
              subtitle={feeds.workforce.subtitle}
              dataPreview={{
                records: feeds.workforce.records,
                lastSync: feeds.workforce.lastSync,
                data: feeds.workforce.data,
              }}
            />
            <DatabaseIndicator
              source="MES / line execution"
              status="active"
              subtitle={feeds.mes.subtitle}
              dataPreview={{
                records: feeds.mes.records,
                lastSync: feeds.mes.lastSync,
                data: feeds.mes.data,
              }}
            />
            <DatabaseIndicator
              source="Loss & yield accounting"
              status="active"
              subtitle={feeds.loss.subtitle}
              dataPreview={{
                records: feeds.loss.records,
                lastSync: feeds.loss.lastSync,
                data: feeds.loss.data,
              }}
            />
          </div>

          <div className="es-kpi-strip">
            <AssetStatusSummary summary={summary} layout="horizontal" />
          </div>

          <section className="es-map-stage" aria-labelledby="es-map-heading">
            <div className="es-map-stage-header">
              <h2 id="es-map-heading" className="es-map-stage-title">
                Fleet map · live asset posture
              </h2>
              <p className="es-map-stage-caption">
                {filters.plant ? `${filters.plant} · ` : ''}
                {filters.state}
              </p>
            </div>
            <div className="es-map-frame">
              <MapView assets={assets} selectedState={filters.state} summary={summary} />
            </div>
          </section>

          <h2 className="es-integrated-section-title">Integrated landing narrative</h2>
          <ExecutiveLandingStreams />

          <div className="card summary-panel-full">
            <SummaryPanel assets={assets} selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </div>
        </>
      )}
    </div>
  );
};

export default ExecutiveSummary;
