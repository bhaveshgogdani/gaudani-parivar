import api from './api';
import { Standard } from '../../types/result.types';

export const standardApi = {
  getAll: async (includeInactive = false): Promise<Standard[]> => {
    const response = await api.get<{ status: string; data: Standard[] }>('/standards', {
      params: { includeInactive },
    });
    return response.data.data;
  },

  getById: async (id: string): Promise<Standard> => {
    const response = await api.get<{ status: string; data: Standard }>(`/standards/${id}`);
    return response.data.data;
  },

  create: async (data: {
    standardName: string;
    standardCode: string;
    displayOrder: number;
    isCollegeLevel?: boolean;
    isActive?: boolean;
  }): Promise<Standard> => {
    const response = await api.post<{ status: string; data: Standard }>('/standards', data);
    return response.data.data;
  },

  update: async (
    id: string,
    data: Partial<{
      standardName: string;
      standardCode: string;
      displayOrder: number;
      isCollegeLevel: boolean;
      isActive: boolean;
    }>
  ): Promise<Standard> => {
    const response = await api.put<{ status: string; data: Standard }>(`/standards/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/standards/${id}`);
  },
};

