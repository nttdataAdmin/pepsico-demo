import React, { useMemo } from 'react';
import { getAnomalies, getAssetsFiltered, buildSummaryFromAssets } from '../../data/mockData';
import './ExecutiveKeyMetrics.css';

function mean(nums) {
  const v = nums.filter((n) => Number.isFinite(n));
  if (!v.length) return null;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

/** Deterministic 0–1 scalar from scope strings (no RNG — stable per selection). */
function scopeUnit(...parts) {
  let h = 2166136261 >>> 0;
  const s = parts.filter(Boolean).join('|');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h % 10007) / 10007;
}

/**
 * Average each asset's series first, then average across assets — differs from pooling all timestamps,
 * so Beloit vs Jonesboro and plant filters separate more naturally.
 */
function perAssetFieldMean(rows, field) {
  const byAsset = new Map();
  for (const r of rows) {
    const id = r.asset_id || '_';
    if (!byAsset.has(id)) byAsset.set(id, []);
    const v = Number(r[field]);
    if (Number.isFinite(v)) byAsset.get(id).push(v);
  }
  const perAssetAvgs = [...byAsset.values()].map((arr) => mean(arr)).filter((x) => x != null);
  return mean(perAssetAvgs);
}

function wastagePercent(summary, qcGo, scopeKey, month, year) {
  const total = Math.max(summary.total, 1);
  if (qcGo) {
    const u = scopeUnit(scopeKey, 'go', month, year, String(summary.total));
    return 0.45 + u * 0.95;
  }
  const fp = summary.failure_predicted;
  const um = summary.under_maintenance;
  const bd = summary.breakdown;
  const stress = (fp * 1.15 + um * 0.85 + bd * 2.05) / total;
  const u = scopeUnit(scopeKey, 'nogo', month, String(fp), String(bd));
  return Math.round((0.85 + stress * 9.2 + u * 1.25) * 10) / 10;
}

function productivityPercent(summary, qcGo, scopeKey, month, year, wastagePct) {
  const total = Math.max(summary.total, 1);
  const wShare = summary.working / total;
  if (qcGo) {
    const u = scopeUnit(scopeKey, 'prod', month, year, 'qc');
    return Math.round((94.6 + u * 4.6 + wShare * 1.8) * 10) / 10;
  }
  const bdShare = summary.breakdown / total;
  const raw = 99.2 - wastagePct * 2.05 - bdShare * 11.5 + wShare * 4.5;
  return Math.round(Math.max(71, Math.min(98.8, raw)) * 10) / 10;
}

/**
 * Key metrics: wastage / productivity from fleet counts + scope (state, plant, lens, period).
 * Temperature / vibration from per-asset CM averages for the filtered anomaly slice.
 */
export default function ExecutiveKeyMetrics({ filters, operatorRole, qcGo, selectedMonth, selectedYear }) {
  const scopeKey = [filters.state, filters.plant, filters.asset_id, operatorRole].filter(Boolean).join('·') || 'fleet';

  const assets = useMemo(
    () => getAssetsFiltered(filters, { operatorRole }),
    [filters.state, filters.plant, filters.asset_id, operatorRole]
  );

  const summary = useMemo(() => buildSummaryFromAssets(assets), [assets]);

  const rows = useMemo(
    () => getAnomalies({ state: filters.state, plant: filters.plant }, { operatorRole }),
    [filters.state, filters.plant, operatorRole]
  );

  const avgTemp = useMemo(() => perAssetFieldMean(rows, 'temperature'), [rows]);
  const avgVib = useMemo(() => perAssetFieldMean(rows, 'vibration'), [rows]);

  const wastagePct = useMemo(
    () => wastagePercent(summary, qcGo, scopeKey, selectedMonth, selectedYear),
    [summary, qcGo, scopeKey, selectedMonth, selectedYear]
  );

  const productivityPct = useMemo(
    () => productivityPercent(summary, qcGo, scopeKey, selectedMonth, selectedYear, wastagePct),
    [summary, qcGo, scopeKey, selectedMonth, selectedYear, wastagePct]
  );

  const assetCountInTelemetry = useMemo(() => {
    const ids = new Set(rows.map((r) => r.asset_id).filter(Boolean));
    return ids.size;
  }, [rows]);

  const workingPct = ((summary.working / Math.max(summary.total, 1)) * 100).toFixed(0);
  const items = [
    {
      id: 'wastage',
      label: 'Wastage (yield loss)',
      value: `${wastagePct.toFixed(1)}%`,
      sub:
        filters.state == null
          ? 'Select a site to anchor yield loss vs fleet posture'
          : qcGo
            ? `Nominal band · ${summary.total} assets in scope`
            : `From ${summary.breakdown} down / ${summary.failure_predicted} predicted / ${summary.under_maintenance} in PM`,
    },
    {
      id: 'productivity',
      label: 'Productivity index',
      value: `${productivityPct.toFixed(1)}%`,
      sub:
        filters.state == null
          ? 'Throughput index updates after you pick a territory'
          : qcGo
            ? `Line rate vs plan · working share ${workingPct}%`
            : `Throughput vs schedule · ${selectedMonth} ${selectedYear}`,
    },
    {
      id: 'temp',
      label: 'Avg. temperature (telemetry)',
      value: avgTemp != null ? `${avgTemp.toFixed(1)} °C` : '—',
      sub:
        rows.length && assetCountInTelemetry
          ? `Mean of per-asset means · ${assetCountInTelemetry} asset${assetCountInTelemetry === 1 ? '' : 's'} · ${rows.length} points`
          : 'Select a site to load historian mix',
    },
    {
      id: 'vib',
      label: 'Avg. vibration (RMS)',
      value: avgVib != null ? `${avgVib.toFixed(1)} mm/s` : '—',
      sub:
        rows.length && assetCountInTelemetry
          ? `Aligned with production signals · ${filters.plant || filters.state || 'all'}`
          : 'No vibration series in scope',
    },
  ];

  return (
    <section className="es-key-metrics card" aria-label="Key production metrics">
      <h3 className="es-key-metrics-title">Key metrics</h3>
      <p className="es-key-metrics-lead">
        Wastage and productivity follow fleet counts for the selected state, plant, operator lens, and period. Temperature
        and vibration use per-asset averages (then rolled up) so values change when you move between sites or lines.
      </p>
      <div className="es-key-metrics-grid">
        {items.map((it) => (
          <div key={it.id} className="es-key-metric-tile">
            <span className="es-key-metric-label">{it.label}</span>
            <span className="es-key-metric-value">{it.value}</span>
            <span className="es-key-metric-sub">{it.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
