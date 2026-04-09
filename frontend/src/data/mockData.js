// Mock data aligned with backend/data — sites: Beloit, Jonesboro only

export const mockAssets = [
  {
    asset_id: 'BEL-PUMP-001',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_type: 'Motor Pump',
    status: 'Failure Predicted',
    criticality: 'High',
    location: { lat: 42.5083, lon: -88.5351 },
    rul: 700,
  },
  {
    asset_id: 'BEL-COMP-002',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_type: 'Motor Compressor',
    status: 'Working',
    criticality: 'Medium',
    location: { lat: 42.5083, lon: -88.5351 },
    rul: 1200,
  },
  {
    asset_id: 'BEL-GEN-003',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_type: 'Generator',
    status: 'Under Maintenance',
    criticality: 'High',
    location: { lat: 42.5083, lon: -88.5351 },
    rul: 600,
  },
  {
    asset_id: 'BEL-FAN-004',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_type: 'Motor Fan',
    status: 'Working',
    criticality: 'Low',
    location: { lat: 42.5083, lon: -88.5351 },
    rul: 1500,
  },
  {
    asset_id: 'JON-GEN-001',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_type: 'Generator',
    status: 'Breakdown',
    criticality: 'High',
    location: { lat: 35.8423, lon: -90.7043 },
    rul: 0,
  },
  {
    asset_id: 'JON-PUMP-002',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_type: 'Motor Pump',
    status: 'Breakdown',
    criticality: 'High',
    location: { lat: 35.8423, lon: -90.7043 },
    rul: 0,
  },
  {
    asset_id: 'JON-COMP-003',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_type: 'Motor Compressor',
    status: 'Failure Predicted',
    criticality: 'Medium',
    location: { lat: 35.8423, lon: -90.7043 },
    rul: 650,
  },
  {
    asset_id: 'JON-FAN-004',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_type: 'Motor Fan',
    status: 'Working',
    criticality: 'Low',
    location: { lat: 35.8423, lon: -90.7043 },
    rul: 1400,
  },
];

function resolveOperatorRole(opts = {}) {
  return opts.operatorRole === 'processing' ? 'processing' : 'packaging';
}

/** Processing-line demo: fryer circulation + thermal oil gen; seasoning train (packaging keeps mockAssets). */
export const mockAssetsProcessing = [
  {
    asset_id: 'BEL-PUMP-001',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_type: 'Motor Pump',
    status: 'Breakdown',
    criticality: 'High',
    location: { lat: 42.5083, lon: -88.5351 },
    rul: 0,
  },
  {
    asset_id: 'BEL-COMP-002',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_type: 'Motor Compressor',
    status: 'Working',
    criticality: 'Medium',
    location: { lat: 42.5083, lon: -88.5351 },
    rul: 1200,
  },
  {
    asset_id: 'BEL-GEN-003',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_type: 'Generator',
    status: 'Failure Predicted',
    criticality: 'High',
    location: { lat: 42.5083, lon: -88.5351 },
    rul: 320,
  },
  {
    asset_id: 'BEL-FAN-004',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_type: 'Motor Fan',
    status: 'Working',
    criticality: 'Low',
    location: { lat: 42.5083, lon: -88.5351 },
    rul: 1500,
  },
  {
    asset_id: 'JON-GEN-001',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_type: 'Generator',
    status: 'Working',
    criticality: 'High',
    location: { lat: 35.8423, lon: -90.7043 },
    rul: 1100,
  },
  {
    asset_id: 'JON-PUMP-002',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_type: 'Motor Pump',
    status: 'Failure Predicted',
    criticality: 'High',
    location: { lat: 35.8423, lon: -90.7043 },
    rul: 180,
  },
  {
    asset_id: 'JON-COMP-003',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_type: 'Motor Compressor',
    status: 'Breakdown',
    criticality: 'Medium',
    location: { lat: 35.8423, lon: -90.7043 },
    rul: 0,
  },
  {
    asset_id: 'JON-FAN-004',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_type: 'Motor Fan',
    status: 'Working',
    criticality: 'Low',
    location: { lat: 35.8423, lon: -90.7043 },
    rul: 1400,
  },
];

