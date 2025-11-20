import api from './api';

export const reportApi = {
  getTopThree: async (standardId?: string, medium?: string): Promise<any> => {
    const response = await api.get('/reports/top-three', {
      params: { standardId, medium },
    });
    return response.data.data;
  },

  exportTopThreePdf: async (medium?: string): Promise<Blob> => {
    const response = await api.get('/reports/top-three-pdf', {
      params: { medium },
      responseType: 'blob',
    });
    return response.data;
  },

  exportManageResultsPdf: async (filters?: {
    medium?: string;
    standardId?: string;
    villageId?: string;
  }): Promise<Blob> => {
    const response = await api.get('/reports/manage-results-pdf', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  exportCollegeListByVillage: async (medium?: string): Promise<Blob> => {
    const response = await api.get('/reports/college-list-by-village-pdf', {
      params: { medium },
      responseType: 'blob',
    });
    return response.data;
  },

  exportSchoolListByVillage: async (): Promise<Blob> => {
    const response = await api.get('/reports/school-list-by-village-pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  exportPrintCollege: async (): Promise<Blob> => {
    const response = await api.get('/reports/print-college-pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  getAwardsList: async (rank: 'first' | 'second', standardId?: string, medium?: string): Promise<any> => {
    const response = await api.get(`/reports/awards/${rank}-rank`, {
      params: { standardId, medium },
    });
    return response.data.data;
  },

  getSummary: async (filters?: {
    medium?: string;
    standardId?: string;
    villageId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any> => {
    const response = await api.get('/reports/summary', {
      params: filters,
    });
    return response.data.data;
  },

  exportReport: async (
    format: 'pdf' | 'excel',
    filters?: {
      medium?: string;
      standardId?: string;
      villageId?: string;
    }
  ): Promise<Blob> => {
    const response = await api.get('/reports/export', {
      params: { format, ...filters },
      responseType: 'blob',
    });
    return response.data;
  },

  getByMedium: async (filters?: {
    standardId?: string;
    villageId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any> => {
    const response = await api.get('/reports/by-medium', {
      params: filters,
    });
    return response.data.data;
  },
};

