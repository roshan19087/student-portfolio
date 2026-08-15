import { apiClient } from './apiClient.js';
import {
  PublicProjectListItemDto,
  PublicProjectDetailDto,
  CreateProjectInput,
  UpdateProjectInput,
} from '@portfolio/shared';

export const projectService = {
  async getProjects(featured?: boolean): Promise<PublicProjectListItemDto[]> {
    const qs = featured !== undefined ? `?featured=${featured}` : '';
    return apiClient<PublicProjectListItemDto[]>(`/api/v1/projects${qs}`);
  },

  async getProjectBySlug(slug: string): Promise<PublicProjectDetailDto> {
    return apiClient<PublicProjectDetailDto>(`/api/v1/projects/${slug}`);
  },

  async getAdminProjects(): Promise<PublicProjectDetailDto[]> {
    return apiClient<PublicProjectDetailDto[]>('/api/v1/admin/projects');
  },

  async getAdminProjectById(id: string): Promise<PublicProjectDetailDto> {
    return apiClient<PublicProjectDetailDto>(`/api/v1/admin/projects/${id}`);
  },

  async createProject(data: CreateProjectInput): Promise<PublicProjectDetailDto> {
    return apiClient<PublicProjectDetailDto>('/api/v1/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProject(id: string, data: UpdateProjectInput): Promise<PublicProjectDetailDto> {
    return apiClient<PublicProjectDetailDto>(`/api/v1/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id: string): Promise<void> {
    return apiClient<void>(`/api/v1/admin/projects/${id}`, {
      method: 'DELETE',
    });
  },
};