export const buildSummaryFromAssets = (assets) => {
  const summary = {
    total: assets.length,
    working: 0,
    failure_predicted: 0,
    under_maintenance: 0,
    breakdown: 0,
  };
  assets.forEach((asset) => {
    const status = asset.status.toLowerCase();
    if (status === 'working') summary.working++;
    else if (status === 'failure predicted') summary.failure_predicted++;
    else if (status === 'under maintenance') summary.under_maintenance++;
    else if (status === 'breakdown') summary.breakdown++;
  });
  return summary;
};

export const getAssetSummary = () => buildSummaryFromAssets(mockAssets);
export const getAssetSummaryFiltered = (filters = {}, opts = {}) =>
  buildSummaryFromAssets(getAssetsFiltered(filters, opts));

export const getAssetsFiltered = (filters = {}, opts = {}) => {
  const pool = resolveOperatorRole(opts) === 'processing' ? mockAssetsProcessing : mockAssets;
  let filtered = [...pool];
  if (filters.state) filtered = filtered.filter((a) => a.state === filters.state);
  if (filters.plant) filtered = filtered.filter((a) => a.plant === filters.plant);
  if (filters.asset_id) filtered = filtered.filter((a) => a.asset_id === filters.asset_id);
  return filtered;
};

const t = (h) => ({ time: h });

export const mockAnomalies = [
  ...['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((h, i) => ({
    ...t(h),
    vibration: [45.2, 48.7, 52.1, 55.8, 58.3, 61.2, 59.8, 57.1][i],
    temperature: [142.5, 145.3, 148.1, 150.2, 152.7, 155.1, 153.4, 151.2][i],
    asset_id: 'BEL-PUMP-001',
    state: 'Beloit',
    plant: 'P01 - Beloit',
  })),
  ...['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((h, i) => ({
    ...t(h),
    vibration: [32.5, 34.1, 35.8, 36.2, 37.5, 38.1, 36.8, 35.2][i],
    temperature: [138.2, 139.5, 140.8, 141.2, 142.5, 143.1, 141.8, 140.2][i],
    asset_id: 'BEL-COMP-002',
    state: 'Beloit',
    plant: 'P01 - Beloit',
  })),
  ...['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((h, i) => ({
    ...t(h),
    vibration: [85.3, 92.1, 98.7, 105.2, 112.5, 118.3, 115.7, 108.9][i],
    temperature: [165.2, 168.5, 172.1, 175.8, 178.9, 181.2, 179.5, 176.3][i],
    asset_id: 'JON-GEN-001',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
  })),
  ...['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((h, i) => ({
    ...t(h),
    vibration: [62.3, 65.7, 68.9, 72.1, 75.5, 78.2, 76.8, 71.3][i],
    temperature: [148.5, 151.2, 153.8, 156.2, 158.7, 161.1, 159.5, 157.2][i],
    asset_id: 'JON-COMP-003',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
  })),
];

/** Higher thermal + BEL-GEN cook-zone load vs packaging historian mix. */
export const mockAnomaliesProcessing = [
  ...['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((h, i) => ({
    ...t(h),
    vibration: [58.2, 62.4, 66.8, 70.1, 74.5, 78.9, 76.2, 72.0][i],
    temperature: [168.2, 171.5, 175.1, 178.8, 182.4, 186.1, 184.0, 179.6][i],
    asset_id: 'BEL-PUMP-001',
    state: 'Beloit',
    plant: 'P01 - Beloit',
  })),
  ...['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((h, i) => ({
    ...t(h),
    vibration: [38.5, 40.2, 41.8, 43.1, 44.5, 45.2, 43.6, 42.1][i],
    temperature: [148.2, 150.1, 151.5, 152.8, 154.2, 155.0, 153.4, 151.9][i],
    asset_id: 'BEL-COMP-002',
    state: 'Beloit',
    plant: 'P01 - Beloit',
  })),
  ...['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((h, i) => ({
    ...t(h),
    vibration: [72.3, 78.5, 84.2, 91.1, 96.8, 102.3, 99.5, 92.4][i],
    temperature: [158.2, 160.8, 163.5, 166.1, 169.2, 172.5, 170.8, 167.2][i],
    asset_id: 'BEL-GEN-003',
    state: 'Beloit',
    plant: 'P01 - Beloit',
  })),
  ...['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((h, i) => ({
    ...t(h),
    vibration: [68.3, 71.7, 75.2, 79.6, 83.1, 86.5, 84.2, 79.8][i],
    temperature: [155.5, 158.2, 161.0, 163.8, 166.4, 169.1, 167.5, 164.9][i],
    asset_id: 'JON-COMP-003',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
  })),
];

