import api from './api';
import { Village } from '../../types/result.types';

export const villageApi = {
  getAll: async (includeInactive = false): Promise<Village[]> => {
    // Use /all endpoint for admin (includes inactive), regular endpoint for public (active only)
    const endpoint = includeInactive ? '/villages/all' : '/villages';
    const response = await api.get<{ status: string; data: Village[] }>(endpoint);
    return response.data.data;
  },

  getById: async (id: string): Promise<Village> => {
    const response = await api.get<{ status: string; data: Village }>(`/villages/${id}`);
    return response.data.data;
  },

  create: async (data: { villageName: string; isActive?: boolean }): Promise<Village> => {
    const response = await api.post<{ status: string; data: Village }>('/villages', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<{ villageName: string; isActive: boolean }>): Promise<Village> => {
    const response = await api.put<{ status: string; data: Village }>(`/villages/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/villages/${id}`);
  },
};

