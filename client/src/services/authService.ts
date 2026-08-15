import { apiClient } from './apiClient.js';
import { AuthUserDto, LoginInput } from '@portfolio/shared';

export const authService = {
  async login(credentials: LoginInput): Promise<AuthUserDto> {
    const res = await apiClient<{ user: AuthUserDto }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      retryOnUnauthorized: false,
    });
    return res.user || (res as unknown as AuthUserDto);
  },

  async getMe(): Promise<AuthUserDto | null> {
    try {
      const res = await apiClient<{ user: AuthUserDto }>('/api/v1/auth/me', {
        method: 'GET',
      });
      return res.user || (res as unknown as AuthUserDto);
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient<void>('/api/v1/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Ignore logout errors
    }
  },

  async refresh(): Promise<boolean> {
    try {
      await apiClient<{ user: AuthUserDto }>('/api/v1/auth/refresh', {
        method: 'POST',
        retryOnUnauthorized: false,
      });
      return true;
    } catch {
      return false;
    }
  },
};
