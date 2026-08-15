import { apiClient } from './apiClient.js';
import { AdminDashboardStatsDto } from '@portfolio/shared';

export const dashboardService = {
  async getStats(): Promise<AdminDashboardStatsDto> {
    return apiClient<AdminDashboardStatsDto>('/api/v1/admin/stats');
  },
};
