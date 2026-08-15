import { apiClient } from './apiClient.js';
import { AdminContactMessageDto } from '@portfolio/shared';

export const messageService = {
  async getMessages(filter?: {
    isRead?: boolean;
    isArchived?: boolean;
  }): Promise<AdminContactMessageDto[]> {
    const params = new URLSearchParams();
    if (filter?.isRead !== undefined) params.append('isRead', String(filter.isRead));
    if (filter?.isArchived !== undefined) params.append('isArchived', String(filter.isArchived));

    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiClient<AdminContactMessageDto[]>(`/api/v1/admin/messages${qs}`);
  },

  async getMessageById(id: string): Promise<AdminContactMessageDto> {
    return apiClient<AdminContactMessageDto>(`/api/v1/admin/messages/${id}`);
  },

  async markRead(id: string, isRead: boolean = true): Promise<AdminContactMessageDto> {
    return apiClient<AdminContactMessageDto>(`/api/v1/admin/messages/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead }),
    });
  },

  async archiveMessage(id: string, isArchived: boolean = true): Promise<AdminContactMessageDto> {
    return apiClient<AdminContactMessageDto>(`/api/v1/admin/messages/${id}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ isArchived }),
    });
  },

  async deleteMessage(id: string): Promise<void> {
    return apiClient<void>(`/api/v1/admin/messages/${id}`, {
      method: 'DELETE',
    });
  },
};
