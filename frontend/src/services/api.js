import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      error.message = 'Cannot connect to backend server. Please ensure it is running on http://localhost:8000';
    }
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export const getAssets = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.state) params.append('state', filters.state);
  if (filters.plant) params.append('plant', filters.plant);
  if (filters.asset_id) params.append('asset_id', filters.asset_id);
  
  const response = await api.get(`/api/assets?${params.toString()}`);
  return response.data;
};

export const getAssetSummary = async () => {
  const response = await api.get('/api/assets/summary');
  return response.data;
};

export const getAnomalies = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.state) params.append('state', filters.state);
  if (filters.plant) params.append('plant', filters.plant);
  if (filters.asset_id) params.append('asset_id', filters.asset_id);
  
  const response = await api.get(`/api/anomalies?${params.toString()}`);
  return response.data;
};

export const getRootCauseAnalysis = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.state) params.append('state', filters.state);
  if (filters.plant) params.append('plant', filters.plant);
  if (filters.asset_id) params.append('asset_id', filters.asset_id);
  if (filters.rul_threshold) params.append('rul_threshold', filters.rul_threshold);
  
  const response = await api.get(`/api/root-cause?${params.toString()}`);
  return response.data;
};

export const getRecommendations = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.state) params.append('state', filters.state);
  if (filters.plant) params.append('plant', filters.plant);
  if (filters.asset_id) params.append('asset_id', filters.asset_id);
  if (filters.year) params.append('year', filters.year);
  if (filters.month) params.append('month', filters.month);
  
  const response = await api.get(`/api/recommendations?${params.toString()}`);
  return response.data;
};

export const getMaintenanceSchedule = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.state) params.append('state', filters.state);
  if (filters.plant) params.append('plant', filters.plant);
  if (filters.asset_id) params.append('asset_id', filters.asset_id);
  
  const response = await api.get(`/api/maintenance?${params.toString()}`);
  return response.data;
};

export const getAIRecommendations = async (requestData) => {
  const response = await api.post('/api/ai/recommendations', requestData);
  return response.data;
};

export const getAIAnalysis = async (requestData) => {
  const response = await api.post('/api/ai/analysis', requestData);
  return response.data;
};

