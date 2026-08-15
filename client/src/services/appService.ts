import { apiClient } from './apiClient.js';
import {
  PublicAppListItemDto,
  PublicAppDetailDto,
  CreateAppInput,
  UpdateAppInput,
} from '@portfolio/shared';

export const appService = {
  async getApps(): Promise<PublicAppListItemDto[]> {
    return apiClient<PublicAppListItemDto[]>('/api/v1/apps');
  },

  async getAppBySlug(slug: string): Promise<PublicAppDetailDto> {
    return apiClient<PublicAppDetailDto>(`/api/v1/apps/${slug}`);
  },

  async getAdminApps(): Promise<PublicAppDetailDto[]> {
    return apiClient<PublicAppDetailDto[]>('/api/v1/admin/apps');
  },

  async getAdminAppById(id: string): Promise<PublicAppDetailDto> {
    return apiClient<PublicAppDetailDto>(`/api/v1/admin/apps/${id}`);
  },

  async createApp(data: CreateAppInput): Promise<PublicAppDetailDto> {
    return apiClient<PublicAppDetailDto>('/api/v1/admin/apps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateApp(id: string, data: UpdateAppInput): Promise<PublicAppDetailDto> {
    return apiClient<PublicAppDetailDto>(`/api/v1/admin/apps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteApp(id: string): Promise<void> {
    return apiClient<void>(`/api/v1/admin/apps/${id}`, {
      method: 'DELETE',
    });
  },
};
