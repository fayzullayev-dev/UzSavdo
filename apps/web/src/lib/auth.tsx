"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "./api";

interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  role: string;
  regionId: string;
  districtId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const defaultAdminUser: User = {
  id: "admin-id",
  login: "admin",
  firstName: "Admin",
  lastName: "Hokimiyat",
  companyName: "Toshkent shahar Hokimiyati",
  phone: "+998 71 200 00 00",
  role: "ADMIN",
  regionId: "reg-1",
  districtId: "dist-1"
};

const defaultDemoUser: User = {
  id: "demo-id",
  login: "demo",
  firstName: "Alisher",
  lastName: "Usmonov",
  companyName: "Sharq Agro Fayz MCHJ",
  phone: "+998 90 123 45 67",
  role: "USER",
  regionId: "reg-2",
  districtId: "dist-2"
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("uzsavdo_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    // Default to admin so all sections and boshqaruv paneli are visible immediately
    return defaultAdminUser;
  });

  const [loading, setLoading] = useState(false);

  const refreshUser = async () => {
    try {
      const data = await apiFetch("/me");
      if (data && (data.user || data.id)) {
        const u = data.user || data;
        setUser(u);
        if (typeof window !== "undefined") {
          localStorage.setItem("uzsavdo_user", JSON.stringify(u));
        }
      }
    } catch {}
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("uzsavdo_user", JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("uzsavdo_user");
    }
    setUser(null);
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { defaultAdminUser, defaultDemoUser };
