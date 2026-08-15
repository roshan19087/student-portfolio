import { apiClient } from './apiClient.js';
import {
  PublicSkillCategoryDto,
  PublicSkillDto,
  CreateSkillCategoryInput,
  UpdateSkillCategoryInput,
  CreateSkillInput,
  UpdateSkillInput,
} from '@portfolio/shared';

export const skillService = {
  async getSkills(): Promise<PublicSkillCategoryDto[]> {
    return apiClient<PublicSkillCategoryDto[]>('/api/v1/skills');
  },

  async getSkillCategories(): Promise<PublicSkillCategoryDto[]> {
    return apiClient<PublicSkillCategoryDto[]>('/api/v1/admin/skills/categories');
  },

  async createSkillCategory(data: CreateSkillCategoryInput): Promise<PublicSkillCategoryDto> {
    return apiClient<PublicSkillCategoryDto>('/api/v1/admin/skills/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSkillCategory(
    id: string,
    data: UpdateSkillCategoryInput,
  ): Promise<PublicSkillCategoryDto> {
    return apiClient<PublicSkillCategoryDto>(`/api/v1/admin/skills/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteSkillCategory(id: string): Promise<void> {
    return apiClient<void>(`/api/v1/admin/skills/categories/${id}`, {
      method: 'DELETE',
    });
  },

  async createSkill(data: CreateSkillInput): Promise<PublicSkillDto> {
    return apiClient<PublicSkillDto>('/api/v1/admin/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSkill(id: string, data: UpdateSkillInput): Promise<PublicSkillDto> {
    return apiClient<PublicSkillDto>(`/api/v1/admin/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteSkill(id: string): Promise<void> {
    return apiClient<void>(`/api/v1/admin/skills/${id}`, {
      method: 'DELETE',
    });
  },
};
