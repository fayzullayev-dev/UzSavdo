import { authStorage } from './storage';

// In Expo mobile, localhost is the phone itself.
// We use public tunnel or custom server IP from EXPO_PUBLIC_API_URL.
const DEFAULT_URL = 'https://thousand-korea-saving-paperback.trycloudflare.com/api/v1';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const token = await authStorage.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { error: json.message || json.error || `Xatolik: ${response.status}` };
    }

    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Server bilan aloqa yoʻq' };
  }
}
