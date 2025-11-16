import api from './api';

export interface AdminUser {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface DashboardStats {
  totalResults: number;
  totalVillages: number;
  totalStandards: number;
  resultsByMedium: Array<{ _id: string; count: number; averagePercentage: number }>;
  resultsByStandard: Array<{ standardName: string; count: number }>;
  recentResults: any[];
}

export const adminApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<{ status: string; token: string; user: AdminUser }>('/admin/login', {
      email,
      password,
    });
    return {
      token: response.data.token,
      user: response.data.user,
    };
  },

  getDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get<{ status: string; data: DashboardStats }>('/admin/dashboard');
    return response.data.data;
  },
};

