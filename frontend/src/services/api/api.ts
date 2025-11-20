import axios from 'axios';
import { getApiBaseUrl } from '../../utils/apiConfig';

// Create axios instance with a default baseURL (will be overridden dynamically)
const api = axios.create({
  baseURL: '/api', // Default, will be overridden by interceptor
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to dynamically set baseURL based on current hostname
api.interceptors.request.use((config) => {
  // Dynamically get the correct API base URL based on current hostname
  const apiBaseUrl = getApiBaseUrl();
  config.baseURL = apiBaseUrl;
  
  // Add auth token to requests if available
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

