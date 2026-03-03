// Mock data for PEPSICO MANAGEMENT SYSTEM

export const mockAssets = [
  {
    asset_id: "CASF1427567615",
    state: "California",
    plant: "P01 - San Francisco",
    asset_type: "Motor Pump",
    status: "Failure Predicted",
    criticality: "High",
    location: { lat: 37.7749, lon: -122.4194 },
    rul: 700
  },
  {
    asset_id: "CASF1759317908",
    state: "California",
    plant: "P01 - San Francisco",
    asset_type: "Motor Compressor",
    status: "Working",
    criticality: "Medium",
    location: { lat: 37.7749, lon: -122.4194 },
    rul: 1200
  },
  {
    asset_id: "CASF1243678649",
    state: "California",
    plant: "P01 - San Francisco",
    asset_type: "Motor Fan",
    status: "Working",
    criticality: "Low",
    location: { lat: 37.7749, lon: -122.4194 },
    rul: 1500
  },
  {
    asset_id: "CASF1447361400",
    state: "California",
    plant: "P01 - San Francisco",
    asset_type: "Generator",
    status: "Working",
    criticality: "Medium",
    location: { lat: 37.7749, lon: -122.4194 },
    rul: 1100
  },
  {
    asset_id: "CASF175811708",
    state: "California",
    plant: "P01 - San Francisco",
    asset_type: "Motor Pump",
    status: "Under Maintenance",
    criticality: "High",
    location: { lat: 37.7749, lon: -122.4194 },
    rul: 600
  },
  {
    asset_id: "CABK2148259407",
    state: "California",
    plant: "P02 - Bakersfield",
    asset_type: "Motor Compressor",
    status: "Working",
    criticality: "Medium",
    location: { lat: 35.3733, lon: -119.0187 },
    rul: 1300
  },
  {
    asset_id: "CABK2526194640",
    state: "California",
    plant: "P02 - Bakersfield",
    asset_type: "Motor Pump",
    status: "Failure Predicted",
    criticality: "Medium",
    location: { lat: 35.3733, lon: -119.0187 },
    rul: 750
  },
  {
    asset_id: "LABR4903786667",
    state: "Louisiana",
    plant: "P02 - Baton Rouge",
    asset_type: "Generator",
    status: "Breakdown",
    criticality: "High",
    location: { lat: 30.4515, lon: -91.1871 },
    rul: 0
  },
  {
    asset_id: "LABR4956922143",
    state: "Louisiana",
    plant: "P02 - Baton Rouge",
    asset_type: "Motor Pump",
    status: "Breakdown",
    criticality: "High",
    location: { lat: 30.4515, lon: -91.1871 },
    rul: 0
  },
  {
    asset_id: "NDBS2148259407",
    state: "North Dakota",
    plant: "P02 - Bismarck",
    asset_type: "Motor Compressor",
    status: "Failure Predicted",
    criticality: "Medium",
    location: { lat: 46.8083, lon: -100.7837 },
    rul: 650
  },
  {
    asset_id: "NDBS2526194640",
    state: "North Dakota",
    plant: "P02 - Bismarck",
    asset_type: "Motor Pump",
    status: "Breakdown",
    criticality: "High",
    location: { lat: 46.8083, lon: -100.7837 },
    rul: 0
  },
  {
    asset_id: "NCRL5809796633",
    state: "North Carolina",
    plant: "P01 - Raleigh",
    asset_type: "Motor Fan",
    status: "Breakdown",
    criticality: "Medium",
    location: { lat: 35.7796, lon: -78.6382 },
    rul: 0
  },
  {
    asset_id: "NYAL1789012345",
    state: "New York",
    plant: "P01 - Albany",
    asset_type: "Motor Compressor",
    status: "Working",
    criticality: "Medium",
    location: { lat: 42.6526, lon: -73.7562 },
    rul: 1300
  },
  {
    asset_id: "LALF9567890123",
    state: "Louisiana",
    plant: "P01 - Lafayette",
    asset_type: "Generator",
    status: "Failure Predicted",
    criticality: "Medium",
    location: { lat: 30.2241, lon: -92.0198 },
    rul: 700
  }
];

