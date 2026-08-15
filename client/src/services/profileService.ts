import { apiClient } from './apiClient.js';
import { PublicProfileDto, UpdateProfileInput } from '@portfolio/shared';

export const profileService = {
  async getProfile(): Promise<PublicProfileDto> {
    return apiClient<PublicProfileDto>('/api/v1/profile');
  },

  async getAdminProfile(): Promise<PublicProfileDto> {
    return apiClient<PublicProfileDto>('/api/v1/admin/profile');
  },

  async updateAdminProfile(data: UpdateProfileInput): Promise<PublicProfileDto> {
    return apiClient<PublicProfileDto>('/api/v1/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
