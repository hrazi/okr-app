import axios from 'axios';
import { Summary, WorkItem, ApiResponse } from '../types/api';

const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const summariesApi = {
  getAll: async (): Promise<Summary[]> => {
    const response = await api.get<ApiResponse<Summary[]>>('/summaries');
    return response.data.data;
  },

  getById: async (id: number): Promise<Summary> => {
    const response = await api.get<ApiResponse<Summary>>(`/summaries/${id}`);
    return response.data.data;
  }
};

export const workItemsApi = {
  getAll: async (): Promise<WorkItem[]> => {
    const response = await api.get<ApiResponse<WorkItem[]>>('/work-items');
    return response.data.data;
  },

  getBySummary: async (summaryId: number): Promise<WorkItem[]> => {
    const response = await api.get<ApiResponse<WorkItem[]>>('/work-items', {
      params: { summary_id: summaryId }
    });
    return response.data.data;
  }
};

export default api;