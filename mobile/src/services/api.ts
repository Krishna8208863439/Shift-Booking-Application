import axios, { AxiosError, AxiosInstance } from 'axios';
import { Platform } from 'react-native';

/**
 * Determines the default API base URL based on the runtime platform.
 * - Android Emulator uses 10.0.2.2 to reach the development host machine
 * - iOS Simulator and Web use localhost (127.0.0.1)
 * - Physical devices can supply their computer's LAN IP via EXPO_PUBLIC_API_URL
 */
function getDefaultBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  return 'http://localhost:8080';
}

let currentBaseUrl: string = getDefaultBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: currentBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Updates the base URL dynamically at runtime (useful for testing on physical devices)
 */
export function setApiBaseUrl(newUrl: string): void {
  currentBaseUrl = newUrl.replace(/\/+$/, '');
  apiClient.defaults.baseURL = currentBaseUrl;
}

export function getApiBaseUrl(): string {
  return currentBaseUrl;
}

/**
 * Real-time connection check that actively pings the backend
 */
export async function pingBackend(): Promise<boolean> {
  try {
    const res = await apiClient.get('/shifts', { timeout: 4000 });
    return res.status === 200 && Array.isArray(res.data);
  } catch {
    return false;
  }
}

/**
 * Standardizes API error messages into user-friendly strings.
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    
    // Server responded with a custom error message (e.g. Hapi/Boom error)
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }

    // Network error / server not reachable
    if (axiosError.code === 'ECONNABORTED') {
      return 'The request timed out. Please check your connection and try again.';
    }

    if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
      return `Unable to connect to the backend server at ${currentBaseUrl}. Please ensure the API is running (npm start).`;
    }

    // HTTP Status Fallbacks
    switch (axiosError.response?.status) {
      case 400:
        return 'Invalid shift request. Please refresh and try again.';
      case 404:
        return 'The requested shift was not found.';
      case 409:
        return 'A scheduling conflict occurred for this shift.';
      case 500:
      case 502:
      case 503:
        return 'Server error. Please try again shortly.';
      default:
        return `Request failed with status ${axiosError.response?.status}`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
