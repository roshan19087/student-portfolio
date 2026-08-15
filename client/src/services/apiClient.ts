export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  retryOnUnauthorized?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { retryOnUnauthorized = true, headers = {}, ...rest } = options;

  const url = endpoint.startsWith('/') ? endpoint : `/api/v1/${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: defaultHeaders,
  });

  // Handle 401 Unauthorized with token rotation refresh retry
  if (
    response.status === 401 &&
    retryOnUnauthorized &&
    !url.includes('/auth/login') &&
    !url.includes('/auth/refresh')
  ) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      return apiClient<T>(endpoint, { ...options, retryOnUnauthorized: false });
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      data?.error?.message || data?.message || `Request failed with status ${response.status}`;
    const errorCode = data?.error?.code || data?.code;
    throw new ApiError(errorMessage, response.status, errorCode, data?.error?.details);
  }

  return (data?.data !== undefined ? data.data : data) as T;
}
