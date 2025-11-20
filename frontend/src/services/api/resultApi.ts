import axios from 'axios';
import { Result, CreateResultData, ResultFilters } from '../../types/result.types';
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

export const resultApi = {
  create: async (data: CreateResultData): Promise<Result> => {
    const formData = new FormData();
    formData.append('studentName', data.studentName);
    formData.append('standardId', data.standardId);
    formData.append('medium', data.medium);
    if (data.totalMarks) formData.append('totalMarks', data.totalMarks.toString());
    if (data.obtainedMarks) formData.append('obtainedMarks', data.obtainedMarks.toString());
    formData.append('percentage', data.percentage.toString());
    formData.append('villageId', data.villageId);
    if (data.contactNumber) formData.append('contactNumber', data.contactNumber);
    if (data.resultImage) formData.append('resultImage', data.resultImage);

    const response = await api.post<{ status: string; data: Result }>('/results', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  getAll: async (filters?: ResultFilters): Promise<{ data: Result[]; pagination: any }> => {
    const response = await api.get<{ status: string; data: Result[]; pagination: any }>('/results', {
      params: filters,
    });
    return { data: response.data.data, pagination: response.data.pagination };
  },

  getById: async (id: string): Promise<Result> => {
    const response = await api.get<{ status: string; data: Result }>(`/results/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateResultData>): Promise<Result> => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof CreateResultData];
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.put<{ status: string; data: Result }>(`/results/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/results/${id}`);
  },
};

