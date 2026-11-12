import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'uzsavdo_access_token';
const REFRESH_TOKEN_KEY = 'uzsavdo_refresh_token';
const USER_KEY = 'uzsavdo_current_user';
const LOCALE_KEY = 'uzsavdo_locale';

// Web fallback for SecureStore if tested in browser
export async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  }
  return await SecureStore.getItemAsync(key);
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function deleteSecureItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const authStorage = {
  getAccessToken: () => getSecureItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => setSecureItem(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => getSecureItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => setSecureItem(REFRESH_TOKEN_KEY, token),
  getUser: async () => {
    const raw = await getSecureItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: any) => setSecureItem(USER_KEY, JSON.stringify(user)),
  clear: async () => {
    await deleteSecureItem(ACCESS_TOKEN_KEY);
    await deleteSecureItem(REFRESH_TOKEN_KEY);
    await deleteSecureItem(USER_KEY);
  },
  getLocale: () => getSecureItem(LOCALE_KEY),
  setLocale: (loc: string) => setSecureItem(LOCALE_KEY, loc),
};
