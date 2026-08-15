import { apiClient } from './apiClient.js';
import {
  PublicBlogPostListItemDto,
  PublicBlogPostDetailDto,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from '@portfolio/shared';

export const blogService = {
  async getPosts(tag?: string): Promise<PublicBlogPostListItemDto[]> {
    const qs = tag ? `?tag=${encodeURIComponent(tag)}` : '';
    return apiClient<PublicBlogPostListItemDto[]>(`/api/v1/blog${qs}`);
  },

  async getPostBySlug(slug: string): Promise<PublicBlogPostDetailDto> {
    return apiClient<PublicBlogPostDetailDto>(`/api/v1/blog/${slug}`);
  },

  async getAdminPosts(): Promise<PublicBlogPostDetailDto[]> {
    return apiClient<PublicBlogPostDetailDto[]>('/api/v1/admin/blog');
  },

  async getAdminPostById(id: string): Promise<PublicBlogPostDetailDto> {
    return apiClient<PublicBlogPostDetailDto>(`/api/v1/admin/blog/${id}`);
  },

  async createPost(data: CreateBlogPostInput): Promise<PublicBlogPostDetailDto> {
    return apiClient<PublicBlogPostDetailDto>('/api/v1/admin/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePost(id: string, data: UpdateBlogPostInput): Promise<PublicBlogPostDetailDto> {
    return apiClient<PublicBlogPostDetailDto>(`/api/v1/admin/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePost(id: string): Promise<void> {
    return apiClient<void>(`/api/v1/admin/blog/${id}`, {
      method: 'DELETE',
    });
  },
};