/** When live API returns packaging-shaped telemetry, nudge series for processing lens (demo only). */
export function applyRoleTransformToAnomalies(rows, operatorRole) {
  if (operatorRole !== 'processing' || !Array.isArray(rows)) return rows;
  return rows.map((r) => ({
    ...r,
    temperature:
      r.temperature != null && r.temperature !== ''
        ? Math.round((Number(r.temperature) * 1.07 + 5) * 10) / 10
        : r.temperature,
    vibration:
      r.vibration != null && r.vibration !== ''
        ? Math.round((Number(r.vibration) * 1.06 + 6) * 10) / 10
        : r.vibration,
  }));
}

export const getAnomalies = (filters = {}, opts = {}) => {
  const source = resolveOperatorRole(opts) === 'processing' ? mockAnomaliesProcessing : mockAnomalies;
  let filtered = [...source];
  if (filters.asset_id) filtered = filtered.filter((a) => a.asset_id === filters.asset_id);
  if (filters.state) filtered = filtered.filter((a) => a.state === filters.state);
  if (filters.plant) filtered = filtered.filter((a) => a.plant === filters.plant);
  return filtered;
};

export const mockRootCauses = {
  total_assets: 8,
  flow: {
    state: { Beloit: 4, Jonesboro: 4 },
    plant: { 'P01 - Beloit': 4, 'P01 - Jonesboro': 4 },
    asset_id: {
      'BEL-PUMP-001': {
        rul_threshold: 700,
        root_causes: [
          { cause: 'Bearing Misalign', probability: 0.75 },
          { cause: 'Bolt Loosened', probability: 0.18 },
          { cause: 'Structural Crack', probability: 0.07 },
        ],
      },
      'BEL-COMP-002': {
        rul_threshold: 1200,
        root_causes: [
          { cause: 'Normal Wear', probability: 0.82 },
          { cause: 'Bearing Misalign', probability: 0.12 },
          { cause: 'Lubrication Issue', probability: 0.06 },
        ],
      },
      'BEL-GEN-003': {
        rul_threshold: 600,
        root_causes: [
          { cause: 'Bearing Misalign', probability: 0.65 },
          { cause: 'Structural Crack', probability: 0.25 },
          { cause: 'Bolt Loosened', probability: 0.1 },
        ],
      },
      'BEL-FAN-004': {
        rul_threshold: 1500,
        root_causes: [
          { cause: 'Normal Wear', probability: 0.85 },
          { cause: 'Bearing Misalign', probability: 0.1 },
          { cause: 'Lubrication Issue', probability: 0.05 },
        ],
      },
      'JON-GEN-001': {
        rul_threshold: 0,
        root_causes: [
          { cause: 'Bearing Failure', probability: 0.85 },
          { cause: 'Structural Crack', probability: 0.1 },
          { cause: 'Bolt Loosened', probability: 0.05 },
        ],
        past_events: [
          {
            date: '2023-02-20',
            time: '12:00',
            type: 'vibration',
            threshold: 'critical',
            value: 118.3,
            previous: 112.5,
            description: 'Vibration crossed critical threshold — shutdown',
          },
        ],
      },
      'JON-PUMP-002': {
        rul_threshold: 0,
        root_causes: [
          { cause: 'Bearing Failure', probability: 0.8 },
          { cause: 'Structural Crack', probability: 0.15 },
          { cause: 'Bolt Loosened', probability: 0.05 },
        ],
      },
      'JON-COMP-003': {
        rul_threshold: 650,
        root_causes: [
          { cause: 'Bearing Misalign', probability: 0.7 },
          { cause: 'Bolt Loosened', probability: 0.2 },
          { cause: 'Lubrication Issue', probability: 0.1 },
        ],
      },
      'JON-FAN-004': {
        rul_threshold: 1400,
        root_causes: [
          { cause: 'Normal Wear', probability: 0.8 },
          { cause: 'Bearing Misalign', probability: 0.15 },
          { cause: 'Lubrication Issue', probability: 0.05 },
        ],
      },
    },
    rul_threshold: {
      '700': {
        asset_id: 'BEL-PUMP-001',
        root_causes: [
          { cause: 'Bearing Misalign', probability: 0.75 },
          { cause: 'Bolt Loosened', probability: 0.18 },
          { cause: 'Structural Crack', probability: 0.07 },
        ],
      },
      '650': {
        asset_id: 'JON-COMP-003',
        root_causes: [
          { cause: 'Bearing Misalign', probability: 0.7 },
          { cause: 'Bolt Loosened', probability: 0.2 },
          { cause: 'Lubrication Issue', probability: 0.1 },
        ],
      },
    },
  },
};

