import { apiClient } from './apiClient.js';
import { PublicEducationDto, CreateEducationInput, UpdateEducationInput } from '@portfolio/shared';

export const educationService = {
  async getEducation(): Promise<PublicEducationDto[]> {
    return apiClient<PublicEducationDto[]>('/api/v1/education');
  },

  async getEducationById(id: string): Promise<PublicEducationDto> {
    return apiClient<PublicEducationDto>(`/api/v1/admin/education/${id}`);
  },

  async createEducation(data: CreateEducationInput): Promise<PublicEducationDto> {
    return apiClient<PublicEducationDto>('/api/v1/admin/education', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEducation(id: string, data: UpdateEducationInput): Promise<PublicEducationDto> {
    return apiClient<PublicEducationDto>(`/api/v1/admin/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteEducation(id: string): Promise<void> {
    return apiClient<void>(`/api/v1/admin/education/${id}`, {
      method: 'DELETE',
    });
  },
};