export const getAssetSummary = () => {
  const summary = {
    total: mockAssets.length,
    working: 0,
    failure_predicted: 0,
    under_maintenance: 0,
    breakdown: 0
  };

  mockAssets.forEach(asset => {
    const status = asset.status.toLowerCase();
    if (status === "working") summary.working++;
    else if (status === "failure predicted") summary.failure_predicted++;
    else if (status === "under maintenance") summary.under_maintenance++;
    else if (status === "breakdown") summary.breakdown++;
  });

  return summary;
};

export const getAssetsFiltered = (filters = {}) => {
  let filtered = [...mockAssets];
  
  if (filters.state) {
    filtered = filtered.filter(a => a.state === filters.state);
  }
  if (filters.plant) {
    filtered = filtered.filter(a => a.plant === filters.plant);
  }
  if (filters.asset_id) {
    filtered = filtered.filter(a => a.asset_id === filters.asset_id);
  }
  
  return filtered;
};

// Mock anomalies data - expanded with more variety
export const mockAnomalies = [
  // CASF1427567615 - High vibration (Failure Predicted)
  { time: "00:00", vibration: 45.2, temperature: 142.5, asset_id: "CASF1427567615", state: "California", plant: "P01 - San Francisco" },
  { time: "03:00", vibration: 48.7, temperature: 145.3, asset_id: "CASF1427567615", state: "California", plant: "P01 - San Francisco" },
  { time: "06:00", vibration: 52.1, temperature: 148.1, asset_id: "CASF1427567615", state: "California", plant: "P01 - San Francisco" },
  { time: "09:00", vibration: 55.8, temperature: 150.2, asset_id: "CASF1427567615", state: "California", plant: "P01 - San Francisco" },
  { time: "12:00", vibration: 58.3, temperature: 152.7, asset_id: "CASF1427567615", state: "California", plant: "P01 - San Francisco" },
  { time: "15:00", vibration: 61.2, temperature: 155.1, asset_id: "CASF1427567615", state: "California", plant: "P01 - San Francisco" },
  { time: "18:00", vibration: 59.8, temperature: 153.4, asset_id: "CASF1427567615", state: "California", plant: "P01 - San Francisco" },
  { time: "21:00", vibration: 57.1, temperature: 151.2, asset_id: "CASF1427567615", state: "California", plant: "P01 - San Francisco" },
  // CASF1759317908 - Normal (Working)
  { time: "00:00", vibration: 32.5, temperature: 138.2, asset_id: "CASF1759317908", state: "California", plant: "P01 - San Francisco" },
  { time: "03:00", vibration: 34.1, temperature: 139.5, asset_id: "CASF1759317908", state: "California", plant: "P01 - San Francisco" },
  { time: "06:00", vibration: 35.8, temperature: 140.8, asset_id: "CASF1759317908", state: "California", plant: "P01 - San Francisco" },
  { time: "09:00", vibration: 36.2, temperature: 141.2, asset_id: "CASF1759317908", state: "California", plant: "P01 - San Francisco" },
  { time: "12:00", vibration: 37.5, temperature: 142.5, asset_id: "CASF1759317908", state: "California", plant: "P01 - San Francisco" },
  { time: "15:00", vibration: 38.1, temperature: 143.1, asset_id: "CASF1759317908", state: "California", plant: "P01 - San Francisco" },
  { time: "18:00", vibration: 36.8, temperature: 141.8, asset_id: "CASF1759317908", state: "California", plant: "P01 - San Francisco" },
  { time: "21:00", vibration: 35.2, temperature: 140.2, asset_id: "CASF1759317908", state: "California", plant: "P01 - San Francisco" },
  // LABR4903786667 - Critical (Breakdown) - Shows clear threshold crossings
  { time: "00:00", vibration: 85.3, temperature: 165.2, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "03:00", vibration: 92.1, temperature: 168.5, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "06:00", vibration: 98.5, temperature: 172.1, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" }, // Just below 100
  { time: "06:30", vibration: 102.5, temperature: 173.5, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" }, // CROSSES 100 threshold
  { time: "09:00", vibration: 108.2, temperature: 175.8, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "12:00", vibration: 118.5, temperature: 178.9, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" }, // Just below 120
  { time: "12:30", vibration: 122.8, temperature: 179.8, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" }, // CROSSES 120 critical threshold
  { time: "15:00", vibration: 125.3, temperature: 181.2, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "18:00", vibration: 120.7, temperature: 179.5, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "21:00", vibration: 115.9, temperature: 176.3, asset_id: "LABR4903786667", state: "Louisiana", plant: "P02 - Baton Rouge" },
  // NDBS2148259407 - Moderate (Failure Predicted) - Shows clear threshold crossings
  { time: "00:00", vibration: 62.3, temperature: 148.5, asset_id: "NDBS2148259407", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "03:00", vibration: 65.7, temperature: 151.2, asset_id: "NDBS2148259407", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "06:00", vibration: 68.9, temperature: 153.8, asset_id: "NDBS2148259407", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "09:00", vibration: 72.1, temperature: 156.2, asset_id: "NDBS2148259407", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "12:00", vibration: 75.5, temperature: 158.7, asset_id: "NDBS2148259407", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "15:00", vibration: 78.2, temperature: 161.1, asset_id: "NDBS2148259407", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "18:00", vibration: 76.8, temperature: 159.5, asset_id: "NDBS2148259407", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "21:00", vibration: 71.3, temperature: 157.2, asset_id: "NDBS2148259407", state: "North Dakota", plant: "P02 - Bismarck" },
  // CABK2526194640 - Failure Predicted - Shows clear threshold crossings
  { time: "00:00", vibration: 68.5, temperature: 154.2, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "03:00", vibration: 71.2, temperature: 156.8, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "06:00", vibration: 74.8, temperature: 159.5, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "09:00", vibration: 77.3, temperature: 161.8, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "12:00", vibration: 79.5, temperature: 163.2, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "15:00", vibration: 81.2, temperature: 164.8, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "18:00", vibration: 78.9, temperature: 163.1, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "21:00", vibration: 75.3, temperature: 160.5, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  // CASF175811708 - Under Maintenance
  { time: "00:00", vibration: 42.1, temperature: 145.8, asset_id: "CASF175811708", state: "California", plant: "P01 - San Francisco" },
  { time: "03:00", vibration: 43.5, temperature: 147.2, asset_id: "CASF175811708", state: "California", plant: "P01 - San Francisco" },
  { time: "06:00", vibration: 44.8, temperature: 148.5, asset_id: "CASF175811708", state: "California", plant: "P01 - San Francisco" },
  { time: "09:00", vibration: 46.2, temperature: 149.8, asset_id: "CASF175811708", state: "California", plant: "P01 - San Francisco" },
  { time: "12:00", vibration: 45.9, temperature: 149.2, asset_id: "CASF175811708", state: "California", plant: "P01 - San Francisco" },
  { time: "15:00", vibration: 44.3, temperature: 148.1, asset_id: "CASF175811708", state: "California", plant: "P01 - San Francisco" },
  { time: "18:00", vibration: 43.7, temperature: 147.5, asset_id: "CASF175811708", state: "California", plant: "P01 - San Francisco" },
  { time: "21:00", vibration: 42.5, temperature: 146.2, asset_id: "CASF175811708", state: "California", plant: "P01 - San Francisco" },
  // CABK2526194640 - Failure Predicted
  { time: "00:00", vibration: 68.5, temperature: 154.2, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "03:00", vibration: 71.2, temperature: 156.8, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "06:00", vibration: 74.8, temperature: 159.5, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "09:00", vibration: 77.3, temperature: 161.8, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "12:00", vibration: 79.5, temperature: 163.2, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "15:00", vibration: 81.2, temperature: 164.8, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "18:00", vibration: 78.9, temperature: 163.1, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  { time: "21:00", vibration: 75.3, temperature: 160.5, asset_id: "CABK2526194640", state: "California", plant: "P02 - Bakersfield" },
  // LABR4956922143 - Breakdown - Shows clear threshold crossings
  { time: "00:00", vibration: 95.2, temperature: 172.5, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "03:00", vibration: 98.7, temperature: 175.2, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "06:00", vibration: 99.2, temperature: 178.5, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" }, // Just below 100
  { time: "06:15", vibration: 101.8, temperature: 179.2, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" }, // CROSSES 100 threshold
  { time: "09:00", vibration: 108.5, temperature: 181.5, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "12:00", vibration: 119.2, temperature: 185.8, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" }, // Just below 120
  { time: "12:45", vibration: 121.5, temperature: 186.5, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" }, // CROSSES 120 critical threshold
  { time: "15:00", vibration: 123.7, temperature: 187.5, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "18:00", vibration: 119.3, temperature: 186.2, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" },
  { time: "21:00", vibration: 115.8, temperature: 183.5, asset_id: "LABR4956922143", state: "Louisiana", plant: "P02 - Baton Rouge" },
  // NCRL5809796633 - Breakdown - Shows clear threshold crossings
  { time: "00:00", vibration: 88.5, temperature: 168.2, asset_id: "NCRL5809796633", state: "North Carolina", plant: "P01 - Raleigh" },
  { time: "03:00", vibration: 91.2, temperature: 170.5, asset_id: "NCRL5809796633", state: "North Carolina", plant: "P01 - Raleigh" },
  { time: "06:00", vibration: 94.8, temperature: 173.2, asset_id: "NCRL5809796633", state: "North Carolina", plant: "P01 - Raleigh" },
  { time: "09:00", vibration: 99.5, temperature: 176.8, asset_id: "NCRL5809796633", state: "North Carolina", plant: "P01 - Raleigh" }, // Just below 100
  { time: "09:30", vibration: 102.8, temperature: 177.5, asset_id: "NCRL5809796633", state: "North Carolina", plant: "P01 - Raleigh" }, // CROSSES 100 threshold
  { time: "12:00", vibration: 105.2, temperature: 179.5, asset_id: "NCRL5809796633", state: "North Carolina", plant: "P01 - Raleigh" },
  { time: "15:00", vibration: 103.8, temperature: 181.2, asset_id: "NCRL5809796633", state: "North Carolina", plant: "P01 - Raleigh" },
  { time: "18:00", vibration: 100.5, temperature: 179.8, asset_id: "NCRL5809796633", state: "North Carolina", plant: "P01 - Raleigh" },
  { time: "21:00", vibration: 97.2, temperature: 177.5, asset_id: "NCRL5809796633", state: "North Carolina", plant: "P01 - Raleigh" },
  // NDBS2526194640 - Breakdown
  { time: "00:00", vibration: 82.3, temperature: 162.5, asset_id: "NDBS2526194640", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "03:00", vibration: 85.7, temperature: 165.2, asset_id: "NDBS2526194640", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "06:00", vibration: 89.2, temperature: 168.5, asset_id: "NDBS2526194640", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "09:00", vibration: 92.8, temperature: 171.8, asset_id: "NDBS2526194640", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "12:00", vibration: 96.5, temperature: 174.2, asset_id: "NDBS2526194640", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "15:00", vibration: 99.2, temperature: 176.5, asset_id: "NDBS2526194640", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "18:00", vibration: 97.8, temperature: 175.2, asset_id: "NDBS2526194640", state: "North Dakota", plant: "P02 - Bismarck" },
  { time: "21:00", vibration: 94.5, temperature: 172.8, asset_id: "NDBS2526194640", state: "North Dakota", plant: "P02 - Bismarck" }
];

export const getAnomalies = (filters = {}) => {
  let filtered = [...mockAnomalies];
  
  if (filters.asset_id) {
    filtered = filtered.filter(a => a.asset_id === filters.asset_id);
  }
  if (filters.state) {
    filtered = filtered.filter(a => a.state === filters.state);
  }
  if (filters.plant) {
    filtered = filtered.filter(a => a.plant === filters.plant);
  }
  
  return filtered;
};

// Mock root cause data
export const mockRootCauses = {
  total_assets: 14,
  flow: {
    state: {
      "California": 7,
      "Louisiana": 3,
      "North Carolina": 1,
      "North Dakota": 2,
      "New York": 1
    },
    plant: {
      "P01 - San Francisco": 5,
      "P02 - Bakersfield": 2,
      "P02 - Baton Rouge": 2,
      "P01 - Lafayette": 1,
      "P01 - Albany": 1,
      "P01 - Raleigh": 1,
      "P02 - Bismarck": 2
    },
    asset_id: {
      "CASF1427567615": {
        rul_threshold: 700,
        root_causes: [
          { cause: "Bearing Misalign", probability: 0.75 },
          { cause: "Bolt Loosened", probability: 0.18 },
          { cause: "Structural Crack", probability: 0.07 }
        ]
      },
      "CASF1243678649": {
        rul_threshold: 1500,
        root_causes: [
          { cause: "Normal Wear", probability: 0.85 },
          { cause: "Bearing Misalign", probability: 0.10 },
          { cause: "Lubrication Issue", probability: 0.05 }
        ]
      },
      "CASF1447361400": {
        rul_threshold: 1100,
        root_causes: [
          { cause: "Normal Wear", probability: 0.80 },
          { cause: "Bolt Loosened", probability: 0.15 },
          { cause: "Bearing Misalign", probability: 0.05 }
        ]
      },
      "CASF175811708": {
        rul_threshold: 600,
        root_causes: [
          { cause: "Bearing Misalign", probability: 0.65 },
          { cause: "Structural Crack", probability: 0.25 },
          { cause: "Bolt Loosened", probability: 0.10 }
        ]
      },
      "NDBS2148259407": {
        rul_threshold: 650,
        root_causes: [
          { cause: "Bearing Misalign", probability: 0.70 },
          { cause: "Bolt Loosened", probability: 0.20 },
          { cause: "Lubrication Issue", probability: 0.10 }
        ]
      },
      "LABR4903786667": {
        rul_threshold: 0,
        root_causes: [
          { cause: "Bearing Failure", probability: 0.85 },
          { cause: "Structural Crack", probability: 0.10 },
          { cause: "Bolt Loosened", probability: 0.05 }
        ],
        past_events: [
          { date: "2023-02-20", time: "06:30", type: "vibration", threshold: "warning", value: 102.5, previous: 98.5, description: "Vibration crossed warning threshold (100 mm/s²) - First indication of bearing issues" },
          { date: "2023-02-20", time: "12:30", type: "vibration", threshold: "critical", value: 122.8, previous: 118.5, description: "Vibration crossed critical threshold (120 mm/s²) - Immediate shutdown required" },
          { date: "2023-02-20", time: "12:30", type: "temperature", threshold: "critical", value: 179.8, previous: 178.9, description: "Temperature crossed critical threshold (180°F) - Overheating detected" }
        ]
      },
      "LABR4956922143": {
        rul_threshold: 0,
        root_causes: [
          { cause: "Bearing Failure", probability: 0.80 },
          { cause: "Structural Crack", probability: 0.15 },
          { cause: "Bolt Loosened", probability: 0.05 }
        ],
        past_events: [
          { date: "2023-02-18", time: "06:15", type: "vibration", threshold: "warning", value: 101.8, previous: 99.2, description: "Vibration crossed warning threshold (100 mm/s²)" },
          { date: "2023-02-18", time: "12:45", type: "vibration", threshold: "critical", value: 121.5, previous: 119.2, description: "Vibration crossed critical threshold (120 mm/s²) - Catastrophic failure imminent" },
          { date: "2023-02-18", time: "12:45", type: "temperature", threshold: "critical", value: 186.5, previous: 185.8, description: "Temperature crossed critical threshold (180°F) - Severe overheating" }
        ]
      },
      "NCRL5809796633": {
        rul_threshold: 0,
        root_causes: [
          { cause: "Bearing Failure", probability: 0.75 },
          { cause: "Bolt Loosened", probability: 0.20 },
          { cause: "Lubrication Issue", probability: 0.05 }
        ],
        past_events: [
          { date: "2023-02-22", time: "09:30", type: "vibration", threshold: "warning", value: 102.8, previous: 99.5, description: "Vibration crossed warning threshold (100 mm/s²) - Progressive degradation detected" }
        ]
      }
    },
    rul_threshold: {
      "700": {
        asset_id: "CASF1427567615",
        root_causes: [
          { cause: "Bearing Misalign", probability: 0.75 },
          { cause: "Bolt Loosened", probability: 0.18 },
          { cause: "Structural Crack", probability: 0.07 }
        ]
      },
      "650": {
        asset_id: "NDBS2148259407",
        root_causes: [
          { cause: "Bearing Misalign", probability: 0.70 },
          { cause: "Bolt Loosened", probability: 0.20 },
          { cause: "Lubrication Issue", probability: 0.10 }
        ]
      }
    }
  }
};

export const getRootCauseAnalysis = (filters = {}) => {
  return mockRootCauses;
};

// Mock recommendations - expanded with more variety
export const mockRecommendations = [
  {
    year: 2023,
    month: "February",
    state: "North Dakota",
    plant: "P02 - Bismarck",
    asset_id: "NDBS2148259407",
    asset_type: "Motor Compressor",
    status: "Failure Predicted",
    criticality: "Low",
    recommendation: "Investigation Required"
  },
  {
    year: 2023,
    month: "February",
    state: "Louisiana",
    plant: "P02 - Baton Rouge",
    asset_id: "LABR4903786667",
    asset_type: "Generator",
    status: "Breakdown",
    criticality: "High",
    recommendation: "Immediate Maintenance Required"
  },
  {
    year: 2023,
    month: "February",
    state: "Louisiana",
    plant: "P02 - Baton Rouge",
    asset_id: "LABR4956922143",
    asset_type: "Motor Pump",
    status: "Breakdown",
    criticality: "High",
    recommendation: "Immediate Maintenance Required"
  },
  {
    year: 2023,
    month: "February",
    state: "California",
    plant: "P01 - San Francisco",
    asset_id: "CASF1427567615",
    asset_type: "Motor Pump",
    status: "Failure Predicted",
    criticality: "High",
    recommendation: "Immediate Maintenance Required"
  },
  {
    year: 2023,
    month: "February",
    state: "North Carolina",
    plant: "P01 - Raleigh",
    asset_id: "NCRL5809796633",
    asset_type: "Motor Fan",
    status: "Breakdown",
    criticality: "Medium",
    recommendation: "Immediate Maintenance Required"
  },
  {
    year: 2023,
    month: "February",
    state: "California",
    plant: "P01 - San Francisco",
    asset_id: "CASF175811708",
    asset_type: "Motor Compressor",
    status: "Under Maintenance",
    criticality: "High",
    recommendation: null
  },
  {
    year: 2023,
    month: "February",
    state: "California",
    plant: "P02 - Bakersfield",
    asset_id: "CABK2526194640",
    asset_type: "Motor Pump",
    status: "Failure Predicted",
    criticality: "Medium",
    recommendation: null
  },
  {
    year: 2023,
    month: "February",
    state: "North Dakota",
    plant: "P02 - Bismarck",
    asset_id: "NDBS2526194640",
    asset_type: "Motor Pump",
    status: "Breakdown",
    criticality: "High",
    recommendation: "Immediate Maintenance Required"
  },
  {
    year: 2023,
    month: "March",
    state: "California",
    plant: "P01 - San Francisco",
    asset_id: "CASF1427567615",
    asset_type: "Motor Pump",
    status: "Failure Predicted",
    criticality: "High",
    recommendation: null
  },
  {
    year: 2023,
    month: "March",
    state: "Louisiana",
    plant: "P01 - Lafayette",
    asset_id: "LALF9567890123",
    asset_type: "Generator",
    status: "Failure Predicted",
    criticality: "Medium",
    recommendation: null
  },
  {
    year: 2023,
    month: "January",
    state: "New York",
    plant: "P01 - Albany",
    asset_id: "NYAL1789012345",
    asset_type: "Motor Compressor",
    status: "Failure Predicted",
    criticality: "Medium",
    recommendation: "Investigation Required"
  },
  {
    year: 2023,
    month: "April",
    state: "California",
    plant: "P01 - San Francisco",
    asset_id: "CASF1243678649",
    asset_type: "Motor Fan",
    status: "Failure Predicted",
    criticality: "Low",
    recommendation: "Investigation Required"
  },
  {
    year: 2023,
    month: "April",
    state: "California",
    plant: "P02 - Bakersfield",
    asset_id: "CABK2148259407",
    asset_type: "Motor Compressor",
    status: "Under Maintenance",
    criticality: "Medium",
    recommendation: null
  },
  {
    year: 2023,
    month: "May",
    state: "Louisiana",
    plant: "P01 - Lafayette",
    asset_id: "LALF9567890123",
    asset_type: "Generator",
    status: "Breakdown",
    criticality: "High",
    recommendation: "Immediate Maintenance Required"
  },
  {
    year: 2023,
    month: "May",
    state: "North Carolina",
    plant: "P01 - Raleigh",
    asset_id: "NCRL5809796633",
    asset_type: "Motor Fan",
    status: "Under Maintenance",
    criticality: "Medium",
    recommendation: null
  }
];

export const getRecommendations = (filters = {}) => {
  let filtered = [...mockRecommendations];
  
  // If no filters at all, return all recommendations
  const hasFilters = filters.state || filters.plant || filters.asset_id || filters.year || filters.month;
  
  if (filters.state) {
    filtered = filtered.filter(r => r.state === filters.state);
  }
  if (filters.plant) {
    filtered = filtered.filter(r => r.plant === filters.plant);
  }
  if (filters.asset_id) {
    filtered = filtered.filter(r => r.asset_id === filters.asset_id);
  }
  if (filters.year) {
    filtered = filtered.filter(r => r.year === filters.year);
  }
  if (filters.month) {
    filtered = filtered.filter(r => r.month === filters.month);
  }
  
  // If no filters applied, show all recommendations
  if (!hasFilters) {
    return mockRecommendations;
  }
  
  return filtered;
};

// Mock maintenance schedule
export const mockMaintenance = [
  {
    year: 2023,
    month: "February",
    day: 15,
    state: "California",
    plant: "P01 - San Francisco",
    asset_id: "CASF175811708",
    asset_type: "Motor Compressor",
    maintenance_type: "Preventive",
    status: "In Progress",
    scheduled_date: "2023-02-15",
    estimated_duration_hours: 8
  },
  {
    year: 2023,
    month: "February",
    day: 22,
    state: "Louisiana",
    plant: "P02 - Baton Rouge",
    asset_id: "LABR4903786667",
    asset_type: "Generator",
    maintenance_type: "Emergency",
    status: "Scheduled",
    scheduled_date: "2023-02-22",
    estimated_duration_hours: 12
  },
  {
    year: 2023,
    month: "February",
    day: 22,
    state: "Louisiana",
    plant: "P02 - Baton Rouge",
    asset_id: "LABR4956922143",
    asset_type: "Motor Pump",
    maintenance_type: "Emergency",
    status: "Scheduled",
    scheduled_date: "2023-02-22",
    estimated_duration_hours: 10
  },
  {
    year: 2023,
    month: "March",
    day: 5,
    state: "California",
    plant: "P01 - San Francisco",
    asset_id: "CASF1427567615",
    asset_type: "Motor Pump",
    maintenance_type: "Preventive",
    status: "Scheduled",
    scheduled_date: "2023-03-05",
    estimated_duration_hours: 6
  }
];

export const getMaintenanceSchedule = (filters = {}) => {
  let filtered = [...mockMaintenance];
  
  // If no filters at all, return all maintenance schedules
  const hasFilters = filters.state || filters.plant || filters.asset_id || filters.year || filters.month;
  
  if (filters.state) {
    filtered = filtered.filter(m => m.state === filters.state);
  }
  if (filters.plant) {
    filtered = filtered.filter(m => m.plant === filters.plant);
  }
  if (filters.asset_id) {
    filtered = filtered.filter(m => m.asset_id === filters.asset_id);
  }
  if (filters.year) {
    filtered = filtered.filter(m => m.year === filters.year);
  }
  if (filters.month) {
    // Handle both full month names and abbreviations
    const monthMap = {
      'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
      'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
      'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
    };
    const monthName = monthMap[filters.month] || filters.month;
    filtered = filtered.filter(m => m.month === monthName || m.month === filters.month);
  }
  
  // If no filters applied, show all maintenance schedules
  if (!hasFilters) {
    return mockMaintenance;
  }
  
  return filtered;
};