const mockRootCausesProcessing = (() => {
  const P = JSON.parse(JSON.stringify(mockRootCauses));
  const aid = P.flow.asset_id;
  aid['BEL-PUMP-001'].root_causes = [
    { cause: 'Cook-zone oil film breakdown', probability: 0.58 },
    { cause: 'Thermal excursion — fryer return', probability: 0.28 },
    { cause: 'Circulation cavitation', probability: 0.14 },
  ];
  aid['BEL-GEN-003'].root_causes = [
    { cause: 'Heat-transfer fouling (thermal oil)', probability: 0.52 },
    { cause: 'Burner drift / combustion imbalance', probability: 0.31 },
    { cause: 'Bearing wear (auxiliary load)', probability: 0.17 },
  ];
  aid['BEL-COMP-002'].root_causes = [
    { cause: 'Refrigeration side normal cycling', probability: 0.72 },
    { cause: 'Condenser fan imbalance', probability: 0.18 },
    { cause: 'Seal weep (non-critical)', probability: 0.1 },
  ];
  aid['JON-GEN-001'].root_causes = [
    { cause: 'Standby gen light load (healthy)', probability: 0.88 },
    { cause: 'Battery exercise anomaly', probability: 0.08 },
    { cause: 'ATS transfer test artifact', probability: 0.04 },
  ];
  aid['JON-GEN-001'].past_events = [];
  aid['JON-PUMP-002'].root_causes = [
    { cause: 'Seasoning slurry auger load surge', probability: 0.49 },
    { cause: 'Shaft misalignment (belt drive)', probability: 0.33 },
    { cause: 'Seal dry-run event', probability: 0.18 },
  ];
  aid['JON-COMP-003'].root_causes = [
    { cause: 'Discharge pressure thermal trip', probability: 0.55 },
    { cause: 'Seasoning line demand swing', probability: 0.28 },
    { cause: 'Oil viscosity low temp', probability: 0.17 },
  ];
  P.flow.rul_threshold['700'].root_causes = [...aid['BEL-PUMP-001'].root_causes];
  P.flow.rul_threshold['650'].root_causes = [...aid['JON-COMP-003'].root_causes];
  return P;
})();

function filterRootCauseFlow(filters = {}, opts = {}) {
  const base = resolveOperatorRole(opts) === 'processing' ? mockRootCausesProcessing : mockRootCauses;
  if (!filters.state) return base;
  const assetsInScope = getAssetsFiltered(
    {
      state: filters.state,
      plant: filters.plant || undefined,
    },
    opts
  );
  if (!assetsInScope.length) return base;
  const allowed = new Set(assetsInScope.map((a) => a.asset_id));
  const flow = base.flow;
  const filteredAssetId = {};
  Object.entries(flow.asset_id).forEach(([id, meta]) => {
    if (allowed.has(id)) filteredAssetId[id] = meta;
  });
  if (!Object.keys(filteredAssetId).length) return base;
  const plantCounts = {};
  assetsInScope.forEach((a) => {
    plantCounts[a.plant] = (plantCounts[a.plant] || 0) + 1;
  });
  return {
    total_assets: assetsInScope.length,
    flow: {
      state: { [filters.state]: flow.state[filters.state] ?? assetsInScope.length },
      plant: plantCounts,
      asset_id: filteredAssetId,
      rul_threshold: flow.rul_threshold,
    },
  };
}

export const getRootCauseAnalysis = (filters = {}, opts = {}) => filterRootCauseFlow(filters, opts);

