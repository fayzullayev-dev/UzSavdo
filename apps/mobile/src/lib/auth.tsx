import React, { createContext, useContext, useState, useEffect } from 'react';
import { authStorage } from './storage';
import { apiRequest } from './api';

interface User {
  id: string;
  login: string;
  firstName: string;
  lastName?: string;
  companyName: string;
  phone: string;
  email?: string;
  role: string;
  ratingAvg?: number;
  regionId?: string;
  districtId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { login?: string; phone?: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  updateUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      try {
        const storedToken = await authStorage.getAccessToken();
        const storedUser = await authStorage.getUser();
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadAuth();
  }, []);

  const login = async (credentials: { login?: string; phone?: string; password?: string }) => {
    const res = await apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (res.error || !res.data) {
      return { success: false, error: res.error || 'Kirishda xatolik yuz berdi' };
    }

    setToken(res.data.token);
    setUser(res.data.user);
    await authStorage.setAccessToken(res.data.token);
    await authStorage.setUser(res.data.user);
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await authStorage.clear();
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    await authStorage.setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
