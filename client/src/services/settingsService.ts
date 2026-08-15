import { apiClient } from './apiClient.js';
import { PublicSiteSettingsDto, UpdateSettingsInput } from '@portfolio/shared';

export const settingsService = {
  async getSettings(): Promise<PublicSiteSettingsDto> {
    return apiClient<PublicSiteSettingsDto>('/api/v1/settings/public');
  },

  async getAdminSettings(): Promise<PublicSiteSettingsDto> {
    return apiClient<PublicSiteSettingsDto>('/api/v1/admin/settings');
  },

  async updateSettings(data: UpdateSettingsInput): Promise<PublicSiteSettingsDto> {
    return apiClient<PublicSiteSettingsDto>('/api/v1/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
