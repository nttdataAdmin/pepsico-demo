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
export const getAssetSummaryFiltered = (filters = {}) => buildSummaryFromAssets(getAssetsFiltered(filters));

export const getAssetsFiltered = (filters = {}) => {
  let filtered = [...mockAssets];
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

export const getAnomalies = (filters = {}) => {
  let filtered = [...mockAnomalies];
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

function filterRootCauseFlow(filters = {}) {
  const base = mockRootCauses;
  if (!filters.state) return base;
  const assetsInScope = getAssetsFiltered({
    state: filters.state,
    plant: filters.plant || undefined,
  });
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

export const getRootCauseAnalysis = (filters = {}) => filterRootCauseFlow(filters);

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

export const getRecommendations = (filters = {}) => {
  let filtered = [...mockRecommendations];
  const hasFilters = filters.state || filters.plant || filters.asset_id || filters.year || filters.month;
  if (filters.state) filtered = filtered.filter((r) => r.state === filters.state);
  if (filters.plant) filtered = filtered.filter((r) => r.plant === filters.plant);
  if (filters.asset_id) filtered = filtered.filter((r) => r.asset_id === filters.asset_id);
  if (filters.year) filtered = filtered.filter((r) => r.year === filters.year);
  if (filters.month) filtered = filtered.filter((r) => r.month === filters.month);
  if (!hasFilters) return mockRecommendations;
  return filtered;
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

export const getMaintenanceSchedule = (filters = {}) => {
  let filtered = [...mockMaintenance];
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
  if (!hasFilters) return mockMaintenance;
  return filtered;
};
