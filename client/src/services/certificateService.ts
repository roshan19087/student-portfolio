import { apiClient } from './apiClient.js';
import {
  PublicCertificateDto,
  CreateCertificateInput,
  UpdateCertificateInput,
} from '@portfolio/shared';

export const certificateService = {
  async getCertificates(): Promise<PublicCertificateDto[]> {
    return apiClient<PublicCertificateDto[]>('/api/v1/certificates');
  },

  async getCertificateById(id: string): Promise<PublicCertificateDto> {
    return apiClient<PublicCertificateDto>(`/api/v1/admin/certificates/${id}`);
  },

  async createCertificate(data: CreateCertificateInput): Promise<PublicCertificateDto> {
    return apiClient<PublicCertificateDto>('/api/v1/admin/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCertificate(id: string, data: UpdateCertificateInput): Promise<PublicCertificateDto> {
    return apiClient<PublicCertificateDto>(`/api/v1/admin/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCertificate(id: string): Promise<void> {
    return apiClient<void>(`/api/v1/admin/certificates/${id}`, {
      method: 'DELETE',
    });
  },
};