/** Same asset row → different guidance for processing vs packaging operator lens (demo dual engine). */
function recommendationForOperatorLens(row, role) {
  const base = row.recommendation;
  const isPack = role === 'packaging';
  const byBase = {
    'Immediate Maintenance Required': isPack
      ? 'Packaging stop: verify palletizer / case-sealer head alignment, slip-sheet feed, and WMS hold on last SKU tier before restart.'
      : 'Processing stop: validate fryer thermal profile, slicer RPM, and oil turnover vs golden batch; hold release until cook curve is in band.',
    'Investigation Required': isPack
      ? 'Packaging: schedule case-weight + bar-code verifier correlation; check conveyor accumulation upstream of palletizer.'
      : 'Processing: run seasoning belt-speed vs moisture study; confirm upstream thermal setpoints and drain cycles.',
    'No Action Required': isPack
      ? 'Packaging lane healthy: maintain pallet pattern library, stretch-wrap tension checks, and WMS queue discipline.'
      : 'Processing lane stable: continue historian watch on critical thermal/vibration tags per SOP.',
  };
  if (base && byBase[base]) return byBase[base];
  if (base === null || base === undefined) {
    return isPack
      ? 'Packaging: align case-pack rework with WMS; confirm pallet pattern before resuming customer shipments.'
      : 'Processing: slot PM on fryer/slicer train; clear MES hold when cook profile validated.';
  }
  return `${base} (${isPack ? 'packaging systems' : 'processing line'} lens — tie to site runbook).`;
}

export const mockRecommendations = [
  {
    year: 2023,
    month: 'February',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-COMP-003',
    asset_type: 'Motor Compressor',
    status: 'Failure Predicted',
    criticality: 'Low',
    recommendation: 'Investigation Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-GEN-001',
    asset_type: 'Generator',
    status: 'Breakdown',
    criticality: 'High',
    recommendation: 'Immediate Maintenance Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-PUMP-002',
    asset_type: 'Motor Pump',
    status: 'Breakdown',
    criticality: 'High',
    recommendation: 'Immediate Maintenance Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-PUMP-001',
    asset_type: 'Motor Pump',
    status: 'Failure Predicted',
    criticality: 'High',
    recommendation: 'Immediate Maintenance Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-COMP-002',
    asset_type: 'Motor Compressor',
    status: 'Working',
    criticality: 'Medium',
    recommendation: 'No Action Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-GEN-003',
    asset_type: 'Generator',
    status: 'Under Maintenance',
    criticality: 'High',
    recommendation: null,
  },
  {
    year: 2023,
    month: 'February',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-FAN-004',
    asset_type: 'Motor Fan',
    status: 'Working',
    criticality: 'Low',
    recommendation: 'No Action Required',
  },
];

export const mockRecommendationsProcessing = [
  {
    year: 2023,
    month: 'February',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-PUMP-001',
    asset_type: 'Motor Pump',
    status: 'Breakdown',
    criticality: 'High',
    recommendation: 'Immediate Maintenance Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-GEN-003',
    asset_type: 'Generator',
    status: 'Failure Predicted',
    criticality: 'High',
    recommendation: 'Immediate Maintenance Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-COMP-003',
    asset_type: 'Motor Compressor',
    status: 'Breakdown',
    criticality: 'Medium',
    recommendation: 'Immediate Maintenance Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-PUMP-002',
    asset_type: 'Motor Pump',
    status: 'Failure Predicted',
    criticality: 'High',
    recommendation: 'Investigation Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-GEN-001',
    asset_type: 'Generator',
    status: 'Working',
    criticality: 'High',
    recommendation: 'No Action Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-COMP-002',
    asset_type: 'Motor Compressor',
    status: 'Working',
    criticality: 'Medium',
    recommendation: 'No Action Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-FAN-004',
    asset_type: 'Motor Fan',
    status: 'Working',
    criticality: 'Low',
    recommendation: 'No Action Required',
  },
  {
    year: 2023,
    month: 'February',
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-FAN-004',
    asset_type: 'Motor Fan',
    status: 'Working',
    criticality: 'Low',
    recommendation: 'No Action Required',
  },
];

