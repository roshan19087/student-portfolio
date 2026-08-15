import { UploadResponseDto } from '@portfolio/shared';

export const mediaService = {
  async uploadFile(file: File): Promise<UploadResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/v1/admin/media/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMsg = data?.error?.message || `Upload failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return (data?.data !== undefined ? data.data : data) as UploadResponseDto;
  },

  async deleteFile(storageKey: string): Promise<void> {
    const response = await fetch(`/api/v1/admin/media/${encodeURIComponent(storageKey)}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.error?.message || `Deletion failed with status ${response.status}`);
    }
  },
};