export const getRecommendations = (filters = {}, opts = {}) => {
  const role = resolveOperatorRole(opts);
  const source = role === 'processing' ? mockRecommendationsProcessing : mockRecommendations;
  let filtered = [...source];
  const hasFilters = filters.state || filters.plant || filters.asset_id || filters.year || filters.month;
  if (filters.state) filtered = filtered.filter((r) => r.state === filters.state);
  if (filters.plant) filtered = filtered.filter((r) => r.plant === filters.plant);
  if (filters.asset_id) filtered = filtered.filter((r) => r.asset_id === filters.asset_id);
  if (filters.year) filtered = filtered.filter((r) => r.year === filters.year);
  if (filters.month) filtered = filtered.filter((r) => r.month === filters.month);
  const baseRows = !hasFilters ? [...source] : filtered;
  return baseRows.map((r) => ({
    ...r,
    recommendation: recommendationForOperatorLens(r, role),
    recommendation_engine: role === 'packaging' ? 'packaging_line' : 'processing_line',
  }));
};

export const mockMaintenance = [
  {
    year: 2023,
    month: 'February',
    day: 15,
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-GEN-003',
    asset_type: 'Generator',
    maintenance_type: 'Preventive',
    status: 'In Progress',
    scheduled_date: '2023-02-15',
    estimated_duration_hours: 8,
  },
  {
    year: 2023,
    month: 'February',
    day: 22,
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-GEN-001',
    asset_type: 'Generator',
    maintenance_type: 'Emergency',
    status: 'Scheduled',
    scheduled_date: '2023-02-22',
    estimated_duration_hours: 12,
  },
  {
    year: 2023,
    month: 'March',
    day: 5,
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-PUMP-001',
    asset_type: 'Motor Pump',
    maintenance_type: 'Preventive',
    status: 'Scheduled',
    scheduled_date: '2023-03-05',
    estimated_duration_hours: 6,
  },
];

export const mockMaintenanceProcessing = [
  {
    year: 2023,
    month: 'February',
    day: 14,
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-PUMP-001',
    asset_type: 'Motor Pump',
    maintenance_type: 'Emergency',
    status: 'In Progress',
    scheduled_date: '2023-02-14',
    estimated_duration_hours: 10,
  },
  {
    year: 2023,
    month: 'February',
    day: 18,
    state: 'Beloit',
    plant: 'P01 - Beloit',
    asset_id: 'BEL-GEN-003',
    asset_type: 'Generator',
    maintenance_type: 'Preventive',
    status: 'Scheduled',
    scheduled_date: '2023-02-18',
    estimated_duration_hours: 12,
  },
  {
    year: 2023,
    month: 'February',
    day: 20,
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-COMP-003',
    asset_type: 'Motor Compressor',
    maintenance_type: 'Emergency',
    status: 'Scheduled',
    scheduled_date: '2023-02-20',
    estimated_duration_hours: 14,
  },
  {
    year: 2023,
    month: 'March',
    day: 2,
    state: 'Jonesboro',
    plant: 'P01 - Jonesboro',
    asset_id: 'JON-PUMP-002',
    asset_type: 'Motor Pump',
    maintenance_type: 'Preventive',
    status: 'Scheduled',
    scheduled_date: '2023-03-02',
    estimated_duration_hours: 5,
  },
];

export const getMaintenanceSchedule = (filters = {}, opts = {}) => {
  const source = resolveOperatorRole(opts) === 'processing' ? mockMaintenanceProcessing : mockMaintenance;
  let filtered = [...source];
  const hasFilters = filters.state || filters.plant || filters.asset_id || filters.year || filters.month;
  if (filters.state) filtered = filtered.filter((m) => m.state === filters.state);
  if (filters.plant) filtered = filtered.filter((m) => m.plant === filters.plant);
  if (filters.asset_id) filtered = filtered.filter((m) => m.asset_id === filters.asset_id);
  if (filters.year) filtered = filtered.filter((m) => m.year === filters.year);
  if (filters.month) {
    const monthMap = {
      Jan: 'January',
      Feb: 'February',
      Mar: 'March',
      Apr: 'April',
      May: 'May',
      Jun: 'June',
      Jul: 'July',
      Aug: 'August',
      Sep: 'September',
      Oct: 'October',
      Nov: 'November',
      Dec: 'December',
    };
    const monthName = monthMap[filters.month] || filters.month;
    filtered = filtered.filter((m) => m.month === monthName || m.month === filters.month);
  }
  if (!hasFilters) return source;
  return filtered;
};
